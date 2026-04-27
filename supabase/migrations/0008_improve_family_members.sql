-- Add admin role — must commit before it can be used (see migration 0009)
alter type member_role add value if not exists 'admin';
