-- ── Permission helper ────────────────────────────────────────────────────────
-- Returns true when the calling user has a specific jsonb permission in a family.
-- Uses SECURITY DEFINER so it can safely read family_members without recursion.
create or replace function has_family_permission(fid uuid, perm text)
returns bool
language sql
security definer stable
set search_path = public
as $$
  select coalesce(
    (
      select (permissions ->> perm)::boolean
      from family_members
      where family_id = fid
        and user_id   = auth.uid()
    ),
    false
  );
$$;

-- ── Families ─────────────────────────────────────────────────────────────────
-- Restrict family rename/update to admins only (was any member).
drop policy if exists "families: owner can update" on families;

create policy "families: admin can update"
  on families for update
  using (
    exists (
      select 1 from family_members
      where family_id = families.id
        and user_id   = auth.uid()
        and role      = 'admin'
    )
  );

-- ── Expenses ─────────────────────────────────────────────────────────────────
-- Gate all writes on the manage_expenses permission.
drop policy if exists "expenses: members can insert" on expenses;

create policy "expenses: members can insert"
  on expenses for insert
  with check (
    is_family_member(family_id)
    and created_by = auth.uid()
    and has_family_permission(family_id, 'manage_expenses')
  );

drop policy if exists "expenses: creator can update" on expenses;

create policy "expenses: creator can update"
  on expenses for update
  using (
    is_family_member(family_id)
    and created_by = auth.uid()
    and has_family_permission(family_id, 'manage_expenses')
  );

drop policy if exists "expenses: creator can delete" on expenses;

create policy "expenses: creator can delete"
  on expenses for delete
  using (
    is_family_member(family_id)
    and created_by = auth.uid()
    and has_family_permission(family_id, 'manage_expenses')
  );

-- ── Shopping items ────────────────────────────────────────────────────────────
-- Gate all writes on the manage_shopping permission.
drop policy if exists "shopping_items: members can insert" on shopping_items;

create policy "shopping_items: members can insert"
  on shopping_items for insert
  with check (
    is_family_member(family_id)
    and created_by = auth.uid()
    and has_family_permission(family_id, 'manage_shopping')
  );

drop policy if exists "shopping_items: members can update" on shopping_items;

create policy "shopping_items: members can update"
  on shopping_items for update
  using (
    is_family_member(family_id)
    and has_family_permission(family_id, 'manage_shopping')
  );

drop policy if exists "shopping_items: creator can delete" on shopping_items;

create policy "shopping_items: creator can delete"
  on shopping_items for delete
  using (
    is_family_member(family_id)
    and created_by = auth.uid()
    and has_family_permission(family_id, 'manage_shopping')
  );
