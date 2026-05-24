import { Badge, Card } from "@/components/ui";
import { assignments, children } from "@/lib/seed-data";

export default function ParentContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge>Seed content</Badge>
        <h1 className="mt-3 text-3xl font-bold">Parent Content</h1>
        <p className="mt-2 text-slate-700">Review the first 5 days of assignments for each child.</p>
      </div>
      {children.map((child) => (
        <section key={child.id} className="space-y-3">
          <h2 className="text-2xl font-bold">{child.name}</h2>
          <div className="grid gap-3 md:grid-cols-5">
            {assignments
              .filter((assignment) => assignment.childId === child.id)
              .map((assignment) => (
                <Card key={assignment.id} className="p-4">
                  <p className="text-sm font-bold text-slate-500">{assignment.dateLabel}</p>
                  <h3 className="mt-1 font-bold">{assignment.title}</h3>
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {Array.from(new Set(assignment.questions.map((question) => question.section))).map((section) => (
                      <li key={section} className="capitalize">
                        {section}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
