import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useAppStore } from '../../store/useAppStore';

export const GoalContributionModal: React.FC = () => {
  const { isContributionOpen, selectedGoalId, closeContribution, addToast } = useAppStore();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');

  const mutation = useMutation({
    mutationFn: async (payload: { amount: number }) => {
      const res = await api.post(`/goals/${selectedGoalId}/contributions`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      addToast('Aporte realizado com sucesso!', 'success');
      closeContribution();
      setAmount('');
    },
    onError: (err: any) => {
      addToast(err.response?.data?.error || 'Erro ao realizar aporte', 'error');
    }
  });

  if (!isContributionOpen || !selectedGoalId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      addToast('Informe um valor válido de aporte.', 'error');
      return;
    }
    mutation.mutate({ amount: parseFloat(amount) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-surface-container border border-outline-variant rounded-card w-full max-w-sm p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">payments</span>
            Fazer Aporte na Meta
          </h2>
          <button onClick={closeContribution} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">Valor do Aporte (R$)</label>
            <input
              type="number"
              step="50"
              placeholder="Ex: 500,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-base font-mono text-primary font-bold"
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={closeContribution}
              className="px-4 py-2 text-sm font-mono text-on-surface-variant hover:text-on-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary text-on-primary-container font-bold px-5 py-2 rounded-card hover:brightness-110 active:scale-95 transition-all"
            >
              {mutation.isPending ? 'Enviando...' : 'Confirmar Aporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
