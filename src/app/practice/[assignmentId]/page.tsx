import { notFound } from "next/navigation";
import { PracticeForm } from "@/components/practice-form";
import { Badge } from "@/components/ui";
import { getAssignment, getChild } from "@/lib/seed-data";

export default async function PracticePage({ params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await params;
  const assignment = getAssignment(assignmentId);
  if (!assignment) notFound();
  const child = getChild(assignment.childId);

  return (
    <div className="space-y-6">
      <div>
        <Badge>{child?.name}</Badge>
        <h1 className="mt-3 text-3xl font-bold">{assignment.title}</h1>
        <p className="mt-2 text-slate-700">Take your time. Corrections are part of practice.</p>
      </div>
      <PracticeForm assignment={assignment} />
    </div>
  );
}
