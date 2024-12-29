// types/common.ts
import type { EmotionType } from "./emotions";

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  type: "income" | "expense";
  description?: string;
  date: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  emoji?: string;
  color?: string;
  created_at: string;
}

export interface FinancialGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  start_date: string;
  target_date?: string;
  status: "in_progress" | "completed" | "failed";
  created_at: string;
  updated_at: string;
}

export interface EmotionEntry {
  date: string;
  emotion: EmotionType;
  amount: number;
}
