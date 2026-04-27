alter table expenses
  add column currency    text        not null default 'USD',
  add column notes       text,
  add column tags        text[]      not null default '{}',
  add column is_recurring boolean    not null default false;

comment on column expenses.currency     is 'ISO 4217 code, e.g. USD, GBP, EUR';
comment on column expenses.tags         is 'Free-form labels for analytics grouping';
comment on column expenses.is_recurring is 'Marks the expense as a recurring charge';

create index on expenses (family_id, currency);
create index on expenses using gin (tags);
