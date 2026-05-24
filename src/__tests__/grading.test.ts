import { describe, expect, it } from "vitest";
import { gradeAutoQuestion, gradeSubmission, localWritingGrade } from "@/lib/grading";
import { assignments } from "@/lib/seed-data";

describe("grading logic", () => {
  it("grades numeric answers with numeric equivalence", () => {
    const question = assignments[0].questions[0];
    const answer = gradeAutoQuestion(question, "06");
    expect(answer.correct).toBe(true);
    expect(answer.earnedPoints).toBe(1);
  });

  it("grades multiple choice answers case-insensitively", () => {
    const question = assignments[0].questions[4];
    const answer = gradeAutoQuestion(question, "NOT HAPPY");
    expect(answer.correct).toBe(true);
  });

  it("returns local writing feedback when AI is unavailable", () => {
    const grade = localWritingGrade("The character helped a friend. She shared her snack and used kind words.", ["detail"]);
    expect(grade.score).toBeGreaterThanOrEqual(3);
    expect(grade.friendlyFeedback.length).toBeGreaterThan(0);
  });

  it("builds a full submission score", () => {
    const assignment = assignments[0];
    const submission = gradeSubmission(assignment, [
      { questionId: "ella-1-m1", value: "6" },
      { questionId: "ella-1-m2", value: "9" },
      { questionId: "ella-1-m3", value: "11" },
      { questionId: "ella-1-m4", value: "10" },
      { questionId: "ella-1-v1", value: "not happy" },
      { questionId: "ella-1-v2", value: "retie" },
      { questionId: "ella-1-v3", value: "Ella read quietly." },
      { questionId: "ella-1-r1", value: "At first the dog was lost. Then Ella helped. At the end the dog went home." },
      { questionId: "ella-1-w1", value: "The character was kind. She helped her friend. That made everyone happy." }
    ]);

    expect(submission.score).toBeGreaterThan(0);
    expect(submission.maxScore).toBe(15);
    expect(submission.answers).toHaveLength(9);
  });
});
