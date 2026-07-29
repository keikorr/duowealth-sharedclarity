import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useAppStore } from '../../store/useAppStore';

export const AddTransactionModal: React.FC = () => {
  const { isAddTransactionOpen, closeAddTransaction, selectedMonth, addToast } = useAppStore();
  const queryClient = useQueryClient();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'fixed' | 'variable' | 'income'>('variable');
  const [categoryId, setCategoryId] = useState('');
  const [cardId, setCardId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [paidByRole, setPaidByRole] = useState<'userA' | 'userB' | 'joint'>('joint');
  const [splitRatioA, setSplitRatioA] = useState(50);
  const [splitRatioB, setSplitRatioB] = useState(50);

  // Fetch cards for card selector
  const { data: cards } = useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const res = await api.get('/cards');
      return res.data;
    },
    enabled: isAddTransactionOpen
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/transactions', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      addToast('Transação adicionada com sucesso!', 'success');
      closeAddTransaction();
      // Reset form
      setDescription('');
      setAmount('');
    },
    onError: (err: any) => {
      addToast(err.response?.data?.error || 'Erro ao adicionar transação', 'error');
    }
  });

  if (!isAddTransactionOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || parseFloat(amount) <= 0) {
      addToast('Preencha a descrição e um valor válido.', 'error');
      return;
    }

    mutation.mutate({
      description,
      amount: parseFloat(amount),
      type,
      categoryId: categoryId || 'cat-outros',
      cardId: cardId || null,
      monthRef: selectedMonth,
      paidByRole,
      splitRatioA,
      splitRatioB,
      paymentMethod,
      status: 'paid'
    });
  };

  const handleSplitPreset = (preset: '50/50' | '100/0' | '0/100' | '70/30') => {
    if (preset === '50/50') {
      setSplitRatioA(50);
      setSplitRatioB(50);
    } else if (preset === '100/0') {
      setSplitRatioA(100);
      setSplitRatioB(0);
    } else if (preset === '0/100') {
      setSplitRatioA(0);
      setSplitRatioB(100);
    } else if (preset === '70/30') {
      setSplitRatioA(70);
      setSplitRatioB(30);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-surface-container border border-outline-variant rounded-card w-full max-w-lg p-6 shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">add_circle</span>
            Nova Transação Compartilhada
          </h2>
          <button onClick={closeAddTransaction} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo toggle */}
          <div className="flex bg-surface-container-low p-1 rounded-card border border-outline-variant">
            <button
              type="button"
              onClick={() => setType('variable')}
              className={`flex-1 py-2 text-xs font-mono rounded-card font-semibold transition-all ${
                type === 'variable' ? 'bg-surface-container-high text-white shadow' : 'text-on-surface-variant'
              }`}
            >
              Gasto Variável
            </button>
            <button
              type="button"
              onClick={() => setType('fixed')}
              className={`flex-1 py-2 text-xs font-mono rounded-card font-semibold transition-all ${
                type === 'fixed' ? 'bg-surface-container-high text-white shadow' : 'text-on-surface-variant'
              }`}
            >
              Gasto Fixo
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-xs font-mono rounded-card font-semibold transition-all ${
                type === 'income' ? 'bg-primary text-on-primary font-bold shadow' : 'text-on-surface-variant'
              }`}
            >
              Receita
            </button>
          </div>

          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">Descrição / Local</label>
            <input
              type="text"
              placeholder="Ex: Supermercado Pão de Açúcar, Aluguel"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm text-on-surface"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-primary font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Método de Pagamento</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm text-on-surface"
              >
                <option value="Pix">Pix / Dinheiro</option>
                <option value="CreditCard">Cartão de Crédito</option>
                <option value="Boleto">Boleto</option>
              </select>
            </div>
          </div>

          {paymentMethod === 'CreditCard' && cards && cards.length > 0 && (
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Selecione o Cartão</label>
              <select
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm text-on-surface"
              >
                <option value="">Selecione um cartão...</option>
                {cards.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.bank}) - Vence dia {c.dueDay}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quem Pagou */}
          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">Quem Pagou?</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaidByRole('userA')}
                className={`py-2 px-3 text-xs font-mono rounded-card border ${
                  paidByRole === 'userA'
                    ? 'border-primary bg-primary/10 text-primary font-bold'
                    : 'border-outline-variant text-on-surface-variant'
                }`}
              >
                Marcos (Eu)
              </button>
              <button
                type="button"
                onClick={() => setPaidByRole('userB')}
                className={`py-2 px-3 text-xs font-mono rounded-card border ${
                  paidByRole === 'userB'
                    ? 'border-secondary bg-secondary/10 text-secondary font-bold'
                    : 'border-outline-variant text-on-surface-variant'
                }`}
              >
                Ana (Ela)
              </button>
              <button
                type="button"
                onClick={() => setPaidByRole('joint')}
                className={`py-2 px-3 text-xs font-mono rounded-card border ${
                  paidByRole === 'joint'
                    ? 'border-tertiary bg-tertiary/10 text-tertiary font-bold'
                    : 'border-outline-variant text-on-surface-variant'
                }`}
              >
                Conta Conjunta
              </button>
            </div>
          </div>

          {/* Presets de Divisão (Split) */}
          <div className="bg-surface-container-low p-4 rounded-card border border-outline-variant space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-on-surface-variant">Divisão de Gastos (Split)</label>
              <span className="font-mono text-xs text-primary font-bold">
                {splitRatioA}% Marcos / {splitRatioB}% Ana
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSplitPreset('50/50')}
                className={`py-1 px-2 text-xs font-mono rounded border ${
                  splitRatioA === 50 && splitRatioB === 50 ? 'bg-primary/20 border-primary text-primary font-bold' : 'border-outline-variant text-on-surface-variant'
                }`}
              >
                50 / 50
              </button>
              <button
                type="button"
                onClick={() => handleSplitPreset('70/30')}
                className={`py-1 px-2 text-xs font-mono rounded border ${
                  splitRatioA === 70 ? 'bg-primary/20 border-primary text-primary font-bold' : 'border-outline-variant text-on-surface-variant'
                }`}
              >
                70 / 30
              </button>
              <button
                type="button"
                onClick={() => handleSplitPreset('100/0')}
                className={`py-1 px-2 text-xs font-mono rounded border ${
                  splitRatioA === 100 ? 'bg-primary/20 border-primary text-primary font-bold' : 'border-outline-variant text-on-surface-variant'
                }`}
              >
                100% Eu
              </button>
              <button
                type="button"
                onClick={() => handleSplitPreset('0/100')}
                className={`py-1 px-2 text-xs font-mono rounded border ${
                  splitRatioB === 100 ? 'bg-primary/20 border-primary text-primary font-bold' : 'border-outline-variant text-on-surface-variant'
                }`}
              >
                100% Ela
              </button>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={splitRatioA}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSplitRatioA(val);
                setSplitRatioB(100 - val);
              }}
              className="w-full accent-primary bg-surface-container"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={closeAddTransaction}
              className="px-4 py-2 text-sm font-mono text-on-surface-variant hover:text-on-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary text-on-primary-container font-bold px-5 py-2 rounded-card hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              {mutation.isPending ? 'Salvando...' : 'Salvar Transação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
