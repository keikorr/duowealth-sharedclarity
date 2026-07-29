import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export const ExpensesPage: React.FC = () => {
  const { selectedMonth, setSelectedMonth, openAddTransaction, openAddCard, addToast } = useAppStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'fixed' | 'variable' | 'cards'>('fixed');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch transactions
  const { data: transactions = [], isLoading: loadingTx } = useQuery({
    queryKey: ['transactions', activeTab, selectedMonth, statusFilter],
    queryFn: async () => {
      let url = `/transactions?month=${selectedMonth}`;
      if (activeTab !== 'cards') {
        url += `&type=${activeTab}`;
      }
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      const res = await api.get(url);
      return res.data;
    }
  });

  // Fetch budget vs actual comparison
  const { data: budgetData = [] } = useQuery({
    queryKey: ['budgets', selectedMonth],
    queryFn: async () => {
      const res = await api.get(`/budgets?month=${selectedMonth}`);
      return res.data;
    }
  });

  // Fetch credit cards
  const { data: cards = [] } = useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const res = await api.get('/cards');
      return res.data;
    }
  });

  // Toggle transaction status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'paid' | 'pending' }) => {
      const res = await api.patch(`/transactions/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      addToast('Status da conta atualizado!', 'success');
    }
  });

  // Delete transaction mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/transactions/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      addToast('Transação removida.', 'info');
    }
  });

  // Calculate summary metrics
  const totalPaid = transactions
    .filter((t: any) => t.status === 'paid')
    .reduce((acc: number, t: any) => acc + t.amount, 0);

  const totalRemaining = transactions
    .filter((t: any) => t.status === 'pending')
    .reduce((acc: number, t: any) => acc + t.amount, 0);

  const paidCount = transactions.filter((t: any) => t.status === 'paid').length;
  const totalCount = transactions.length;

  return (
    <div className="space-y-stack-lg pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-on-surface mb-1">
            Gestão de Gastos & Cartões
          </h1>
          <p className="text-on-surface-variant text-sm font-sans">
            Acompanhe a divisão de contas, orçados vs. realizados e faturas do casal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddTransaction}
            className="bg-primary text-on-primary-container font-bold px-4 py-2 rounded-card flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>+ Salvar Gasto</span>
          </button>
        </div>
      </div>

      {/* Segmented Control Toggle */}
      <div className="flex bg-surface-container-low p-1.5 rounded-card border border-outline-variant max-w-md">
        <button
          onClick={() => setActiveTab('fixed')}
          className={`flex-1 py-2 text-xs font-mono rounded-card font-semibold transition-all ${
            activeTab === 'fixed'
              ? 'bg-surface-container-high text-on-surface shadow border border-primary/30'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Gastos Fixos
        </button>
        <button
          onClick={() => setActiveTab('variable')}
          className={`flex-1 py-2 text-xs font-mono rounded-card font-semibold transition-all ${
            activeTab === 'variable'
              ? 'bg-surface-container-high text-on-surface shadow border border-primary/30'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Gastos Variáveis
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`flex-1 py-2 text-xs font-mono rounded-card font-semibold transition-all ${
            activeTab === 'cards'
              ? 'bg-surface-container-high text-on-surface shadow border border-primary/30'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Cartões ({cards.length})
        </button>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Pago */}
        <div className="bg-surface-container p-5 rounded-card border border-outline-variant card-active">
          <span className="font-mono text-xs text-on-surface-variant uppercase">Total Pago</span>
          <p className="font-mono text-2xl font-bold text-primary mt-1">
            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            {paidCount} de {totalCount} contas liquidadas no mês
          </p>
        </div>

        {/* Card 2: Restante Pendente */}
        <div className="bg-surface-container p-5 rounded-card border border-outline-variant">
          <span className="font-mono text-xs text-on-surface-variant uppercase">Restante Pendente</span>
          <p className="font-mono text-2xl font-bold text-error mt-1">
            R$ {totalRemaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="font-mono text-xs text-on-surface-variant mt-1">Vencimentos próximos nesta semana</p>
        </div>

        {/* Card 3: Próximo Vencimento */}
        <div className="bg-surface-container p-5 rounded-card border border-outline-variant">
          <span className="font-mono text-xs text-on-surface-variant uppercase">Próximo Vencimento</span>
          <p className="font-sans text-lg font-bold text-secondary mt-1">Fatura Nubank Violeta</p>
          <p className="font-mono text-xs text-secondary/90 mt-1 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>Vence em 2 dias (Dia 10)</span>
          </p>
        </div>
      </div>

      {/* Bloco Budgeted vs Actual (Comparação Orçado vs Realizado por categoria) */}
      <div className="bg-surface-container p-6 rounded-card border border-outline-variant space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="font-sans text-lg font-bold text-on-surface">Budgeted vs. Actual</h2>
            <p className="font-mono text-xs text-on-surface-variant">Comparativo de orçamento definido vs. gasto realizado por categoria</p>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-surface-container-low border border-outline-variant rounded-card px-3 py-1.5 font-mono text-xs text-on-surface"
          >
            <option value="2024-03">Março 2024</option>
            <option value="2024-02">Fevereiro 2024</option>
            <option value="2024-01">Janeiro 2024</option>
          </select>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetData}>
              <XAxis dataKey="categoryName" stroke="#86948a" fontSize={12} tickLine={false} />
              <YAxis stroke="#86948a" fontSize={12} tickLine={false} />
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-surface-container-high p-3 rounded-card border border-outline-variant shadow-lg text-xs font-mono">
                        <p className="font-bold text-on-surface">{data.categoryName}</p>
                        <p className="text-secondary">Orçado: R$ {data.budgeted}</p>
                        <p className="text-primary font-bold">Realizado: R$ {data.actual}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'JetBrains Mono' }} />
              <Bar dataKey="budgeted" name="Orçado (R$)" fill="#0566d9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Realizado (R$)" fill="#4edea3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Credit Cards View (if ActiveTab === 'cards') */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-sans text-lg font-bold text-on-surface">Cartões de Crédito do Casal</h2>
            <button
              onClick={openAddCard}
              className="bg-secondary/20 text-secondary border border-secondary/40 font-mono text-xs font-bold px-3 py-1.5 rounded-card flex items-center gap-1 hover:bg-secondary/30 transition-all"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>+ Novo Cartão</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card: any) => (
              <div key={card.id} className="bg-surface-container p-6 rounded-card border border-outline-variant space-y-4 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-on-surface-variant uppercase">{card.bank}</span>
                    <h3 className="font-sans text-xl font-bold text-on-surface">{card.name}</h3>
                    <p className="font-mono text-xs text-on-surface-variant">•••• {card.lastFour || '8842'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    card.isPaid ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                  }`}>
                    {card.isPaid ? 'FATURA PAGA' : 'PENDENTE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-outline-variant">
                  <div>
                    <span className="font-mono text-xs text-on-surface-variant">Fatura Atual</span>
                    <p className="font-mono text-xl font-bold text-on-surface">
                      R$ {card.currentBill.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-xs text-on-surface-variant">Vencimento</span>
                    <p className="font-mono text-sm font-bold text-secondary">
                      Dia {card.dueDay} (Fecha dia {card.closingDay})
                    </p>
                  </div>
                </div>

                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${Math.min(100, (card.currentBill / card.creditLimit) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center font-mono text-xs text-on-surface-variant">
                  <span>Limite Usado: {Math.round((card.currentBill / card.creditLimit) * 100)}%</span>
                  <span>Limite Total: R$ {card.creditLimit.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Expenses Table */}
      {activeTab !== 'cards' && (
        <div className="bg-surface-container rounded-card border border-outline-variant overflow-hidden">
          <div className="p-4 bg-surface-container-low border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-3">
            <h3 className="font-sans text-base font-bold text-on-surface">
              {activeTab === 'fixed' ? 'Tabela de Gastos Fixos' : 'Tabela de Gastos Variáveis'}
            </h3>
            
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-on-surface-variant">Filtrar por Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-container border border-outline-variant rounded px-2 py-1 text-xs font-mono text-on-surface"
              >
                <option value="all">Todos os Status</option>
                <option value="paid">Liquidados</option>
                <option value="pending">Pendentes</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant uppercase border-b border-outline-variant">
                <tr>
                  <th className="p-4 w-12 text-center">Status</th>
                  <th className="p-4">Descrição / Categoria</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Divisão (Split)</th>
                  <th className="p-4">Método</th>
                  <th className="p-4">Vencimento / Data</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {transactions.length > 0 ? (
                  transactions.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-surface-container-high/40 transition-all">
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={tx.status === 'paid'}
                          onChange={(e) =>
                            toggleStatusMutation.mutate({
                              id: tx.id,
                              status: e.target.checked ? 'paid' : 'pending'
                            })
                          }
                          className="accent-primary rounded cursor-pointer w-4 h-4"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary p-1.5 bg-surface-container-low rounded">
                            {tx.category?.icon || 'receipt'}
                          </span>
                          <div>
                            <p className="font-sans text-sm font-semibold text-on-surface">{tx.description}</p>
                            <span className="text-on-surface-variant text-[11px]">{tx.category?.name || 'Geral'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-on-surface">
                        R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-surface-container-low rounded border border-outline-variant font-bold text-primary">
                          {tx.splitRatioA}% Eu / {tx.splitRatioB}% Ela
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        {tx.paymentMethod || 'Pix'}
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        {new Date(tx.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteMutation.mutate(tx.id)}
                          className="text-on-surface-variant hover:text-error transition-all p-1"
                          title="Excluir"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-on-surface-variant font-mono">
                      Nenhuma conta cadastrada para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center text-xs font-mono text-on-surface-variant">
            <span>Mostrando {transactions.length} de {transactions.length} itens</span>
            <div className="flex items-center gap-2">
              <button disabled className="px-3 py-1 rounded bg-surface-container border border-outline-variant opacity-50">Anterior</button>
              <button disabled className="px-3 py-1 rounded bg-surface-container border border-outline-variant opacity-50">Próximo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
