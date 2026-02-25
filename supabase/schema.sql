-- CourseSite Database Schema
-- Run this in Supabase Dashboard: SQL Editor > New query > Paste & Run

-- Enable UUID extension (usually already enabled)
create extension if not exists "uuid-ossp";

-- Profiles: extends auth.users with extra fields
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create profile on signup (trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile when user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Courses
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image_url text,
  price_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Lessons (video content via Mux)
create table if not exists public.lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses on delete cascade not null,
  title text not null,
  mux_playback_id text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Purchases: records Stripe checkout completions
create table if not exists public.purchases (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  stripe_session_id text unique,
  created_at timestamptz default now(),
  unique (user_id, course_id)
);

-- Indexes for common queries
create index if not exists idx_lessons_course_id on public.lessons (course_id);
create index if not exists idx_purchases_user_id on public.purchases (user_id);
create index if not exists idx_purchases_course_id on public.purchases (course_id);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.purchases enable row level security;

-- Profiles: users can read/update own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Courses: anyone can read (public catalog)
create policy "Courses are viewable by everyone"
  on public.courses for select
  using (true);

-- Lessons: anyone can read (public catalog)
create policy "Lessons are viewable by everyone"
  on public.lessons for select
  using (true);

-- Purchases: users can only see their own
create policy "Users can view own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- Insert: only via Stripe webhook using service_role key (bypasses RLS)
