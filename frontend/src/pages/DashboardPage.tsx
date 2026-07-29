import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { api } from '../api/client';
import { useAppStore } from '../store/useAppStore';
import { DashboardSummary } from '../types';

export const DashboardPage: React.FC = () => {
  const { selectedMonth, setSelectedMonth, openAddTransaction, openAddInvestment } = useAppStore();

  const { data, isLoading, error } = useQuery<DashboardSummary>({
    queryKey: ['dashboard', selectedMonth],
    queryFn: async () => {
      const res = await api.get(`/dashboard/summary?month=${selectedMonth}`);
      return res.data;
    }
  });

  const monthOptions = [
    { label: 'Março 2024', value: '2024-03' },
    { label: 'Fevereiro 2024', value: '2024-02' },
    { label: 'Janeiro 2024', value: '2024-01' },
    { label: 'Dezembro 2023', value: '2023-12' },
    { label: 'Outubro 2023', value: '2023-10' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-surface-container rounded-card w-1/2"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-surface-container rounded-card"></div>
          ))}
        </div>
        <div className="h-64 bg-surface-container rounded-card"></div>
      </div>
    );
  }

  const kpis = data?.kpis;
  const categoryBreakdown = data?.categoryBreakdown || [];

  return (
    <div className="space-y-stack-lg pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-on-surface mb-1">
            Olá, Casal! 👋
          </h1>
          <p className="text-on-surface-variant text-sm font-sans">
            Sua saúde financeira compartilhada está em{' '}
            <span className="text-primary font-bold">{data?.healthStatus || 'excelente estado'}</span>.
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant p-2 rounded-card">
          <span className="material-symbols-outlined text-primary">calendar_month</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent font-mono text-sm text-on-surface font-semibold cursor-pointer border-none focus:ring-0"
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value} className="bg-surface-container text-on-surface">
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Saldo Conjunto */}
        <div className="bg-surface-container p-5 rounded-card border border-outline-variant card-active relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Saldo Conjunto
            </span>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-card">
              account_balance
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-on-surface mb-1">
            R$ {(kpis?.jointBalance.value || 215250).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 font-mono text-xs text-primary font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+{kpis?.jointBalance.changePercentage || 12.4}% vs. mês anterior</span>
          </div>
        </div>

        {/* KPI 2: Receita Mensal */}
        <div className="bg-surface-container p-5 rounded-card border border-outline-variant relative">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Receita Mensal
            </span>
            <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-card">
              payments
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-on-surface mb-1">
            R$ {(kpis?.monthlyIncome.value || 27300).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 font-mono text-xs text-secondary font-semibold">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{kpis?.monthlyIncome.status || 'dentro do previsto'}</span>
          </div>
        </div>

        {/* KPI 3: Despesas Fixas */}
        <div className="bg-surface-container p-5 rounded-card border border-outline-variant relative">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Despesas Fixas
            </span>
            <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2 rounded-card">
              receipt_long
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-on-surface mb-2">
            {kpis?.fixedExpenses.paidPercentage || 85}% pago
          </div>
          {/* Progress bar */}
          <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden mb-1">
            <div
              className="bg-gradient-to-r from-secondary to-primary h-full transition-all duration-500"
              style={{ width: `${kpis?.fixedExpenses.paidPercentage || 85}%` }}
            ></div>
          </div>
          <span className="font-mono text-xs text-on-surface-variant">
            {kpis?.fixedExpenses.paidCount || 5} de {kpis?.fixedExpenses.totalCount || 6} contas liquidadas
          </span>
        </div>

        {/* KPI 4: Taxa de Poupança */}
        <div className="bg-surface-container p-5 rounded-card border border-outline-variant relative">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Taxa de Poupança
            </span>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-card">
              savings
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-primary mb-1">
            {kpis?.savingsRate.current || 35}%
          </div>
          <div className="font-mono text-xs text-on-surface-variant">
            Meta definida pelo casal: <span className="text-on-surface font-bold">{kpis?.savingsRate.target || 30}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section: Donut Chart + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        {/* Gastos por Categoria (Donut Chart) */}
        <div className="lg:col-span-5 bg-surface-container p-6 rounded-card border border-outline-variant flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-sans text-lg font-bold text-on-surface">Gastos por Categoria</h2>
            <span className="font-mono text-xs text-on-surface-variant">Este Mês</span>
          </div>

          <div className="relative h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="total"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-surface-container-high p-3 rounded-card border border-outline-variant shadow-lg text-xs font-mono">
                          <p className="font-bold text-on-surface">{data.name}</p>
                          <p className="text-primary font-bold">R$ {data.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <p className="text-on-surface-variant">{data.percentage}% do total</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-xs text-on-surface-variant">Total</span>
              <span className="font-mono text-lg font-bold text-on-surface">
                R$ {categoryBreakdown.reduce((acc, c) => acc + c.total, 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Breakdown legend */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-outline-variant">
            {categoryBreakdown.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-on-surface-variant truncate max-w-[100px]">{cat.name}</span>
                </div>
                <span className="font-bold text-on-surface">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transações Recentes */}
        <div className="lg:col-span-7 bg-surface-container p-6 rounded-card border border-outline-variant flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-sans text-lg font-bold text-on-surface">Transações Recentes</h2>
            <a href="/expenses" className="font-mono text-xs text-primary font-bold hover:underline flex items-center gap-1">
              <span>Ver tudo</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="divide-y divide-outline-variant/40 space-y-3">
            {data?.recentTransactions && data.recentTransactions.length > 0 ? (
              data.recentTransactions.map((tx) => (
                <div key={tx.id} className="pt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface-container-low rounded-card text-primary border border-outline-variant">
                      <span className="material-symbols-outlined text-xl">{tx.icon || 'receipt'}</span>
                    </div>
                    <div>
                      <p className="font-sans text-sm font-semibold text-on-surface">{tx.description}</p>
                      <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-mono text-sm font-bold ${tx.type === 'income' ? 'text-primary' : 'text-on-surface'}`}>
                      {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-xs font-mono">
                      {tx.paidByAvatar && (
                        <img className="w-4 h-4 rounded-full" src={tx.paidByAvatar} alt="Paid by" />
                      )}
                      <span className="text-on-surface-variant text-[10px]">
                        {tx.paidByRole === 'joint' ? 'Conjunta' : tx.paidByName || 'Parceiro'} ({tx.splitRatioA}/{tx.splitRatioB})
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm font-mono text-on-surface-variant py-8 text-center">
                Nenhuma transação cadastrada neste mês.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-outline-variant flex justify-end">
            <button
              onClick={openAddTransaction}
              className="text-xs font-mono text-primary font-bold flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Adicionar nova despesa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu de Ações Rápidas Flutuante */}
      <div className="fixed bottom-20 md:bottom-8 right-6 z-40 flex items-center gap-2 bg-surface-container-high/90 backdrop-blur-xl border border-outline-variant p-2 rounded-card shadow-2xl">
        <button
          onClick={openAddInvestment}
          className="px-3 py-2 text-xs font-mono font-bold text-secondary hover:bg-secondary/10 rounded-card flex items-center gap-1 transition-all"
        >
          <span className="material-symbols-outlined text-sm">show_chart</span>
          <span>+ Investir</span>
        </button>
        <button
          onClick={openAddTransaction}
          className="px-3 py-2 text-xs font-mono font-bold text-primary hover:bg-primary/10 rounded-card flex items-center gap-1 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>+ Nova Despesa</span>
        </button>
      </div>
    </div>
  );
};
