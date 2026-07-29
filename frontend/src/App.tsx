import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from './store/useAppStore';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';

import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { AddGoalModal } from './components/modals/AddGoalModal';
import { GoalContributionModal } from './components/modals/GoalContributionModal';
import { AddCardModal } from './components/modals/AddCardModal';
import { AddInvestmentModal } from './components/modals/AddInvestmentModal';
import { SupportModal } from './components/modals/SupportModal';

import { DashboardPage } from './pages/DashboardPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { GoalsPage } from './pages/GoalsPage';
import { WealthPage } from './pages/WealthPage';
import { TrendsPage } from './pages/TrendsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAppStore();
  const location = useLocation();

  if (!token && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen pt-16 md:pt-0 bg-background text-on-surface">
      <Header />
      <Sidebar />
      <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop pb-24 md:pb-margin-desktop min-h-screen">
        {children}
      </main>
      <BottomNav />

      {/* Global Modals */}
      <AddTransactionModal />
      <AddGoalModal />
      <GoalContributionModal />
      <AddCardModal />
      <AddInvestmentModal />
      <SupportModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <DashboardPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedLayout>
                <ExpensesPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedLayout>
                <GoalsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/wealth"
            element={
              <ProtectedLayout>
                <WealthPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/trends"
            element={
              <ProtectedLayout>
                <TrendsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedLayout>
                <SettingsPage />
              </ProtectedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
