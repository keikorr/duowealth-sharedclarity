import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export const GoalsPage: React.FC = () => {
  const { openAddGoal, openContribution, addToast } = useAppStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const res = await api.get('/goals');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/goals/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      addToast('Meta removida.', 'info');
    }
  });

  const summary = data?.summary || { totalSaved: 0, totalTarget: 0, percentage: 0, monthlyGrowthPercentage: 8.5 };
  const goals = data?.goals || [];

  return (
    <div className="space-y-stack-lg pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-on-surface mb-1">
            Metas e Sonhos Compartilhados
          </h1>
          <p className="text-on-surface-variant text-sm font-sans">
            Planejem e conquistem seus objetivos juntos: viagens, imóvel, reserva e independência.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddGoal}
            className="bg-primary text-on-primary-container font-bold px-4 py-2 rounded-card flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Nova Meta</span>
          </button>
        </div>
      </div>

      {/* Total em Metas KPI Banner */}
      <div className="bg-surface-container p-6 rounded-card border border-outline-variant card-active flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
            Total Poupado em Metas Conjuntas
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="font-mono text-3xl font-bold text-primary">
              R$ {summary.totalSaved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
            <span className="font-mono text-xs text-on-surface-variant">
              de R$ {summary.totalTarget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({summary.percentage}%)
            </span>
          </div>
          <p className="font-mono text-xs text-secondary mt-1 flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+{summary.monthlyGrowthPercentage}% de evolução no mês</span>
          </p>
        </div>

        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-on-surface-variant">Progresso Geral</span>
            <span className="text-primary font-bold">{summary.percentage}%</span>
          </div>
          <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-secondary to-primary h-full transition-all duration-500"
              style={{ width: `${summary.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Dica de Investimento Contextual Block */}
      <div className="bg-secondary-container/15 border border-secondary/30 p-5 rounded-card flex items-start gap-4">
        <span className="material-symbols-outlined text-secondary text-2xl">lightbulb</span>
        <div className="space-y-1">
          <h3 className="font-sans text-sm font-bold text-secondary">Dica de Investimento Inteligente</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Para metas de médio prazo como <strong className="text-on-surface">"Viagem Japão" (Maio/2025)</strong>, alocar os aportes em <strong className="text-primary">Tesouro Selic ou CDBs 100% CDI</strong> garante liquidez e rentabilidade isenta de volatilidade até o embarque.
          </p>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
        {goals.map((goal: any) => (
          <div
            key={goal.id}
            className="bg-surface-container p-6 rounded-card border border-outline-variant hover:border-primary/50 transition-all flex flex-col justify-between space-y-4 relative"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-surface-container-low rounded-card text-primary border border-outline-variant">
                  <span className="material-symbols-outlined text-2xl">{goal.icon || 'target'}</span>
                </div>
                <div>
                  <h3 className="font-sans text-lg font-bold text-on-surface">{goal.title}</h3>
                  <span className="font-mono text-xs text-on-surface-variant">
                    Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')} • {goal.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteMutation.mutate(goal.id)}
                className="text-on-surface-variant hover:text-error p-1 transition-all"
                title="Excluir meta"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>

            {/* Progress Bar & Amount Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-on-surface font-bold">R$ {goal.currentAmount.toLocaleString('pt-BR')}</span>
                <span className="text-primary font-bold">{goal.progressPercentage}%</span>
              </div>
              <div className="w-full bg-surface-container-low h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-secondary to-primary h-full transition-all duration-500"
                  style={{ width: `${goal.progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between font-mono text-xs text-on-surface-variant pt-1">
                <span>Faltam: R$ {goal.remainingAmount.toLocaleString('pt-BR')}</span>
                <span>Alvo: R$ {goal.targetAmount.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            {/* Contributions History Snippet */}
            {goal.contributions && goal.contributions.length > 0 && (
              <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between text-xs font-mono text-on-surface-variant">
                <span>Último aporte por {goal.contributions[0]?.user?.name || 'Parceiro'}</span>
                <span className="text-primary font-bold">+R$ {goal.contributions[0]?.amount}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={() => openContribution(goal.id)}
              className="w-full bg-surface-container-high hover:bg-primary hover:text-on-primary-container text-primary border border-primary/40 font-bold py-2.5 px-4 rounded-card flex items-center justify-center gap-2 transition-all font-mono text-xs"
            >
              <span className="material-symbols-outlined text-sm">payments</span>
              <span>Fazer Aporte</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
