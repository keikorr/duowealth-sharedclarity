import { create } from 'zustand';
import { User, Household } from '../types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  token: string | null;
  user: User | null;
  household: Household | null;
  selectedMonth: string;
  
  // Modals
  isAddTransactionOpen: boolean;
  isAddGoalOpen: boolean;
  isContributionOpen: boolean;
  selectedGoalId: string | null;
  isAddCardOpen: boolean;
  isAddInvestmentOpen: boolean;
  isSupportOpen: boolean;

  // Toasts
  toasts: Toast[];

  // Actions
  setAuth: (token: string, user: User, household?: Household) => void;
  logout: () => void;
  setSelectedMonth: (month: string) => void;
  
  openAddTransaction: () => void;
  closeAddTransaction: () => void;
  
  openAddGoal: () => void;
  closeAddGoal: () => void;
  
  openContribution: (goalId: string) => void;
  closeContribution: () => void;

  openAddCard: () => void;
  closeAddCard: () => void;

  openAddInvestment: () => void;
  closeAddInvestment: () => void;

  openSupport: () => void;
  closeSupport: () => void;

  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const currentMonthStr = new Date().toISOString().substring(0, 7);

export const useAppStore = create<AppState>((set) => ({
  token: localStorage.getItem('duowealth_token'),
  user: localStorage.getItem('duowealth_user') ? JSON.parse(localStorage.getItem('duowealth_user')!) : null,
  household: localStorage.getItem('duowealth_household') ? JSON.parse(localStorage.getItem('duowealth_household')!) : { id: 'our-wealth', name: 'Our Wealth' },
  selectedMonth: currentMonthStr,

  isAddTransactionOpen: false,
  isAddGoalOpen: false,
  isContributionOpen: false,
  selectedGoalId: null,
  isAddCardOpen: false,
  isAddInvestmentOpen: false,
  isSupportOpen: false,

  toasts: [],

  setAuth: (token, user, household) => {
    localStorage.setItem('duowealth_token', token);
    localStorage.setItem('duowealth_user', JSON.stringify(user));
    if (household) localStorage.setItem('duowealth_household', JSON.stringify(household));
    set({ token, user, household: household || null });
  },

  logout: () => {
    localStorage.removeItem('duowealth_token');
    localStorage.removeItem('duowealth_user');
    localStorage.removeItem('duowealth_household');
    set({ token: null, user: null, household: null });
  },

  setSelectedMonth: (month) => set({ selectedMonth: month }),

  openAddTransaction: () => set({ isAddTransactionOpen: true }),
  closeAddTransaction: () => set({ isAddTransactionOpen: false }),

  openAddGoal: () => set({ isAddGoalOpen: true }),
  closeAddGoal: () => set({ isAddGoalOpen: false }),

  openContribution: (goalId) => set({ isContributionOpen: true, selectedGoalId: goalId }),
  closeContribution: () => set({ isContributionOpen: false, selectedGoalId: null }),

  openAddCard: () => set({ isAddCardOpen: true }),
  closeAddCard: () => set({ isAddCardOpen: false }),

  openAddInvestment: () => set({ isAddInvestmentOpen: true }),
  closeAddInvestment: () => set({ isAddInvestmentOpen: false }),

  openSupport: () => set({ isSupportOpen: true }),
  closeSupport: () => set({ isSupportOpen: false }),

  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
