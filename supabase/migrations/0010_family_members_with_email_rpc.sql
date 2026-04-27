-- Returns family members with email for a given family.
-- SECURITY DEFINER so we can read auth.users; caller must be a member.
create or replace function get_family_members_with_email(p_family_id uuid)
returns table (
  id          uuid,
  family_id   uuid,
  user_id     uuid,
  role        text,
  permissions jsonb,
  joined_at   timestamptz,
  email       text
)
language sql
security definer
set search_path = public
as $$
  select
    fm.id,
    fm.family_id,
    fm.user_id,
    fm.role::text,
    fm.permissions,
    fm.joined_at,
    u.email
  from family_members fm
  join auth.users u on u.id = fm.user_id
  where fm.family_id = p_family_id
    and exists (
      select 1 from family_members caller
      where caller.family_id = p_family_id
        and caller.user_id   = auth.uid()
    )
  order by fm.joined_at;
$$;
