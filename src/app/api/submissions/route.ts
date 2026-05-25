import { NextResponse } from "next/server";
import { z } from "zod";
import { assignments, children } from "@/lib/seed-data";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Assignment, ChildSlug, Submission } from "@/lib/types";

const parentEmail = "brightpath-parent@local.demo";

const gradedAnswerSchema = z.object({
  questionId: z.string(),
  value: z.string(),
  correct: z.boolean(),
  earnedPoints: z.number(),
  maxPoints: z.number(),
  correction: z.string().optional(),
  feedback: z.string().optional(),
  skill: z.string(),
  section: z.string()
});

const submissionSchema = z.object({
  id: z.string(),
  assignmentId: z.string(),
  childId: z.enum(["ella", "evelyn"]),
  submittedAt: z.string(),
  answers: z.array(gradedAnswerSchema),
  score: z.number(),
  maxScore: z.number(),
  percent: z.number(),
  feedback: z.string()
});

type SubmissionRow = {
  id: string;
  assignment_id: string;
  score: number | string;
  max_score: number | string;
  percent: number;
  feedback: string;
  submitted_at: string;
  children?: { slug?: ChildSlug } | Array<{ slug?: ChildSlug }> | null;
  answers: Array<{
    question_id: string;
    value: string;
    correct: boolean;
    earned_points: number | string;
    max_points: number | string;
    correction: string | null;
    feedback: string | null;
    skill: string;
    section: string;
  }>;
};

async function ensureParent() {
  if (!supabaseAdmin) throw new Error("Supabase is not configured");

  const existing = await supabaseAdmin.from("profiles").select("id").eq("email", parentEmail).maybeSingle();
  if (existing.data?.id) return existing.data.id as string;

  const created = await supabaseAdmin.auth.admin.createUser({
    email: parentEmail,
    email_confirm: true,
    user_metadata: { app: "BrightPath Daily" }
  });

  let parentId = created.data.user?.id;

  if (created.error) {
    if (!created.error.message.toLowerCase().includes("already been registered")) {
      throw created.error;
    }

    const users = await supabaseAdmin.auth.admin.listUsers();
    if (users.error) throw users.error;
    parentId = users.data.users.find((user) => user.email === parentEmail)?.id;
  }

  if (!parentId) throw new Error("Unable to create or find BrightPath parent user");

  const profile = await supabaseAdmin.from("profiles").upsert({
    id: parentId,
    email: parentEmail,
    role: "parent"
  });

  if (profile.error) throw profile.error;
  return parentId;
}

async function ensureChildren(parentId: string) {
  if (!supabaseAdmin) throw new Error("Supabase is not configured");

  const rows = children.map((child) => ({
    parent_id: parentId,
    slug: child.id,
    name: child.name,
    grade_label: child.gradeLabel,
    track: child.track
  }));

  const result = await supabaseAdmin.from("children").upsert(rows, { onConflict: "parent_id,slug" }).select("id,slug");
  if (result.error) throw result.error;

  return new Map(result.data.map((child) => [child.slug as ChildSlug, child.id as string]));
}

async function ensureAssignment(assignment: Assignment) {
  if (!supabaseAdmin) throw new Error("Supabase is not configured");

  const assignmentResult = await supabaseAdmin.from("assignments").upsert({
    id: assignment.id,
    child_slug: assignment.childId,
    day: assignment.day,
    title: assignment.title,
    date_label: assignment.dateLabel
  });
  if (assignmentResult.error) throw assignmentResult.error;

  const questionRows = assignment.questions.map((question, index) => ({
    id: question.id,
    assignment_id: assignment.id,
    section: question.section,
    question_type: question.type,
    prompt: question.prompt,
    choices: question.choices ?? null,
    answer: question.answer ?? null,
    acceptable_answers: question.acceptableAnswers ?? null,
    skill: question.skill,
    points: question.points,
    passage: question.passage ?? null,
    rubric: question.rubric ?? null,
    position: index + 1
  }));

  const questionsResult = await supabaseAdmin.from("questions").upsert(questionRows);
  if (questionsResult.error) throw questionsResult.error;
}

