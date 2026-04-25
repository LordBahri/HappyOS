-- ============================================================
-- Tables
-- ============================================================

create table families (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create type member_role as enum ('owner', 'member');

create table family_members (
  id        uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  role      member_role not null default 'member',
  joined_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create table expenses (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  title      text not null,
  amount     numeric(10, 2) not null check (amount > 0),
  category   text,
  date       date not null default current_date,
  created_at timestamptz not null default now()
);

create table shopping_items (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  name       text not null,
  quantity   int not null default 1 check (quantity > 0),
  checked    bool not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================

create index on family_members (family_id);
create index on family_members (user_id);

create index on expenses (family_id);
create index on expenses (family_id, date desc);

create index on shopping_items (family_id);
create index on shopping_items (family_id, checked);

-- ============================================================
-- RLS helper
-- ============================================================

create or replace function is_family_member(fid uuid)
returns bool
language sql
security definer stable
as $$
  select exists (
    select 1 from family_members
    where family_id = fid
    and   user_id   = auth.uid()
  );
$$;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table families       enable row level security;
alter table family_members enable row level security;
alter table expenses       enable row level security;
alter table shopping_items enable row level security;

-- families
create policy "families: members can read"
  on families for select
  using (is_family_member(id));

create policy "families: owner can update"
  on families for update
  using (is_family_member(id));

-- family_members
create policy "family_members: members can read"
  on family_members for select
  using (is_family_member(family_id));

create policy "family_members: owner can manage"
  on family_members for all
  using (
    exists (
      select 1 from family_members fm
      where fm.family_id = family_members.family_id
      and   fm.user_id   = auth.uid()
      and   fm.role      = 'owner'
    )
  );

-- expenses
create policy "expenses: members can read"
  on expenses for select
  using (is_family_member(family_id));

create policy "expenses: members can insert"
  on expenses for insert
  with check (is_family_member(family_id) and created_by = auth.uid());

create policy "expenses: creator can update"
  on expenses for update
  using (is_family_member(family_id) and created_by = auth.uid());

create policy "expenses: creator can delete"
  on expenses for delete
  using (is_family_member(family_id) and created_by = auth.uid());

-- shopping_items
create policy "shopping_items: members can read"
  on shopping_items for select
  using (is_family_member(family_id));

create policy "shopping_items: members can insert"
  on shopping_items for insert
  with check (is_family_member(family_id) and created_by = auth.uid());

create policy "shopping_items: members can update"
  on shopping_items for update
  using (is_family_member(family_id));

create policy "shopping_items: creator can delete"
  on shopping_items for delete
  using (is_family_member(family_id) and created_by = auth.uid());
