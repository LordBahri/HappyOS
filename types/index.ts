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
  date: string;
  created_at: string;
};
