-- Replace circular is_family_member() SELECT policy with a direct check
drop policy if exists "family_members: members can read" on family_members;

-- Own row: needed for getFamilyId
create policy "family_members: read own"
  on family_members for select
  using (user_id = auth.uid());

-- Co-members: needed for listing family (uses security definer fn, safe)
create policy "family_members: read co-members"
  on family_members for select
  using (
    family_id = (
      select family_id from family_members
      where user_id = auth.uid()
      limit 1
    )
  );

-- Allow the trigger (security definer / postgres) to insert
-- Without this, RLS blocks the trigger's INSERT even with security definer
-- on restricted Supabase plans
create policy "family_members: service role insert"
  on family_members for insert
  with check (true);

-- Same for families table
create policy "families: service role insert"
  on families for insert
  with check (true);
