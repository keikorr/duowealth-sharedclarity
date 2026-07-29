export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Household {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'fixed' | 'variable' | 'income';
  category: string;
  icon: string;
  paidByRole: 'userA' | 'userB' | 'joint';
  paidByName?: string;
  paidByAvatar?: string;
  splitRatioA: number;
  splitRatioB: number;
  paymentMethod?: string;
  status?: 'paid' | 'pending';
  date: string;
  monthRef?: string;
}

export interface CardItem {
  id: string;
  name: string;
  bank: string;
  lastFour?: string;
  closingDay: number;
  dueDay: number;
  creditLimit: number;
  currentBill: number;
  isPaid: boolean;
}

export interface GoalItem {
  id: string;
  title: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  deadline: string;
  category: string;
  status: 'active' | 'completed' | 'archived';
  contributions?: Array<{
    id: string;
    amount: number;
    date: string;
    user?: { name: string; avatarUrl?: string };
  }>;
}

export interface AssetPosition {
  id: string;
  ticker: string;
  name: string;
  category: 'fixed_income' | 'stocks' | 'crypto' | 'reits';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  currentValue: number;
  gainLossPercentage: number;
  monthlyReturnFloat: number;
}

export interface BudgetVsActual {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  budgeted: number;
  actual: number;
  difference: number;
  isOverBudget: boolean;
}

export interface ProjectionPoint {
  year: number;
  label: string;
  expectedValue: number;
  conservativeValue: number;
}

export interface DashboardSummary {
  monthRef: string;
  healthStatus: 'excelente' | 'bom' | 'atenção';
  healthDescription: string;
  kpis: {
    jointBalance: { value: number; changePercentage: number };
    monthlyIncome: { value: number; status: string };
    fixedExpenses: { total: number; paidPercentage: number; paidCount: number; totalCount: number };
    savingsRate: { current: number; target: number };
  };
  categoryBreakdown: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    total: number;
    percentage: number;
  }>;
  recentTransactions: Transaction[];
  partners: {
    partnerA?: { id: string; name: string; avatar: string };
    partnerB?: { id: string; name: string; avatar: string };
  };
}
