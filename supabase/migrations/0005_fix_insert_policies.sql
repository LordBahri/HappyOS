-- Fix: explicitly target authenticated role for insert policies
-- The previous policies omitted the role, causing them to not apply correctly

drop policy if exists "families: service role insert" on families;
drop policy if exists "family_members: service role insert" on family_members;

create policy "families: authenticated can insert"
  on families for insert
  to authenticated
  with check (true);

create policy "family_members: authenticated can insert"
  on family_members for insert
  to authenticated
  with check (true);
