import { Badge, ButtonLink, Card } from "@/components/ui";
import { children, getTodayAssignment } from "@/lib/seed-data";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-[1fr_420px] md:items-end">
        <div>
          <Badge>Choose your path</Badge>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">BrightPath Daily</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-700">
            Pick Ella or Evelyn to jump straight into today&apos;s warm-up. No login needed for local demo practice.
          </p>
        </div>
        <Card className="bg-white/90">
          <p className="text-sm font-bold uppercase tracking-wide text-leaf">Parent area</p>
          <p className="mt-2 text-slate-700">Review progress and assignment content anytime.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/dashboard" tone="plain">
              Parent overview
            </ButtonLink>
            <ButtonLink href="/parent/progress" tone="plain">
              Progress
            </ButtonLink>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {children.map((child) => {
          const assignment = getTodayAssignment(child.id);
          return (
            <Card key={child.id} className="p-6">
              <div className={`mb-5 h-3 w-28 rounded-full ${child.color}`} />
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{child.gradeLabel}</p>
              <h2 className="mt-2 text-3xl font-bold">{child.name}</h2>
              <p className="mt-1 text-slate-700">{child.track}</p>
              <div className="mt-5 rounded-lg bg-skywash p-4">
                <p className="text-sm font-bold uppercase tracking-wide">Today&apos;s worksheet</p>
                <p className="mt-1 text-lg font-semibold">{assignment.title}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <ButtonLink href={`/student/${child.id}`} tone={child.id === "ella" ? "coral" : "leaf"}>
                  Enter {child.id === "ella" ? "Ella" : "Evelyn"}
                </ButtonLink>
                <ButtonLink href={`/practice/${assignment.id}`} tone="plain">
                  Start worksheet
                </ButtonLink>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
