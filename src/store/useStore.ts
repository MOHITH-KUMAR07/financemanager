import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'viewer' | 'admin';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', date: '2023-11-01', amount: 5000, category: 'Salary', type: 'income', description: 'November Salary' },
  { id: '2', date: '2023-11-05', amount: 150, category: 'Groceries', type: 'expense', description: 'Whole Foods' },
  { id: '3', date: '2023-11-10', amount: 80, category: 'Utilities', type: 'expense', description: 'Electric Bill' },
  { id: '4', date: '2023-11-15', amount: 200, category: 'Dining', type: 'expense', description: 'Dinner with friends' },
  { id: '5', date: '2023-11-20', amount: 50, category: 'Entertainment', type: 'expense', description: 'Movie tickets' },
  { id: '6', date: '2023-12-01', amount: 5000, category: 'Salary', type: 'income', description: 'December Salary' },
  { id: '7', date: '2023-12-03', amount: 120, category: 'Groceries', type: 'expense', description: 'Trader Joes' },
  { id: '8', date: '2023-12-08', amount: 1000, category: 'Rent', type: 'expense', description: 'December Rent' },
  { id: '9', date: '2023-12-15', amount: 300, category: 'Shopping', type: 'expense', description: 'Holiday gifts' },
  { id: '10', date: '2023-12-28', amount: 90, category: 'Utilities', type: 'expense', description: 'Internet Bill' },
  { id: '11', date: '2024-01-01', amount: 5000, category: 'Salary', type: 'income', description: 'January Salary' },
  { id: '12', date: '2024-01-05', amount: 200, category: 'Groceries', type: 'expense', description: 'Costco Run' },
  { id: '13', date: '2024-01-12', amount: 1000, category: 'Rent', type: 'expense', description: 'January Rent' },
  { id: '14', date: '2024-01-20', amount: 150, category: 'Transport', type: 'expense', description: 'Gas & Train' },
  { id: '15', date: '2024-02-01', amount: 5000, category: 'Salary', type: 'income', description: 'February Salary' },
  { id: '16', date: '2024-02-04', amount: 180, category: 'Groceries', type: 'expense', description: 'Weekly Groceries' },
  { id: '17', date: '2024-02-15', amount: 400, category: 'Healthcare', type: 'expense', description: 'Dental Visit' },
  { id: '18', date: '2024-03-01', amount: 5000, category: 'Salary', type: 'income', description: 'March Salary' },
  { id: '19', date: '2024-03-05', amount: 250, category: 'Dining', type: 'expense', description: 'Anniversary Dinner' },
  { id: '20', date: '2024-03-10', amount: 1000, category: 'Rent', type: 'expense', description: 'March Rent' },
];

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set: any) => ({
      role: 'viewer' as Role, // default role
      setRole: (role: Role) => set({ role }),
      transactions: mockTransactions,
      addTransaction: (tx: Omit<Transaction, 'id'>) => set((state: AppState) => ({
        transactions: [{ ...tx, id: Math.random().toString(36).substr(2, 9) }, ...state.transactions],
      })),
      editTransaction: (id: string, txUpdate: Partial<Transaction>) => set((state: AppState) => ({
        transactions: state.transactions.map((t: Transaction) => t.id === id ? { ...t, ...txUpdate } : t),
      })),
      deleteTransaction: (id: string) => set((state: AppState) => ({
        transactions: state.transactions.filter((t: Transaction) => t.id !== id),
      })),
    }),
    {
      name: 'finance-storage', 
    }
  )
);
