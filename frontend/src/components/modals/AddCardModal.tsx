import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useAppStore } from '../../store/useAppStore';

export const AddCardModal: React.FC = () => {
  const { isAddCardOpen, closeAddCard, addToast } = useAppStore();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [bank, setBank] = useState('');
  const [lastFour, setLastFour] = useState('');
  const [closingDay, setClosingDay] = useState(3);
  const [dueDay, setDueDay] = useState(10);
  const [creditLimit, setCreditLimit] = useState('');

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/cards', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      addToast('Novo cartão adicionado!', 'success');
      closeAddCard();
      setName('');
      setBank('');
      setCreditLimit('');
    },
    onError: (err: any) => {
      addToast(err.response?.data?.error || 'Erro ao adicionar cartão', 'error');
    }
  });

  if (!isAddCardOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !bank || !creditLimit) {
      addToast('Preencha os campos obrigatórios.', 'error');
      return;
    }

    mutation.mutate({
      name,
      bank,
      lastFour: lastFour || '0000',
      closingDay: Number(closingDay),
      dueDay: Number(dueDay),
      creditLimit: parseFloat(creditLimit),
      currentBill: 0,
      isPaid: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-surface-container border border-outline-variant rounded-card w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">credit_card</span>
            Adicionar Cartão de Crédito
          </h2>
          <button onClick={closeAddCard} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">Nome do Cartão</label>
            <input
              type="text"
              placeholder="Ex: Nubank Violeta, Inter Black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm text-on-surface"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Banco Emissor</label>
              <input
                type="text"
                placeholder="Ex: Itaú, Nubank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm text-on-surface"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Últimos 4 Digítos</label>
              <input
                type="text"
                maxLength={4}
                placeholder="8842"
                value={lastFour}
                onChange={(e) => setLastFour(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Fechamento</label>
              <input
                type="number"
                min="1"
                max="31"
                value={closingDay}
                onChange={(e) => setClosingDay(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-on-surface"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Vencimento</label>
              <input
                type="number"
                min="1"
                max="31"
                value={dueDay}
                onChange={(e) => setDueDay(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-on-surface"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Limite Total</label>
              <input
                type="number"
                step="500"
                placeholder="15000"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-primary font-bold"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={closeAddCard}
              className="px-4 py-2 text-sm font-mono text-on-surface-variant hover:text-on-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary text-on-primary-container font-bold px-5 py-2 rounded-card hover:brightness-110 active:scale-95 transition-all"
            >
              {mutation.isPending ? 'Salvando...' : 'Salvar Cartão'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
