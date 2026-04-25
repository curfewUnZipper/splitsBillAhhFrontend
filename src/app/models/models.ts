export interface Expense {
  id?: number;                 // 👈 optional (backend will send)
  description: string;
  amount: number;
  paidBy: 'A' | 'B';
}

export interface Settlement {
  id?: number;
  amount: number;
  paidBy: 'A' | 'B';
  receivedBy?: 'A' | 'B';
}

export interface Group {
  id: number;                  // 👈 REQUIRED (from backend)
  name: string;
  from: string;
  to: string;
  expenses: Expense[];
  settlements: Settlement[];
  expanded?: boolean;
}