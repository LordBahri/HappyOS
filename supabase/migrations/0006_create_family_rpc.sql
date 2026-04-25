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

  insert into family_members (family_id, user_id, role)
  values (new_family_id, auth.uid(), 'owner');

  return new_family_id;
end;
$$;
