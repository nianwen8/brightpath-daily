"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { getDemoSubmissions } from "@/lib/demo-store";
import { getAssignmentsForChild, getChild, getTodayAssignment } from "@/lib/seed-data";
import type { ChildSlug, Submission } from "@/lib/types";

export function StudentPage({ childId }: { childId: ChildSlug }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const child = getChild(childId);
  const today = getTodayAssignment(childId);
  const assignments = getAssignmentsForChild(childId);
  const completedByAssignment = useMemo(() => {
    const map = new Map<string, Submission>();
    submissions
      .filter((submission) => submission.childId === childId)
      .forEach((submission) => {
        const existing = map.get(submission.assignmentId);
        if (!existing || new Date(submission.submittedAt) > new Date(existing.submittedAt)) {
          map.set(submission.assignmentId, submission);
        }
      });
    return map;
  }, [childId, submissions]);
  const nextAssignment = assignments.find((assignment) => !completedByAssignment.has(assignment.id)) ?? today;
  const nextSubmission = completedByAssignment.get(nextAssignment.id);

  useEffect(() => {
    const localSubmissions = getDemoSubmissions();
    setSubmissions(localSubmissions);

    fetch("/api/submissions")
      .then(async (response) => {
        if (!response.ok) return;
        const body = (await response.json()) as { submissions?: Submission[] };
        if (body.submissions) {
          setSubmissions(body.submissions);
        }
      })
      .catch(() => {
        setSubmissions(localSubmissions);
      });
  }, []);

  if (!child) return null;

  return (
    <div className="space-y-6">
      <div>
        <Badge>{child.gradeLabel}</Badge>
        <h1 className="mt-3 text-3xl font-bold">{child.name}</h1>
        <p className="mt-2 text-slate-700">{child.track}</p>
      </div>
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-leaf">{nextSubmission ? "Completed today" : "Up next"}</p>
            <h2 className="text-2xl font-bold">{nextAssignment.title}</h2>
            <p className="mt-1 text-slate-700">
              {nextSubmission ? `${nextSubmission.percent}% complete. Nice work.` : "Math, vocabulary, reading, and writing in one calm practice."}
            </p>
          </div>
          <ButtonLink href={nextSubmission ? `/results/${nextSubmission.id}` : `/practice/${nextAssignment.id}`} tone={childId === "ella" ? "coral" : "leaf"}>
            {nextSubmission ? "Review result" : "Begin"}
          </ButtonLink>
        </div>
      </Card>
      <div className="grid gap-3 md:grid-cols-5">
        {assignments.map((assignment) => {
          const submission = completedByAssignment.get(assignment.id);
          return (
            <Card key={assignment.id} className={`p-4 ${submission ? "border-leaf/40 bg-leaf/5" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-slate-500">{assignment.dateLabel}</p>
                {submission ? <span className="rounded-full bg-leaf/15 px-2 py-1 text-xs font-bold text-leaf">Completed</span> : null}
              </div>
              <h3 className="mt-1 font-bold">{assignment.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{assignment.questions.length} questions</p>
              {submission ? (
                <>
                  <p className="mt-2 text-sm font-bold text-leaf">{submission.percent}% score</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ButtonLink href={`/results/${submission.id}`} tone="plain">
                      Review
                    </ButtonLink>
                    <ButtonLink href={`/practice/${assignment.id}`} tone="plain">
                      Practice again
                    </ButtonLink>
                  </div>
                </>
              ) : (
                <div className="mt-3">
                  <ButtonLink href={`/practice/${assignment.id}`} tone={childId === "ella" ? "coral" : "leaf"}>
                    Start
                  </ButtonLink>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
