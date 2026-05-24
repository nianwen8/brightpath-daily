create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'parent',
  created_at timestamptz not null default now()
);

create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references profiles(id) on delete cascade,
  slug text not null check (slug in ('ella', 'evelyn')),
  name text not null,
  grade_label text not null,
  track text not null,
  created_at timestamptz not null default now(),
  unique(parent_id, slug)
);

create table if not exists assignments (
  id text primary key,
  child_slug text not null check (child_slug in ('ella', 'evelyn')),
  day integer not null,
  title text not null,
  date_label text not null,
  created_at timestamptz not null default now()
);

create table if not exists questions (
  id text primary key,
  assignment_id text not null references assignments(id) on delete cascade,
  section text not null,
  question_type text not null,
  prompt text not null,
  choices jsonb,
  answer jsonb,
  acceptable_answers jsonb,
  skill text not null,
  points integer not null,
  passage text,
  rubric jsonb,
  position integer not null
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references profiles(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  assignment_id text not null references assignments(id),
  score numeric not null,
  max_score numeric not null,
  percent integer not null,
  feedback text not null,
  submitted_at timestamptz not null default now()
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  question_id text not null references questions(id),
  value text not null,
  correct boolean not null,
  earned_points numeric not null,
  max_points numeric not null,
  correction text,
  feedback text,
  skill text not null,
  section text not null
);

create table if not exists skill_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  skill text not null,
  earned_points numeric not null default 0,
  max_points numeric not null default 0,
  last_practiced_at timestamptz not null default now(),
  unique(child_id, skill)
);

alter table profiles enable row level security;
alter table children enable row level security;
alter table submissions enable row level security;
alter table answers enable row level security;
alter table skill_progress enable row level security;

create policy "parents read own profile" on profiles for select using (auth.uid() = id);
create policy "parents manage own children" on children for all using (auth.uid() = parent_id);
create policy "parents manage own submissions" on submissions for all using (auth.uid() = parent_id);
create policy "parents read own answers" on answers for select using (
  exists (
    select 1 from submissions
    where submissions.id = answers.submission_id
    and submissions.parent_id = auth.uid()
  )
);
create policy "parents manage own skill progress" on skill_progress for all using (
  exists (
    select 1 from children
    where children.id = skill_progress.child_id
    and children.parent_id = auth.uid()
  )
);
