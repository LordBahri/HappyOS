-- Auto-create a family and owner membership when a user signs up
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  new_family_id uuid;
begin
  insert into families (name)
  values ('My Family')
  returning id into new_family_id;

  insert into family_members (family_id, user_id, role)
  values (new_family_id, new.id, 'owner');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
