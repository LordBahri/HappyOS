export type User = {
  id: string;
  email: string;
  family_id: string;
};

export type Family = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  family_id: string;
  created_by: string;
  title: string;
  amount: number;
  category: string | null;
  date: string;
  created_at: string;
};
