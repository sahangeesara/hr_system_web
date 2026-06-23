-- ============================================================
-- HRM SYSTEM - Supabase PostgreSQL Schema + RLS Policies
-- Stack: Next.js + Supabase (Auth + DB + Storage)
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";


-- ============================================================
-- ENUMS
-- ============================================================
create type employment_type as enum ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN');
create type employee_status as enum ('ACTIVE', 'INACTIVE', 'ONBOARDING', 'TERMINATED');
create type payment_status as enum ('PENDING', 'PAID', 'FAILED');
create type user_role as enum ('ADMIN', 'HR', 'EMPLOYEE');
create type document_type as enum (
  'NIC_ID',
  'PASSPORT',
  'CV_RESUME',
  'EDUCATION_CERTIFICATE',
  'EMPLOYMENT_LETTER',
  'BANK_DETAILS',
  'SIGNED_CONTRACT',
  'OTHER'
);


-- ============================================================
-- 1. PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
                                 id          uuid primary key references auth.users(id) on delete cascade,
                                 full_name   text,
                                 role        user_role not null default 'EMPLOYEE',
                                 is_active   boolean not null default true,
                                 created_at  timestamptz not null default now(),
                                 updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
insert into public.profiles (id, full_name, role)
values (
           new.id,
           new.raw_user_meta_data->>'full_name',
           coalesce((new.raw_user_meta_data->>'role')::user_role, 'EMPLOYEE')
       );
return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
return new;
end;
$$;

create trigger profiles_updated_at
    before update on public.profiles
    for each row execute procedure public.set_updated_at();


-- ============================================================
-- 2. DEPARTMENTS TABLE
-- ============================================================
create table public.departments (
                                    id          uuid primary key default uuid_generate_v4(),
                                    name        text not null unique,
                                    description text,
                                    is_active   boolean not null default true,
                                    created_at  timestamptz not null default now(),
                                    updated_at  timestamptz not null default now()
);

create trigger departments_updated_at
    before update on public.departments
    for each row execute procedure public.set_updated_at();


-- ============================================================
-- 3. POSITIONS TABLE
-- ============================================================
create table public.positions (
                                  id            uuid primary key default uuid_generate_v4(),
                                  department_id uuid not null references public.departments(id) on delete restrict,
                                  title         text not null,
                                  description   text,
                                  is_active     boolean not null default true,
                                  created_at    timestamptz not null default now(),
                                  updated_at    timestamptz not null default now()
);

create index idx_positions_department on public.positions(department_id);

create trigger positions_updated_at
    before update on public.positions
    for each row execute procedure public.set_updated_at();


-- ============================================================
-- 4. EMPLOYEES TABLE
-- ============================================================
create table public.employees (
                                  id              uuid primary key default uuid_generate_v4(),
                                  employee_code   text not null unique,
                                  first_name      text not null,
                                  last_name       text not null,
                                  email           text not null unique,
                                  phone           text,
                                  address         text,
                                  department_id   uuid references public.departments(id) on delete set null,
                                  position_id     uuid references public.positions(id) on delete set null,
                                  joining_date    date,
                                  employment_type employment_type not null default 'FULL_TIME',
                                  basic_salary    numeric(12,2) not null default 0,
                                  status          employee_status not null default 'ONBOARDING',
    -- Link to auth user (optional: if employee also has a login)
                                  user_id         uuid references auth.users(id) on delete set null,
                                  created_at      timestamptz not null default now(),
                                  updated_at      timestamptz not null default now()
);

create index idx_employees_department on public.employees(department_id);
create index idx_employees_position   on public.employees(position_id);
create index idx_employees_status     on public.employees(status);
create index idx_employees_user_id    on public.employees(user_id);

create trigger employees_updated_at
    before update on public.employees
    for each row execute procedure public.set_updated_at();


-- ============================================================
-- 5. EMPLOYEE DOCUMENTS TABLE
-- ============================================================
create table public.employee_documents (
                                           id                 uuid primary key default uuid_generate_v4(),
                                           employee_id        uuid not null references public.employees(id) on delete cascade,
                                           document_type      document_type not null default 'OTHER',
                                           original_file_name text not null,
                                           stored_file_name   text not null,
                                           file_path          text not null,           -- Supabase Storage path
                                           file_size          bigint not null,          -- bytes
                                           mime_type          text not null,
                                           uploaded_by        uuid references auth.users(id) on delete set null,
                                           uploaded_at        timestamptz not null default now()
);

create index idx_documents_employee on public.employee_documents(employee_id);
create index idx_documents_type     on public.employee_documents(document_type);


