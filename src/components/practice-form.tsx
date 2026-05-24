"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";
import { saveSubmission } from "@/lib/demo-store";
import { gradeSubmission } from "@/lib/grading";
import type { Assignment, AnswerInput, WritingGrade } from "@/lib/types";

export function PracticeForm({ assignment }: { assignment: Assignment }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function update(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const inputs: AnswerInput[] = assignment.questions.map((question) => ({
      questionId: question.id,
      value: answers[question.id] ?? ""
    }));

    const writingGrades: Record<string, WritingGrade> = {};
    for (const question of assignment.questions.filter((item) => item.type === "short_text")) {
      const response = answers[question.id] ?? "";
      try {
        const result = await fetch("/api/grade-writing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childName: assignment.childId === "ella" ? "Ella Gu" : "Evelyn Gu",
            gradeLabel: assignment.childId === "ella" ? "Rising 2nd grade" : "Rising 4th grade",
            prompt: question.prompt,
            response,
            rubric: question.rubric ?? []
          })
        });
        if (result.ok) {
          writingGrades[question.id] = (await result.json()) as WritingGrade;
        }
      } catch {
        // Local grading in gradeSubmission covers offline demo mode.
      }
    }

    const submission = gradeSubmission(assignment, inputs, writingGrades);
    try {
      await saveSubmission(submission);
    } catch (error) {
      console.warn(error);
    }
    router.push(`/results/${submission.id}`);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {assignment.questions.map((question, index) => (
        <Card key={question.id}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-skywash px-3 py-1 text-sm font-bold">#{index + 1}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold capitalize">{question.section}</span>
            <span className="rounded-full bg-sun/35 px-3 py-1 text-sm font-semibold">{question.points} pt</span>
          </div>
          {question.passage ? <p className="mb-3 rounded-lg bg-skywash p-3 text-slate-700">{question.passage}</p> : null}
          <label className="block text-lg font-bold" htmlFor={question.id}>
            {question.prompt}
          </label>
          {question.type === "short_text" && question.rubric?.length ? (
            <div className="mt-3 rounded-md border border-slate-200 bg-skywash/70 p-3">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Writing checklist</p>
              <ul className="mt-2 grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
                {question.rubric.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {question.type === "multiple_choice" ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {question.choices?.map((choice) => (
                <label key={choice} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-3 hover:bg-skywash">
                  <input type="radio" name={question.id} value={choice} onChange={(event) => update(question.id, event.target.value)} required />
                  <span className="font-medium">{choice}</span>
                </label>
              ))}
            </div>
          ) : question.type === "numeric" ? (
            <input
              id={question.id}
              inputMode="numeric"
              className="mt-4 w-full rounded-md border border-slate-200 px-3 py-3 text-lg"
              value={answers[question.id] ?? ""}
              onChange={(event) => update(question.id, event.target.value)}
              required
            />
          ) : (
            <textarea
              id={question.id}
              className="mt-4 min-h-32 w-full rounded-md border border-slate-200 px-3 py-3 text-base"
              value={answers[question.id] ?? ""}
              onChange={(event) => update(question.id, event.target.value)}
              required
            />
          )}
        </Card>
      ))}
      <button disabled={submitting} className="w-full rounded-md bg-leaf px-5 py-4 text-lg font-bold text-white hover:bg-leaf/90 disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? "Grading..." : "Submit practice"}
      </button>
    </form>
  );
}
