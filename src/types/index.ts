export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
};

export type Filters = {
  month: string;
  category: string;
  minAmount?: number;
  maxAmount?: number;
};
