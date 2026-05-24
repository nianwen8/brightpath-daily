import type { AnswerInput, Assignment, GradedAnswer, Question, Submission, WritingGrade } from "./types";

const friendlyCorrect = ["Nice work.", "You got it.", "Strong thinking."];

export function normalizeAnswer(value: string | number) {
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
}

export function isAutoCorrect(question: Question, value: string) {
  const expected = [question.answer, ...(question.acceptableAnswers ?? [])]
    .filter((answer): answer is string | number => answer !== undefined)
    .map(normalizeAnswer);

  if (question.type === "numeric") {
    const numericValue = Number(value);
    return expected.some((answer) => Number(answer) === numericValue);
  }

  return expected.includes(normalizeAnswer(value));
}

export function localWritingGrade(response: string, rubric: string[] = []): WritingGrade {
  const trimmed = response.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const sentenceCount = (trimmed.match(/[.!?]/g) ?? []).length;
  let score = 1;

  if (words.length >= 12) score += 1;
  if (sentenceCount >= 2) score += 1;
  if (rubric.length > 0 && words.length >= 24) score += 1;

  const finalScore = Math.min(4, Math.max(0, trimmed.length === 0 ? 0 : score));

  return {
    score: finalScore,
    maxScore: 4,
    strengths: finalScore >= 3 ? ["Clear effort and helpful details"] : ["You started the response"],
    nextStep: finalScore >= 3 ? "Add one more exact detail next time." : "Try adding another complete sentence with a specific detail.",
    friendlyFeedback: finalScore >= 3 ? "Warm, clear work. Keep building your evidence." : "Good start. A little more detail will make your answer shine."
  };
}

export function gradeAutoQuestion(question: Question, value: string): GradedAnswer {
  const correct = isAutoCorrect(question, value);

  return {
    questionId: question.id,
    value,
    correct,
    earnedPoints: correct ? question.points : 0,
    maxPoints: question.points,
    correction: correct ? undefined : question.answer === undefined ? "Review the prompt and try adding more detail." : `Correct answer: ${question.answer}`,
    feedback: correct ? friendlyCorrect[Math.floor(question.id.length % friendlyCorrect.length)] : "Pause and try the correction before tomorrow's practice.",
    skill: question.skill,
    section: question.section
  };
}

export function gradeWritingQuestion(question: Question, value: string, aiGrade?: WritingGrade): GradedAnswer {
  const grade = aiGrade ?? localWritingGrade(value, question.rubric);
  const earnedPoints = Math.min(question.points, Math.round((grade.score / grade.maxScore) * question.points));

  return {
    questionId: question.id,
    value,
    correct: earnedPoints >= Math.ceil(question.points * 0.75),
    earnedPoints,
    maxPoints: question.points,
    correction: grade.nextStep,
    feedback: grade.friendlyFeedback,
    skill: question.skill,
    section: question.section
  };
}

export function gradeSubmission(assignment: Assignment, inputs: AnswerInput[], writingGrades: Record<string, WritingGrade> = {}): Submission {
  const answers = assignment.questions.map((question) => {
    const input = inputs.find((answer) => answer.questionId === question.id);
    const value = input?.value ?? "";
    return question.type === "short_text" ? gradeWritingQuestion(question, value, writingGrades[question.id]) : gradeAutoQuestion(question, value);
  });

  const score = answers.reduce((sum, answer) => sum + answer.earnedPoints, 0);
  const maxScore = answers.reduce((sum, answer) => sum + answer.maxPoints, 0);
  const percent = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);

  return {
    id: `sub-${assignment.id}-${Date.now()}`,
    assignmentId: assignment.id,
    childId: assignment.childId,
    submittedAt: new Date().toISOString(),
    answers,
    score,
    maxScore,
    percent,
    feedback: percent >= 85 ? "Bright work today. Your practice is paying off." : percent >= 65 ? "Good practice. Review the corrections and come back fresh tomorrow." : "You showed up and tried. Let's revisit the tricky skills together."
  };
}

export function summarizeWeakSkills(submissions: Submission[]) {
  const skillMap = new Map<string, { earned: number; max: number }>();

  for (const submission of submissions) {
    for (const answer of submission.answers) {
      const current = skillMap.get(answer.skill) ?? { earned: 0, max: 0 };
      current.earned += answer.earnedPoints;
      current.max += answer.maxPoints;
      skillMap.set(answer.skill, current);
    }
  }

  return Array.from(skillMap.entries())
    .map(([skill, value]) => ({ skill, percent: value.max === 0 ? 0 : Math.round((value.earned / value.max) * 100) }))
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 5);
}
