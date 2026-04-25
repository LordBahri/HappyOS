-- ── Shopping items sort ───────────────────────────────────────────────────────
-- The shopping page orders by (checked ASC, created_at DESC).
-- The existing (family_id, checked) index can't satisfy the secondary sort,
-- so Postgres falls back to a heap sort after the index scan.
-- This covering index eliminates the sort step for both:
--   - shopping page: ORDER BY checked ASC, created_at DESC
--   - dashboard preview: WHERE checked = false ORDER BY created_at DESC
create index on shopping_items (family_id, checked, created_at desc);

-- ── requireAdmin covering index ───────────────────────────────────────────────
-- The admin guard in every member/invite action does:
--   SELECT role FROM family_members WHERE family_id = X AND user_id = Y
-- The unique constraint on (family_id, user_id) locates the row, but Postgres
-- must then visit the heap to read `role`. INCLUDE avoids that heap fetch.
create index on family_members (family_id, user_id) include (role);

-- ── family_invites admin list ─────────────────────────────────────────────────
-- Admins listing pending invites filter by family_id and accepted_at IS NULL.
create index on family_invites (family_id, accepted_at) where accepted_at is null;