-- ============================================================
-- 6. PAYROLLS TABLE
-- ============================================================
create table public.payrolls (
                                 id             uuid primary key default uuid_generate_v4(),
                                 employee_id    uuid not null references public.employees(id) on delete cascade,
                                 month          smallint not null check (month between 1 and 12),
  year           smallint not null check (year >= 2000),
  basic_salary   numeric(12,2) not null default 0,
  allowances     numeric(12,2) not null default 0,
  deductions     numeric(12,2) not null default 0,
  net_salary     numeric(12,2) generated always as (basic_salary + allowances - deductions) stored,
  payment_status payment_status not null default 'PENDING',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- One payroll record per employee per month/year
  unique (employee_id, month, year)
);

create index idx_payrolls_employee on public.payrolls(employee_id);
create index idx_payrolls_status   on public.payrolls(payment_status);
create index idx_payrolls_period   on public.payrolls(year, month);

create trigger payrolls_updated_at
    before update on public.payrolls
    for each row execute procedure public.set_updated_at();


-- ============================================================
-- HELPER FUNCTION: Get current user role
-- ============================================================
create or replace function public.get_my_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
select role from public.profiles where id = auth.uid();
$$;


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles           enable row level security;
alter table public.departments        enable row level security;
alter table public.positions          enable row level security;
alter table public.employees          enable row level security;
alter table public.employee_documents enable row level security;
alter table public.payrolls           enable row level security;


-- ============================================================
-- RLS: PROFILES
-- ============================================================

-- Users can read their own profile
create policy "profiles: users can read own"
  on public.profiles for select
                                    using (auth.uid() = id);

-- Admins and HR can read all profiles
create policy "profiles: admin/hr can read all"
  on public.profiles for select
                                    using (public.get_my_role() in ('ADMIN', 'HR'));

-- Users can update their own profile (name only, not role)
create policy "profiles: users can update own"
  on public.profiles for update
                                    using (auth.uid() = id)
                         with check (auth.uid() = id);

-- Only admins can update roles
create policy "profiles: admin can update all"
  on public.profiles for update
                                    using (public.get_my_role() = 'ADMIN');

-- No one can delete profiles (cascade handles it from auth.users)
create policy "profiles: no direct delete"
  on public.profiles for delete
using (false);


-- ============================================================
-- RLS: DEPARTMENTS
-- ============================================================

-- All authenticated users can read departments
create policy "departments: authenticated can read"
  on public.departments for select
                                       using (auth.role() = 'authenticated');

-- Only ADMIN and HR can insert
create policy "departments: admin/hr can insert"
  on public.departments for insert
  with check (public.get_my_role() in ('ADMIN', 'HR'));

-- Only ADMIN and HR can update
create policy "departments: admin/hr can update"
  on public.departments for update
                                              using (public.get_my_role() in ('ADMIN', 'HR'));

-- Only ADMIN can delete
create policy "departments: admin can delete"
  on public.departments for delete
using (public.get_my_role() = 'ADMIN');


-- ============================================================
-- RLS: POSITIONS
-- ============================================================

-- All authenticated users can read positions
create policy "positions: authenticated can read"
  on public.positions for select
                                     using (auth.role() = 'authenticated');

-- Only ADMIN and HR can insert
create policy "positions: admin/hr can insert"
  on public.positions for insert
  with check (public.get_my_role() in ('ADMIN', 'HR'));

-- Only ADMIN and HR can update
create policy "positions: admin/hr can update"
  on public.positions for update
                                            using (public.get_my_role() in ('ADMIN', 'HR'));

-- Only ADMIN can delete
create policy "positions: admin can delete"
  on public.positions for delete
using (public.get_my_role() = 'ADMIN');


-- ============================================================
-- RLS: EMPLOYEES
-- ============================================================

-- HR and ADMIN can read all employees
create policy "employees: admin/hr can read all"
  on public.employees for select
                                     using (public.get_my_role() in ('ADMIN', 'HR'));

-- An employee can read their own record
create policy "employees: employee can read own"
  on public.employees for select
                                     using (user_id = auth.uid());

-- Only ADMIN and HR can create employees
create policy "employees: admin/hr can insert"
  on public.employees for insert
  with check (public.get_my_role() in ('ADMIN', 'HR'));

-- Only ADMIN and HR can update employees
create policy "employees: admin/hr can update"
  on public.employees for update
                                            using (public.get_my_role() in ('ADMIN', 'HR'));

-- Only ADMIN can delete employees
create policy "employees: admin can delete"
  on public.employees for delete
using (public.get_my_role() = 'ADMIN');


-- ============================================================
-- RLS: EMPLOYEE DOCUMENTS
-- ============================================================

-- ADMIN and HR can read all documents
create policy "documents: admin/hr can read all"
  on public.employee_documents for select
                                              using (public.get_my_role() in ('ADMIN', 'HR'));

