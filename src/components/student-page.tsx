import { Badge, ButtonLink, Card } from "@/components/ui";
import { getAssignmentsForChild, getChild, getTodayAssignment } from "@/lib/seed-data";
import type { ChildSlug } from "@/lib/types";

export function StudentPage({ childId }: { childId: ChildSlug }) {
  const child = getChild(childId);
  const today = getTodayAssignment(childId);
  const assignments = getAssignmentsForChild(childId);

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
            <p className="text-sm font-bold uppercase tracking-wide text-leaf">Ready now</p>
            <h2 className="text-2xl font-bold">{today.title}</h2>
            <p className="mt-1 text-slate-700">Math, vocabulary, reading, and writing in one calm practice.</p>
          </div>
          <ButtonLink href={`/practice/${today.id}`} tone={childId === "ella" ? "coral" : "leaf"}>
            Begin
          </ButtonLink>
        </div>
      </Card>
      <div className="grid gap-3 md:grid-cols-5">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="p-4">
            <p className="text-sm font-bold text-slate-500">{assignment.dateLabel}</p>
            <h3 className="mt-1 font-bold">{assignment.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{assignment.questions.length} questions</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
