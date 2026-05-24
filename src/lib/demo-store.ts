"use client";

import type { Submission } from "./types";

const key = "brightpath-daily-submissions";

export function getDemoSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Submission[];
  } catch {
    return [];
  }
}

export function saveDemoSubmission(submission: Submission) {
  const submissions = getDemoSubmissions().filter((item) => item.id !== submission.id);
  submissions.unshift(submission);
  window.localStorage.setItem(key, JSON.stringify(submissions));
}

export async function saveSubmission(submission: Submission) {
  saveDemoSubmission(submission);

  const result = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission)
  });

  if (!result.ok) {
    const body = await result.json().catch(() => ({ error: "Unknown save error" }));
    throw new Error(body.error ?? "Unable to save submission to Supabase");
  }
}

export function getDemoSubmission(id: string) {
  return getDemoSubmissions().find((submission) => submission.id === id);
}