async function updateSkillProgress(childId: string, submission: Submission) {
  if (!supabaseAdmin) throw new Error("Supabase is not configured");

  const totals = new Map<string, { earned: number; max: number }>();
  for (const answer of submission.answers) {
    const current = totals.get(answer.skill) ?? { earned: 0, max: 0 };
    current.earned += answer.earnedPoints;
    current.max += answer.maxPoints;
    totals.set(answer.skill, current);
  }

  for (const [skill, total] of totals.entries()) {
    const existing = await supabaseAdmin
      .from("skill_progress")
      .select("earned_points,max_points")
      .eq("child_id", childId)
      .eq("skill", skill)
      .maybeSingle();

    const earned = Number(existing.data?.earned_points ?? 0) + total.earned;
    const max = Number(existing.data?.max_points ?? 0) + total.max;

    await supabaseAdmin.from("skill_progress").upsert({
      child_id: childId,
      skill,
      earned_points: earned,
      max_points: max,
      last_practiced_at: submission.submittedAt
    }, { onConflict: "child_id,skill" });
  }
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = submissionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const submission = parsed.data as Submission;
  const assignment = assignments.find((item) => item.id === submission.assignmentId);
  if (!assignment) {
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  }

  try {
    const parentId = await ensureParent();
    const childMap = await ensureChildren(parentId);
    const childId = childMap.get(submission.childId);
    if (!childId) throw new Error("Child profile was not created");

    await ensureAssignment(assignment);

    const savedSubmission = await supabaseAdmin
      .from("submissions")
      .insert({
        parent_id: parentId,
        child_id: childId,
        assignment_id: submission.assignmentId,
        score: submission.score,
        max_score: submission.maxScore,
        percent: submission.percent,
        feedback: submission.feedback,
        submitted_at: submission.submittedAt
      })
      .select("id")
      .single();

    if (savedSubmission.error) throw savedSubmission.error;

    const answersResult = await supabaseAdmin.from("answers").insert(
      submission.answers.map((answer) => ({
        submission_id: savedSubmission.data.id,
        question_id: answer.questionId,
        value: answer.value,
        correct: answer.correct,
        earned_points: answer.earnedPoints,
        max_points: answer.maxPoints,
        correction: answer.correction,
        feedback: answer.feedback,
        skill: answer.skill,
        section: answer.section
      }))
    );

    if (answersResult.error) throw answersResult.error;
    await updateSkillProgress(childId, submission);

    return NextResponse.json({ ok: true, submissionId: savedSubmission.data.id });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : JSON.stringify(error);

    console.error("Supabase submission save failed", error);
    return NextResponse.json({ error: message || "Unable to save submission" }, { status: 500 });
  }
}

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  try {
    const submissions = await supabaseAdmin
      .from("submissions")
      .select("id,assignment_id,score,max_score,percent,feedback,submitted_at,children(slug),answers(question_id,value,correct,earned_points,max_points,correction,feedback,skill,section)")
      .order("submitted_at", { ascending: false })
      .limit(100);

    if (submissions.error) throw submissions.error;

    const rows = submissions.data as unknown as SubmissionRow[];
    const normalized = rows.map((submission) => ({
      id: submission.id,
      assignmentId: submission.assignment_id,
      childId: Array.isArray(submission.children) ? submission.children[0]?.slug : submission.children?.slug,
      submittedAt: submission.submitted_at,
      score: Number(submission.score),
      maxScore: Number(submission.max_score),
      percent: submission.percent,
      feedback: submission.feedback,
      answers: submission.answers.map((answer) => ({
        questionId: answer.question_id,
        value: answer.value,
        correct: answer.correct,
        earnedPoints: Number(answer.earned_points),
        maxPoints: Number(answer.max_points),
        correction: answer.correction ?? undefined,
        feedback: answer.feedback ?? undefined,
        skill: answer.skill,
        section: answer.section
      }))
    }));

    return NextResponse.json({ submissions: normalized });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : JSON.stringify(error);

    console.error("Supabase submission fetch failed", error);
    return NextResponse.json({ error: message || "Unable to fetch submissions" }, { status: 500 });
  }
}
