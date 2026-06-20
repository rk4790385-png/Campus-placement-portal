
-- =========== ROLES ===========
create type public.app_role as enum ('student','recruiter','admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles read all authenticated" on public.profiles for select to authenticated using (true);
create policy "profiles update own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles insert own" on public.profiles for insert to authenticated with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "user_roles select own" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- =========== STUDENTS ===========
create table public.students (
  id uuid primary key references auth.users(id) on delete cascade,
  usn text,
  roll_number text,
  branch text,
  semester int,
  cgpa numeric(4,2),
  backlogs int default 0,
  tenth_pct numeric(5,2),
  twelfth_pct numeric(5,2),
  dob date,
  gender text,
  address text,
  resume_url text,
  linkedin text,
  github text,
  leetcode text,
  hackerrank text,
  portfolio text,
  skills text[] default '{}',
  soft_skills text[] default '{}',
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.students to authenticated;
grant all on public.students to service_role;
alter table public.students enable row level security;
create policy "students read all auth" on public.students for select to authenticated using (true);
create policy "students upsert own" on public.students for insert to authenticated with check (auth.uid() = id);
create policy "students update own" on public.students for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- =========== COMPANIES ===========
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  industry text,
  description text,
  website text,
  location text,
  employees text,
  created_at timestamptz not null default now()
);
grant select on public.companies to anon, authenticated;
grant all on public.companies to service_role;
alter table public.companies enable row level security;
create policy "companies public read" on public.companies for select to anon, authenticated using (true);

-- =========== JOBS ===========
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  role_type text,           -- 'Full Time' / 'Internship' / etc
  work_mode text,           -- 'Remote'/'Onsite'/'Hybrid'
  location text,
  salary_lpa numeric,
  description text,
  eligibility_branches text[] default '{}',
  min_cgpa numeric(4,2) default 0,
  max_backlogs int default 99,
  open_positions int default 1,
  apply_deadline date,
  status text default 'open',
  created_at timestamptz not null default now()
);
grant select on public.jobs to anon, authenticated;
grant all on public.jobs to service_role;
alter table public.jobs enable row level security;
create policy "jobs public read" on public.jobs for select to anon, authenticated using (true);

-- =========== APPLICATIONS ===========
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'applied',  -- applied/shortlisted/rejected/offered
  applied_at timestamptz not null default now(),
  unique (job_id, student_id)
);
grant select, insert, update, delete on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;
create policy "applications select own" on public.applications for select to authenticated using (auth.uid() = student_id);
create policy "applications insert own" on public.applications for insert to authenticated with check (auth.uid() = student_id);
create policy "applications delete own" on public.applications for delete to authenticated using (auth.uid() = student_id);

-- =========== TRIGGERS ===========
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  -- default role: student (can be promoted later)
  insert into public.user_roles (user_id, role)
  values (new.id, coalesce((new.raw_user_meta_data->>'role')::app_role, 'student'));
  -- if student, create empty student row
  if coalesce(new.raw_user_meta_data->>'role','student') = 'student' then
    insert into public.students (id) values (new.id);
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger students_updated before update on public.students for each row execute function public.set_updated_at();
