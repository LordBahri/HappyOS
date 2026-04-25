export type User = {
  id: string;
  email: string;
  family_id: string;
};

export type Family = {
  id: string;
  name: string;
};

export type ShoppingItem = {
  id: string;
  family_id: string;
  created_by: string;
  name: string;
  quantity: number;
  checked: boolean;
  created_at: string;
};

export type Expense = {
  id: string;
  family_id: string;
  created_by: string;
  title: string;
  amount: number;
  category: string | null;
  currency: string;
  notes: string | null;
  tags: string[];
  is_recurring: boolean;
  date: string;
  created_at: string;
};

export type MemberPermissions = {
  manage_members: boolean;
  manage_expenses: boolean;
  manage_shopping: boolean;
};

export type FamilyMember = {
  id: string;
  family_id: string;
  user_id: string;
  role: "admin" | "member";
  permissions: MemberPermissions;
  joined_at: string;
  email: string;
};

export type MonthSummary = {
  total: number;
  count: number;
  recurringTotal: number;
  byCategory: Record<string, number>;
  byCurrency: Record<string, number>;
};
