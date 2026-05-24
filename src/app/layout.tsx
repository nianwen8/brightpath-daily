import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrightPath Daily",
  description: "Daily practice for Ella and Evelyn"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-skywash text-ink">
        <header className="border-b border-white/70 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold tracking-normal">
              BrightPath Daily
            </Link>
            <div className="flex gap-2 text-sm font-medium">
              <Link className="rounded-md px-3 py-2 hover:bg-skywash" href="/student/ella">
                Ella
              </Link>
              <Link className="rounded-md px-3 py-2 hover:bg-skywash" href="/student/evelyn">
                Evelyn
              </Link>
              <Link className="rounded-md px-3 py-2 hover:bg-skywash" href="/parent/progress">
                Progress
              </Link>
              <Link className="rounded-md px-3 py-2 hover:bg-skywash" href="/parent/content">
                Content
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
