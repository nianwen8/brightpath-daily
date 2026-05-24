import { NextResponse } from "next/server";
import { localWritingGrade } from "@/lib/grading";
import { writingGradeRequestSchema, writingGradeSchema } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = writingGradeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid writing grade request" }, { status: 400 });
  }

  const local = localWritingGrade(parsed.data.response, parsed.data.rubric);
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.AZURE_OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(local);
  }

  try {
    const prompt = [
      `Grade this ${parsed.data.gradeLabel} writing response for ${parsed.data.childName}.`,
      `Prompt: ${parsed.data.prompt}`,
      `Rubric: ${parsed.data.rubric.join("; ")}`,
      `Response: ${parsed.data.response}`,
      "Return JSON with score 0-4, maxScore 4, strengths array, nextStep, friendlyFeedback."
    ].join("\n");

    const isAzure = Boolean(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_DEPLOYMENT);
    const endpoint = isAzure
      ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION ?? "2024-10-21"}`
      : `${process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"}/chat/completions`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isAzure ? { "api-key": apiKey } : { Authorization: `Bearer ${apiKey}` })
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a kind elementary writing coach. Grade gently and return only valid JSON." },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) return NextResponse.json(local);

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const aiParsed = writingGradeSchema.safeParse(JSON.parse(content ?? "{}"));
    return NextResponse.json(aiParsed.success ? aiParsed.data : local);
  } catch {
    return NextResponse.json(local);
  }
}
