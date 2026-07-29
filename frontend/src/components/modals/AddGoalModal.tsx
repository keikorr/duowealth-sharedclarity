import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useAppStore } from '../../store/useAppStore';

export const AddGoalModal: React.FC = () => {
  const { isAddGoalOpen, closeAddGoal, addToast } = useAppStore();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Viagem');
  const [icon, setIcon] = useState('flight_takeoff');

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/goals', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      addToast('Nova meta criada com sucesso!', 'success');
      closeAddGoal();
      setTitle('');
      setTargetAmount('');
    },
    onError: (err: any) => {
      addToast(err.response?.data?.error || 'Erro ao criar meta', 'error');
    }
  });

  if (!isAddGoalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount || !deadline) {
      addToast('Preencha os campos obrigatórios.', 'error');
      return;
    }

    mutation.mutate({
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || '0'),
      deadline,
      category,
      icon
    });
  };

  const icons = [
    { label: 'Viagem', icon: 'flight_takeoff' },
    { label: 'Casa / Imóvel', icon: 'real_estate_agent' },
    { label: 'Carro', icon: 'directions_car' },
    { label: 'Reserva', icon: 'shield_with_heart' },
    { label: 'Casamento', icon: 'favorite' },
    { label: 'Estudos', icon: 'school' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-surface-container border border-outline-variant rounded-card w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">target</span>
            Nova Meta do Casal
          </h2>
          <button onClick={closeAddGoal} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">Título da Meta</label>
            <input
              type="text"
              placeholder="Ex: Viagem Japão, Entrada do Apê"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm text-on-surface"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">Ícone / Categoria</label>
            <div className="grid grid-cols-3 gap-2">
              {icons.map((item) => (
                <button
                  key={item.icon}
                  type="button"
                  onClick={() => {
                    setIcon(item.icon);
                    setCategory(item.label);
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-card border text-xs font-mono ${
                    icon === item.icon
                      ? 'border-primary bg-primary/20 text-primary font-bold'
                      : 'border-outline-variant text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Valor Alvo (R$)</label>
              <input
                type="number"
                step="100"
                placeholder="45000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-primary font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1">Já Poupado (R$)</label>
              <input
                type="number"
                step="100"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">Prazo / Data Limite</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm text-on-surface"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={closeAddGoal}
              className="px-4 py-2 text-sm font-mono text-on-surface-variant hover:text-on-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary text-on-primary-container font-bold px-5 py-2 rounded-card hover:brightness-110 active:scale-95 transition-all"
            >
              {mutation.isPending ? 'Criando...' : 'Criar Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
