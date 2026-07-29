import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useAppStore } from '../../store/useAppStore';

export const AddInvestmentModal: React.FC = () => {
  const { isAddInvestmentOpen, closeAddInvestment, addToast } = useAppStore();
  const queryClient = useQueryClient();

  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'fixed_income' | 'stocks' | 'crypto' | 'reits'>('stocks');
  const [quantity, setQuantity] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/investments', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      addToast('Novo ativo adicionado à carteira!', 'success');
      closeAddInvestment();
      setTicker('');
      setName('');
      setQuantity('');
    },
    onError: (err: any) => {
      addToast(err.response?.data?.error || 'Erro ao adicionar ativo', 'error');
    }
  });

  if (!isAddInvestmentOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !name || !quantity || !currentPrice) {
      addToast('Preencha os campos obrigatórios.', 'error');
      return;
    }

    mutation.mutate({
      ticker,
      name,
      category,
      quantity: parseFloat(quantity),
      avgPrice: parseFloat(avgPrice || currentPrice),
      currentPrice: parseFloat(currentPrice),
      monthlyReturnFloat: 1.2
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-surface-container border border-outline-variant rounded-card w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">add_chart</span>
            Novo Ativo de Investimento
          </h2>
          <button onClick={closeAddInvestment} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Ticker / Código</label>
              <input
                type="text"
                placeholder="Ex: ITUB4, BTC"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-primary font-bold uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Classe de Ativo</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm text-on-surface"
              >
                <option value="fixed_income">Renda Fixa</option>
                <option value="stocks">Ações</option>
                <option value="reits">FIIs (Fundos)</option>
                <option value="crypto">Cripto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">Nome Completo do Ativo</label>
            <input
              type="text"
              placeholder="Ex: Itaú Unibanco PN, Tesouro Selic 2029"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm text-on-surface"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Quantidade</label>
              <input
                type="number"
                step="any"
                placeholder="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-on-surface"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Preço Médio</label>
              <input
                type="number"
                step="0.01"
                placeholder="28,50"
                value={avgPrice}
                onChange={(e) => setAvgPrice(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-on-surface"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Preço Atual</label>
              <input
                type="number"
                step="0.01"
                placeholder="34,80"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-primary font-bold"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={closeAddInvestment}
              className="px-4 py-2 text-sm font-mono text-on-surface-variant hover:text-on-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary text-on-primary-container font-bold px-5 py-2 rounded-card hover:brightness-110 active:scale-95 transition-all"
            >
              {mutation.isPending ? 'Salvando...' : 'Salvar Ativo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
