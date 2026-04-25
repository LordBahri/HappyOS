-- ── updated_at trigger ────────────────────────────────────────────────────────
-- Single shared function; each table gets its own trigger below.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Timestamps ────────────────────────────────────────────────────────────────
-- Add updated_at to every table whose rows can be mutated after insert.
-- DEFAULT now() back-fills existing rows safely without touching them.

alter table families
  add column updated_at timestamptz not null default now();

alter table family_members
  add column updated_at timestamptz not null default now();

alter table expenses
  add column updated_at timestamptz not null default now();

alter table shopping_items
  add column updated_at timestamptz not null default now();

-- Triggers keep updated_at current on every subsequent UPDATE.
create trigger families_set_updated_at
  before update on families
  for each row execute function set_updated_at();

create trigger family_members_set_updated_at
  before update on family_members
  for each row execute function set_updated_at();

create trigger expenses_set_updated_at
  before update on expenses
  for each row execute function set_updated_at();

create trigger shopping_items_set_updated_at
  before update on shopping_items
  for each row execute function set_updated_at();

-- ── Category normalisation ────────────────────────────────────────────────────
-- Canonical set matches the CATEGORIES constant in lib/expenses.ts.
-- Migrate any out-of-set or NULL values to 'Other' before constraining.

update expenses
  set category = 'Other'
  where category is null
     or category not in (
       'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'
     );

-- Default so new rows that omit category silently get 'Other'.
alter table expenses
  alter column category set default 'Other';

-- Constraint enforces the canonical set going forward.
alter table expenses
  add constraint expenses_category_valid
  check (
    category is null
    or category in ('Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other')
  );

-- ── Analytics indexes ─────────────────────────────────────────────────────────
-- Supports time-series queries by category and recurring-expense analytics.
create index on expenses (family_id, date, category);
create index on expenses (family_id, is_recurring, date);
