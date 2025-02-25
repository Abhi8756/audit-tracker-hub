
create table public.audits (
  id bigint primary key generated always as identity,
  date date not null default current_date,
  test_type text not null,
  result text not null check (result in ('Passed', 'Failed')),
  maintenance_needed boolean not null default false,
  maintenance_scheduled date,
  report_url text,
  completed boolean not null default false,
  created_at timestamp with time zone not null default now()
);

-- Set up Row Level Security (RLS)
alter table public.audits enable row level security;

-- Create a policy that allows all operations for now
-- You might want to restrict this based on user authentication later
create policy "Allow all operations for now"
  on public.audits
  for all
  using (true)
  with check (true);

-- Create an index on frequently queried columns
create index audits_date_idx on public.audits(date);
create index audits_completed_idx on public.audits(completed);
