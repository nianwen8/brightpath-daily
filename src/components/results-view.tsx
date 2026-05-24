"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, Meter } from "@/components/ui";
import { getDemoSubmission } from "@/lib/demo-store";
import { getAssignment, getChild } from "@/lib/seed-data";
import type { Submission } from "@/lib/types";

export function ResultsView({ submissionId }: { submissionId: string }) {
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    setSubmission(getDemoSubmission(submissionId) ?? null);
  }, [submissionId]);

  if (!submission) {
    return (
      <Card>
        <h1 className="text-2xl font-bold">Result not found</h1>
        <p className="mt-2 text-slate-700">Demo results live in this browser. Try completing an assignment first.</p>
        <Link className="mt-4 inline-flex rounded-md bg-leaf px-4 py-2 font-bold text-white" href="/dashboard">
          Back to dashboard
        </Link>
      </Card>
    );
  }

  const assignment = getAssignment(submission.assignmentId);
  const child = getChild(submission.childId);

  return (
    <div className="space-y-5">
      <Card>
        <p className="text-sm font-bold uppercase tracking-wide text-leaf">{child?.name}</p>
        <h1 className="mt-2 text-3xl font-bold">{assignment?.title ?? "Practice results"}</h1>
        <div className="mt-4 grid gap-4 md:grid-cols-[160px_1fr] md:items-center">
          <div className="text-5xl font-bold">{submission.percent}%</div>
          <div>
            <Meter value={submission.percent} />
            <p className="mt-2 text-slate-700">
              {submission.score} of {submission.maxScore} points. {submission.feedback}
            </p>
          </div>
        </div>
      </Card>
      <div className="space-y-3">
        {submission.answers.map((answer, index) => {
          const question = assignment?.questions.find((item) => item.id === answer.questionId);
          return (
            <Card key={answer.questionId} className="p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500">Question {index + 1}</p>
                  <h2 className="font-bold">{question?.prompt}</h2>
                  <p className="mt-2 text-slate-700">Your answer: {answer.value || "No answer"}</p>
                  {answer.correction ? <p className="mt-2 text-coral">{answer.correction}</p> : null}
                  {answer.feedback ? <p className="mt-2 text-slate-700">{answer.feedback}</p> : null}
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${answer.correct ? "bg-leaf/15 text-leaf" : "bg-coral/15 text-coral"}`}>
                  {answer.earnedPoints}/{answer.maxPoints}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link className="rounded-md bg-white px-4 py-2 font-bold text-ink shadow-sm" href={`/student/${submission.childId}`}>
          Back to profile
        </Link>
        <Link className="rounded-md bg-leaf px-4 py-2 font-bold text-white" href="/parent/progress">
          Parent progress
        </Link>
      </div>
    </div>
  );
}
