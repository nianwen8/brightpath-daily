import Link from "next/link";
import type { ReactNode } from "react";

export function ButtonLink({ href, children, tone = "leaf" }: { href: string; children: ReactNode; tone?: "leaf" | "coral" | "plain" }) {
  const styles = {
    leaf: "bg-leaf text-white hover:bg-leaf/90",
    coral: "bg-coral text-white hover:bg-coral/90",
    plain: "bg-white text-ink border border-slate-200 hover:bg-skywash"
  };

  return (
    <Link href={href} className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition ${styles[tone]}`}>
      {children}
    </Link>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`warm-panel p-5 ${className}`}>{children}</section>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-sun/35 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">{children}</span>;
}

export function Meter({ value }: { value: number }) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-100" aria-label={`${value}%`}>
      <div className="h-full rounded-full bg-leaf transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
