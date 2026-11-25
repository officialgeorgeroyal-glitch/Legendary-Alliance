-- Legendary Alliance Shared Database Schema (Web + React Native)
create extension if not exists "uuid-ossp";

-- 1. Member Profiles & KYC Status
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  city text,
  country text,
  loyalty_points integer not null default 0,
  loyalty_tier text not null default 'Bronze',
  kyc_status text not null default 'Pending',
  referral_code text unique,
  created_at timestamptz not null default now()
);

-- 2. Asset Acquisition Proposals (Clubs, Training Facilities, Hospitality, Football Tech)
create table if not exists public.asset_proposals (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null check (category in ('Football Club', 'Training Facility', 'Hospitality Venue', 'Football Technology')),
  location text not null,
  target_budget_eur numeric(14,2) not null,
  summary text not null,
  proposed_by uuid references public.profiles(id) on delete set null,
  status text not null default 'Active Vote' check (status in ('Active Vote', 'Due Diligence', 'Approved')),
  created_at timestamptz not null default now()
);

create table if not exists public.proposal_votes (
  id uuid primary key default uuid_generate_v4(),
  proposal_id uuid not null references public.asset_proposals(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  choice text not null check (choice in ('for', 'against')),
  created_at timestamptz not null default now(),
  unique (proposal_id, member_id)
);

-- 3. News Briefs & Business Newsletters
create table if not exists public.news_briefs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  summary text not null,
  image_url text,
  featured boolean not null default false,
  published_at timestamptz not null default now()
);

-- 4. Personalized Followed Clubs & National Teams
create table if not exists public.member_followed_teams (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  team_code text not null,
  team_name text not null,
  team_type text not null check (team_type in ('Club', 'National Team')),
  hub_city text not null,
  created_at timestamptz not null default now(),
  unique (member_id, team_code)
);

-- 5. Community Chat & Live Conferencing Rooms
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  channel text not null default 'general',
  sender_id uuid references public.profiles(id) on delete set null,
  sender_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.conference_rooms (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  host_name text not null,
  topic text not null,
  scheduled_time text not null,
  status text not null default 'Upcoming' check (status in ('Live Now', 'Upcoming')),
  created_at timestamptz not null default now()
);

-- 6. Member Contributions & Referrals
create table if not exists public.contributions (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  recipient_name text not null,
  amount_eur numeric(12,2) not null,
  purpose text not null,
  status text not null default 'Completed',
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.asset_proposals enable row level security;
alter table public.proposal_votes enable row level security;
alter table public.news_briefs enable row level security;
alter table public.member_followed_teams enable row level security;
alter table public.chat_messages enable row level security;
alter table public.conference_rooms enable row level security;
alter table public.contributions enable row level security;

-- Basic Authenticated Read/Write Policies
create policy "Public read proposals" on public.asset_proposals for select using (true);
create policy "Authenticated create proposals" on public.asset_proposals for insert with check (auth.role() = 'authenticated');
create policy "Authenticated vote" on public.proposal_votes for all using (auth.uid() = member_id);
create policy "Public read news" on public.news_briefs for select using (true);
create policy "Public read conferences" on public.conference_rooms for select using (true);
create policy "Authenticated chat read" on public.chat_messages for select using (auth.role() = 'authenticated');
create policy "Authenticated chat insert" on public.chat_messages for insert with check (auth.role() = 'authenticated');