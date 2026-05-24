# BrightPath Daily

BrightPath Daily is a child-friendly daily practice MVP for Ella Gu and Evelyn Gu. It includes demo-mode assignments, auto-grading, optional AI writing feedback, parent progress views, and Supabase-ready data modeling.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and Database
- Zod validation
- Optional OpenAI-compatible writing feedback endpoint
- Vitest unit tests

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

In this Codex workspace, Node was installed locally at `.tools/node`. If your shell does not already have `npm`, run commands with:

```bash
PATH=.tools/node/bin:$PATH .tools/node/bin/npm run dev
```

Homebrew is also installed locally for this workspace at `.tools/homebrew`. Use it with a workspace cache:

```bash
HOMEBREW_CACHE=$PWD/.tools/homebrew-cache PATH=.tools/homebrew/bin:$PATH brew --version
```

Demo mode is enabled by default when Supabase variables are missing. Choose Ella or Evelyn from the home page. No student email accounts are required.

To store submissions in Supabase without student logins, set:

```bash
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Then run `supabase/schema.sql` in the Supabase SQL editor. The app writes submissions through `/api/submissions` using the server-only service role key.

## Environment

AI writing grading is optional. If no OpenAI or Azure OpenAI credentials are configured, the app returns local rubric feedback.

## Supabase Tables

The schema lives in `supabase/schema.sql` and covers `profiles`, `children`, `assignments`, `questions`, `submissions`, `answers`, and `skill_progress`.

## Useful Scripts

```bash
npm run dev
npm run build
npm run test
```

## MVP Notes

- Seed content includes 5 days for Ella and 5 days for Evelyn in `src/lib/seed-data.ts`.
- Auto-grading logic is in `src/lib/grading.ts`.
- AI feedback route is `src/app/api/grade-writing/route.ts`.
- Demo submissions persist in browser `localStorage`.
