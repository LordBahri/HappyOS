-- Add admin role (owner remains in enum for backward compat but is migrated below)
alter type member_role add value if not exists 'admin';

-- Migrate existing owners to admin
update family_members set role = 'admin' where role = 'owner';

-- Permissions: open jsonb so individual capabilities can be toggled per member
alter table family_members
  add column permissions jsonb not null default '{}';

-- Seed default permissions by role
update family_members
  set permissions = '{"manage_members":true,"manage_expenses":true,"manage_shopping":true}'
  where role = 'admin';

update family_members
  set permissions = '{"manage_members":false,"manage_expenses":true,"manage_shopping":true}'
  where role = 'member';

-- Update RLS: admin replaces owner for member management
drop policy if exists "family_members: owner can manage" on family_members;

create policy "family_members: admin can manage"
  on family_members for all
  using (
    exists (
      select 1 from family_members fm
      where fm.family_id = family_members.family_id
        and fm.user_id   = auth.uid()
        and fm.role      = 'admin'
    )
  );

-- Update the RPC to create admins (was 'owner')
create or replace function create_family_for_user()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_family_id uuid;
begin
  select family_id into new_family_id
  from family_members
  where user_id = auth.uid()
  limit 1;

  if new_family_id is not null then
    return new_family_id;
  end if;

  insert into families (name)
  values ('My Family')
  returning id into new_family_id;

  insert into family_members (family_id, user_id, role, permissions)
  values (
    new_family_id,
    auth.uid(),
    'admin',
    '{"manage_members":true,"manage_expenses":true,"manage_shopping":true}'
  );

  return new_family_id;
end;
$$;