-- An employee can read their own documents
create policy "documents: employee can read own"
  on public.employee_documents for select
                                              using (
                                              exists (
                                              select 1 from public.employees e
                                              where e.id = employee_id
                                              and e.user_id = auth.uid()
                                              )
                                              );

-- ADMIN and HR can upload documents
create policy "documents: admin/hr can insert"
  on public.employee_documents for insert
  with check (public.get_my_role() in ('ADMIN', 'HR'));

-- ADMIN and HR can delete documents
create policy "documents: admin/hr can delete"
  on public.employee_documents for delete
using (public.get_my_role() in ('ADMIN', 'HR'));

-- No direct update on documents (delete + re-upload instead)
create policy "documents: no update"
  on public.employee_documents for update
                                              using (false);


-- ============================================================
-- RLS: PAYROLLS
-- ============================================================

-- ADMIN and HR can read all payrolls
create policy "payrolls: admin/hr can read all"
  on public.payrolls for select
                                    using (public.get_my_role() in ('ADMIN', 'HR'));

-- An employee can read their own payroll records
create policy "payrolls: employee can read own"
  on public.payrolls for select
                                    using (
                                    exists (
                                    select 1 from public.employees e
                                    where e.id = employee_id
                                    and e.user_id = auth.uid()
                                    )
                                    );

-- Only ADMIN and HR can create payroll records
create policy "payrolls: admin/hr can insert"
  on public.payrolls for insert
  with check (public.get_my_role() in ('ADMIN', 'HR'));

-- Only ADMIN and HR can update payroll records
create policy "payrolls: admin/hr can update"
  on public.payrolls for update
                                           using (public.get_my_role() in ('ADMIN', 'HR'));

-- Only ADMIN can delete payroll records
create policy "payrolls: admin can delete"
  on public.payrolls for delete
using (public.get_my_role() = 'ADMIN');


-- ============================================================
-- DASHBOARD VIEW (for fast summary queries)
-- ============================================================
create or replace view public.dashboard_summary as
select
    (select count(*) from public.employees where status = 'ACTIVE')           as total_active_employees,
    (select count(*) from public.employees)                                    as total_employees,
    (select count(*) from public.departments where is_active = true)           as total_departments,
    (select count(*) from public.positions where is_active = true)             as total_positions,
    (
        select coalesce(sum(net_salary), 0)
        from public.payrolls
        where year = extract(year from now())::int
      and month = extract(month from now())::int
    )                                                                           as current_month_payroll_total,
  (select count(*) from public.payrolls where payment_status = 'PENDING')   as pending_payrolls;

-- Grant access to authenticated users
grant select on public.dashboard_summary to authenticated;


-- ============================================================
-- SUPABASE STORAGE BUCKET (run via Supabase Dashboard or API)
-- ============================================================
-- Create a private bucket called "employee-documents"
-- Paste this into Supabase SQL editor:

insert into storage.buckets (id, name, public)
values ('employee-documents', 'employee-documents', false)
    on conflict (id) do nothing;

-- Storage RLS: ADMIN/HR can upload
create policy "storage: admin/hr can upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'employee-documents'
    and public.get_my_role() in ('ADMIN', 'HR')
  );

-- Storage RLS: ADMIN/HR can read/download all
create policy "storage: admin/hr can read"
  on storage.objects for select
                                           to authenticated
                                           using (
                                           bucket_id = 'employee-documents'
                                           and public.get_my_role() in ('ADMIN', 'HR')
                                           );

-- Storage RLS: Employee can read their own files
-- File path convention: employee-documents/{employee_id}/{filename}
create policy "storage: employee can read own files"
  on storage.objects for select
                                    to authenticated
                                    using (
                                    bucket_id = 'employee-documents'
                                    and exists (
                                    select 1 from public.employees e
                                    where e.user_id = auth.uid()
                                    and (storage.foldername(name))[1] = e.id::text
                                    )
                                    );

-- Storage RLS: Only ADMIN/HR can delete files
create policy "storage: admin/hr can delete"
  on storage.objects for delete
to authenticated
  using (
    bucket_id = 'employee-documents'
    and public.get_my_role() in ('ADMIN', 'HR')
  );


-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
grant usage on schema public to anon, authenticated;

grant select on public.profiles           to authenticated;
grant select, insert, update, delete on public.departments        to authenticated;
grant select, insert, update, delete on public.positions          to authenticated;
grant select, insert, update, delete on public.employees          to authenticated;
grant select, insert, update, delete on public.employee_documents to authenticated;
grant select, insert, update, delete on public.payrolls           to authenticated;

-- ============================================================
-- SEED: Default Admin User Role
-- ============================================================
-- After you register the first user via Supabase Auth,
-- run this to make them an ADMIN:
--
-- update public.profiles
-- set role = 'ADMIN'
-- where id = '<your-user-uuid>';
--
-- ============================================================
