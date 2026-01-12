
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tenants Table
create table public.tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique, -- For subdomains or URL paths
  domain text unique, -- For custom domains
  created_at timestamp with time zone default now()
);

-- Profiles Table (Extends Supabase Auth Users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tenant Users (Many-to-Many: Users belong to Tenants with a Role)
create table public.tenant_users (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('admin', 'teacher', 'student', 'parent')),
  created_at timestamp with time zone default now(),
  unique(tenant_id, user_id)
);

-- RLS: Enable on all tables
alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.tenant_users enable row level security;

-- RLS Policies (Basic Examples)
-- Profiles: Users can read their own
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

-- Tenants: Public read for login resolution (or restricted to members)
-- For MVP, let's allow finding tenants by slug
create policy "Public can read tenant slugs" on public.tenants
  for select using (true);

-- Tenant Users: Users can read their own memberships
create policy "Users can read memberships" on public.tenant_users
  for select using (auth.uid() = user_id);

-- Helper function to get current user's role in a tenant
-- (Used for ABAC/RBAC checks in DB)
