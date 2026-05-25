"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Meter } from "@/components/ui";
import { getDemoSubmissions } from "@/lib/demo-store";
import { children } from "@/lib/seed-data";
import { summarizeWeakSkills } from "@/lib/grading";
import type { Submission } from "@/lib/types";

export function ParentProgress() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const localSubmissions = getDemoSubmissions();
    setSubmissions(localSubmissions);

    fetch("/api/submissions")
      .then(async (response) => {
        if (!response.ok) return;
        const body = (await response.json()) as { submissions?: Submission[] };
        if (body.submissions?.length) {
          setSubmissions(body.submissions);
        }
      })
      .catch(() => {
        setSubmissions(localSubmissions);
      });
  }, []);

  const weakSkills = useMemo(() => summarizeWeakSkills(submissions), [submissions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Parent Progress</h1>
        <p className="mt-2 text-slate-700">Daily completion, accuracy by skill, weak skills, and weekly trend.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Completed</p>
          <p className="mt-2 text-4xl font-bold">{submissions.length}</p>
          <p className="mt-1 text-slate-700">practice sessions</p>
        </Card>
        <Card>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Average</p>
          <p className="mt-2 text-4xl font-bold">{submissions.length ? Math.round(submissions.reduce((sum, item) => sum + item.percent, 0) / submissions.length) : 0}%</p>
          <p className="mt-1 text-slate-700">overall accuracy</p>
        </Card>
        <Card>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Demo mode</p>
          <p className="mt-2 text-lg font-bold">Local storage</p>
          <p className="mt-1 text-slate-700">Connect Supabase to sync across devices.</p>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {children.map((child) => {
          const childSubmissions = submissions.filter((submission) => submission.childId === child.id);
          const latest = childSubmissions[0];
          return (
            <Card key={child.id}>
              <h2 className="text-xl font-bold">{child.name}</h2>
              <p className="mt-1 text-slate-700">{latest ? `Last score: ${latest.percent}%` : "No completed practice yet"}</p>
              <div className="mt-4">
                <Meter value={latest?.percent ?? 0} />
              </div>
              <p className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-500">Weekly trend</p>
              <div className="mt-2 flex h-28 items-end gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = childSubmissions[index]?.percent ?? 0;
                  return <div key={index} className="w-full rounded-t-md bg-leaf/70" style={{ height: `${Math.max(8, value)}%` }} title={`${value}%`} />;
                })}
              </div>
            </Card>
          );
        })}
      </div>
      <Card>
        <h2 className="text-xl font-bold">Weak skills to watch</h2>
        <div className="mt-4 space-y-3">
          {weakSkills.length === 0 ? <p className="text-slate-700">Complete a practice session to see skill insights.</p> : null}
          {weakSkills.map((item) => (
            <div key={item.skill}>
              <div className="mb-1 flex justify-between text-sm font-semibold">
                <span className="capitalize">{item.skill.replaceAll("_", " ")}</span>
                <span>{item.percent}%</span>
              </div>
              <Meter value={item.percent} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
