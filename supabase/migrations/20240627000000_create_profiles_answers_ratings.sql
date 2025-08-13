-- Create profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  username text,
  avatar_url text,
  is_public boolean default true
);

-- Create answers table
create table if not exists answers (
  id bigserial primary key,
  user_id uuid references auth.users(id),
  scenario_id text,
  choice text,
  rationale text,
  created_at timestamptz default now()
);

-- Create ratings table
create table if not exists ratings (
  id bigserial primary key,
  user_id uuid references auth.users(id),
  scenario_id text,
  rating int check (rating between 1 and 5),
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table answers enable row level security;
alter table ratings enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone" on profiles
  for select using (is_public or auth.uid() = id);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Policies for answers
create policy "Users manage their own answers" on answers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Policies for ratings
create policy "Users manage their own ratings" on ratings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

