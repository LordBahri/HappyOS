create table family_invites (
  id          uuid        primary key default gen_random_uuid(),
  family_id   uuid        not null references families(id) on delete cascade,
  invited_by  uuid        not null references auth.users(id),
  email       text        not null,
  token       text        not null unique default encode(gen_random_bytes(32), 'hex'),
  expires_at  timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  created_at  timestamptz not null default now()
);

create index on family_invites (token);
create index on family_invites (family_id);

alter table family_invites enable row level security;

-- Only admins of the family can create / view invites
create policy "family_invites: admin can manage"
  on family_invites for all
  using (
    exists (
      select 1 from family_members
      where family_id = family_invites.family_id
        and user_id   = auth.uid()
        and role      = 'admin'
    )
  );

-- ── RPCs ─────────────────────────────────────────────────────────────────────

-- Public look-up: returns family name + validity without requiring membership.
create or replace function get_invite_info(p_token text)
returns json
language plpgsql
security definer stable
set search_path = public
as $$
declare
  inv family_invites;
  fam families;
begin
  select * into inv
  from family_invites
  where token       = p_token
    and accepted_at is null
    and expires_at  > now();

  if not found then
    return json_build_object('valid', false);
  end if;

  select * into fam from families where id = inv.family_id;

  return json_build_object(
    'valid',       true,
    'family_name', fam.name,
    'email',       inv.email
  );
end;
$$;

-- Accept: validates token, adds caller to family, marks invite used.
create or replace function accept_family_invite(p_token text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  inv family_invites;
begin
  select * into inv
  from family_invites
  where token       = p_token
    and accepted_at is null
    and expires_at  > now();

  if not found then
    return json_build_object('error', 'Invite not found or expired');
  end if;

  if exists (
    select 1 from family_members
    where family_id = inv.family_id
      and user_id   = auth.uid()
  ) then
    return json_build_object('error', 'Already a member of this family');
  end if;

  insert into family_members (family_id, user_id, role, permissions)
  values (
    inv.family_id,
    auth.uid(),
    'member',
    '{"manage_members":false,"manage_expenses":true,"manage_shopping":true}'
  );

  update family_invites
  set accepted_at = now()
  where id = inv.id;

  return json_build_object('family_id', inv.family_id::text);
end;
$$;
