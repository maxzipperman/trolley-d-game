create table if not exists gen_cache (
  prompt text,
  seed text,
  result jsonb,
  created_at timestamptz default now(),
  primary key (prompt, seed)
);

alter table gen_cache enable row level security;

create policy "Service role access" on gen_cache
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
