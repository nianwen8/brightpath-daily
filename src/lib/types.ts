import { z } from "zod";

export const childSlugSchema = z.enum(["ella", "evelyn"]);

export type ChildSlug = z.infer<typeof childSlugSchema>;

export type Section = "math" | "vocabulary" | "reading" | "writing";

export type QuestionType = "multiple_choice" | "numeric" | "short_text";

export type Skill =
  | "subtraction"
  | "word_problems"
  | "graphs"
  | "fractions"
  | "retell"
  | "story_elements"
  | "prefixes"
  | "suffixes"
  | "multiplication"
  | "division"
  | "equivalent_fractions"
  | "comparing_fractions"
  | "two_step_reasoning"
  | "area_perimeter"
  | "line_plots"
  | "theme"
  | "nonfiction_summary"
  | "roots"
  | "eps_reasoning";

export type Child = {
  id: ChildSlug;
  name: string;
  gradeLabel: string;
  track: string;
  color: string;
};

export type Question = {
  id: string;
  section: Section;
  type: QuestionType;
  prompt: string;
  choices?: string[];
  answer?: string | number;
  acceptableAnswers?: Array<string | number>;
  skill: Skill;
  points: number;
  passage?: string;
  rubric?: string[];
  sampleAnswer?: string;
};

export type Assignment = {
  id: string;
  childId: ChildSlug;
  day: number;
  title: string;
  dateLabel: string;
  questions: Question[];
};

export type AnswerInput = {
  questionId: string;
  value: string;
};

export type GradedAnswer = {
  questionId: string;
  value: string;
  correct: boolean;
  earnedPoints: number;
  maxPoints: number;
  correction?: string;
  feedback?: string;
  skill: Skill;
  section: Section;
};

export type Submission = {
  id: string;
  assignmentId: string;
  childId: ChildSlug;
  submittedAt: string;
  answers: GradedAnswer[];
  score: number;
  maxScore: number;
  percent: number;
  feedback: string;
};

export const writingGradeRequestSchema = z.object({
  childName: z.string(),
  gradeLabel: z.string(),
  prompt: z.string(),
  response: z.string(),
  rubric: z.array(z.string()).default([])
});

export type WritingGradeRequest = z.infer<typeof writingGradeRequestSchema>;

export const writingGradeSchema = z.object({
  score: z.number().min(0).max(4),
  maxScore: z.literal(4),
  strengths: z.array(z.string()),
  nextStep: z.string(),
  friendlyFeedback: z.string()
});

export type WritingGrade = z.infer<typeof writingGradeSchema>;
