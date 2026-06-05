-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Projects table
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  slug text unique not null,
  title text not null,
  description text not null,
  long_description text,
  tags text[] default '{}',
  tech_stack text[] default '{}',
  architecture text[] default '{}',
  meta text[] default '{}',
  overview_problema text default '',
  overview_solucao text default '',
  overview_resultado text default '',
  aprendizados text[] default '{}',
  next_steps text[] default '{}',
  github_url text,
  live_url text,
  image_url text,
  featured boolean default false,
  featured_order int,
  published boolean default false
);

-- Site settings
create table if not exists site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Resume
create table if not exists resume (
  id uuid default uuid_generate_v4() primary key,
  content text not null default '',
  ats_score int,
  ats_feedback jsonb,
  updated_at timestamptz default now()
);

-- Default site settings
insert into site_settings (key, value) values
  ('accent_color', '"#8b5cf6"'),
  ('site_title', '"André Deomondes — Software Engineer"'),
  ('whatsapp', '"5571988384932"')
on conflict (key) do nothing;

-- Indexes
create index if not exists idx_projects_slug on projects(slug);
create index if not exists idx_projects_featured on projects(featured, featured_order);
create index if not exists idx_projects_published on projects(published);

-- RLS: public can read published projects + settings
alter table projects enable row level security;
alter table site_settings enable row level security;
alter table resume enable row level security;

drop policy if exists "Public read published projects" on projects;
create policy "Public read published projects" on projects
  for select using (published = true);

drop policy if exists "Admin manage projects" on projects;
create policy "Admin manage projects" on projects
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'andredeomondes.dev@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'andredeomondes.dev@gmail.com');

drop policy if exists "Public read settings" on site_settings;
create policy "Public read settings" on site_settings
  for select using (true);

drop policy if exists "Admin manage settings" on site_settings;
create policy "Admin manage settings" on site_settings
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'andredeomondes.dev@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'andredeomondes.dev@gmail.com');

drop policy if exists "Public read resume" on resume;
create policy "Public read resume" on resume
  for select using (true);

drop policy if exists "Admin manage resume" on resume;
create policy "Admin manage resume" on resume
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'andredeomondes.dev@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'andredeomondes.dev@gmail.com');

-- Service role still bypasses RLS automatically, but admin panel should prefer user-authenticated access.
