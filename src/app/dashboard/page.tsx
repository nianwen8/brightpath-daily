import { Badge, ButtonLink, Card } from "@/components/ui";
import { children, getTodayAssignment } from "@/lib/seed-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge>Today</Badge>
        <h1 className="mt-3 text-3xl font-bold">Choose a learner</h1>
        <p className="mt-2 text-slate-700">Each profile has one focused assignment ready for today.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {children.map((child) => {
          const assignment = getTodayAssignment(child.id);
          return (
            <Card key={child.id}>
              <div className={`mb-4 h-3 w-24 rounded-full ${child.color}`} />
              <h2 className="text-2xl font-bold">{child.name}</h2>
              <p className="mt-1 text-slate-700">{child.gradeLabel}</p>
              <p className="mt-1 text-sm font-semibold text-leaf">{child.track}</p>
              <div className="mt-5 rounded-lg bg-skywash p-4">
                <p className="text-sm font-bold uppercase tracking-wide">Today&apos;s assignment</p>
                <p className="mt-1 text-lg font-semibold">{assignment.title}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <ButtonLink href={`/student/${child.id}`} tone={child.id === "ella" ? "coral" : "leaf"}>
                  Open profile
                </ButtonLink>
                <ButtonLink href={`/practice/${assignment.id}`} tone="plain">
                  Start practice
                </ButtonLink>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
