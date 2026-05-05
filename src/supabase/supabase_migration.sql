-- ============================================================
-- 💎 LUXIMA BLOG API — Supabase Migration Script
-- Target: Supabase.com (PostgreSQL)
-- ============================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES

-- Profiles (Metadata tambahan untuk user)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  phone text,
  bio text,
  onboarding_completed boolean default false,
  onboarding_step integer default 1,
  settings jsonb default '{}'::jsonb,
  connections jsonb default '{}'::jsonb,
  preferences jsonb default '{}'::jsonb,
  status text default 'active',
  role_id uuid,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Categories
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  image_url text,
  parent_id uuid references public.categories(id),
  sort_order integer default 0,
  status text default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Posts
create table if not exists public.posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references auth.users not null,
  category_id uuid references public.categories not null,
  title text not null,
  slug text not null unique,
  content text not null,
  description text,
  cover_image text,
  tags text[] default '{}'::text[],
  reading_time_minutes integer default 0,
  status text default 'draft',
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Comments
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts on delete cascade not null,
  user_id uuid references auth.users not null,
  content text not null,
  parent_id uuid references public.comments(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tags (Metadata tags)
create table if not exists public.tags (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

-- 3. VIEWS

-- Profiles View (CamelCase structure as requested)
create or replace view public.profiles_view as
select 
    id,
    email,
    updated_at as "updatedAt",
    username,
    full_name as "fullName",
    avatar_url as "avatar",
    website,
    phone,
    bio,
    onboarding_completed as "onboardingCompleted",
    onboarding_step as "onboardingStep",
    settings,
    connections,
    preferences,
    status,
    created_at as "createdAt",
    role_id as "roleId"
from public.profiles;

-- 4. FUNCTIONS & TRIGGERS

-- Auto-update updated_at timestamp
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles before update on public.profiles for each row execute procedure handle_updated_at();
create trigger set_updated_at_categories before update on public.categories for each row execute procedure handle_updated_at();
create trigger set_updated_at_posts before update on public.posts for each row execute procedure handle_updated_at();
create trigger set_updated_at_comments before update on public.comments for each row execute procedure handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. RLS POLICIES (Row Level Security)

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.tags enable row level security;

-- Public read access
create policy "Public can view profiles" on public.profiles for select using (true);
create policy "Public can view categories" on public.categories for select using (true);
create policy "Public can view published posts" on public.posts for select using (true);
create policy "Public can view comments" on public.comments for select using (true);
create policy "Public can view tags" on public.tags for select using (true);

-- Authenticated write access
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Authors can manage own posts" on public.posts for all using (auth.uid() = author_id);
create policy "Users can manage own comments" on public.comments for all using (auth.uid() = user_id);
create policy "Admins can manage categories" on public.categories for all using (auth.role() = 'service_role');
create policy "Admins can manage tags" on public.tags for all using (auth.role() = 'service_role');
