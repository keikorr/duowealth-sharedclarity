import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';
import { api } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export const WealthPage: React.FC = () => {
  const { openAddInvestment, addToast } = useAppStore();
  const queryClient = useQueryClient();

  const [period, setPeriod] = useState<'12m' | '6m' | 'ytd'>('12m');

  const { data, isLoading } = useQuery({
    queryKey: ['investments', period],
    queryFn: async () => {
      const res = await api.get(`/investments?period=${period}`);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/investments/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      addToast('Ativo removido da carteira.', 'info');
    }
  });

  const summary = data?.summary || { totalInvested: 215250, totalReturnPercentage: 15.8, accumulatedGain: 29400 };
  const distribution = data?.distribution || [];
  const performanceCurve = data?.performanceCurve || [];
  const assets = data?.assets || [];

  const categoryColors: Record<string, string> = {
    fixed_income: '#4edea3',
    stocks: '#adc6ff',
    reits: '#d0bcff',
    crypto: '#ffb4ab'
  };

  return (
    <div className="space-y-stack-lg pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-on-surface mb-1">
            Investimentos e Patrimônio
          </h1>
          <p className="text-on-surface-variant text-sm font-sans">
            Visão consolidada da carteira conjunta: Renda Fixa, Ações, FIIs e Cripto.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddInvestment}
            className="bg-primary text-on-primary-container font-bold px-4 py-2 rounded-card flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>+ Novo Ativo</span>
          </button>
        </div>
      </div>

      {/* KPI Total Investido Banner */}
      <div className="bg-surface-container p-6 rounded-card border border-outline-variant card-active grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
            Total Investido do Casal
          </span>
          <h2 className="font-mono text-3xl font-bold text-on-surface mt-1">
            R$ {summary.totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <span className="font-mono text-xs text-primary font-bold flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+{summary.totalReturnPercentage}% de retorno acumulado</span>
          </span>
        </div>

        <div>
          <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
            Lucro / Ganho Acumulado
          </span>
          <h3 className="font-mono text-2xl font-bold text-primary mt-1">
            +R$ {summary.accumulatedGain.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <span className="font-mono text-xs text-on-surface-variant">Lucro não realizado</span>
        </div>

        <div>
          <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
            Rentabilidade Média Mensal
          </span>
          <h3 className="font-mono text-2xl font-bold text-secondary mt-1">1.25% a.m.</h3>
          <span className="font-mono text-xs text-secondary font-semibold">Acima do Benchmark (CDI)</span>
        </div>
      </div>

      {/* Charts Row: Donut Asset Distribution + Line Chart Wealth Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        {/* Donut Chart Asset Classes */}
        <div className="lg:col-span-5 bg-surface-container p-6 rounded-card border border-outline-variant flex flex-col justify-between">
          <h2 className="font-sans text-lg font-bold text-on-surface mb-4">Distribuição por Classe</h2>

          <div className="relative h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distribution.map((entry: any, idx: number) => (
                    <Cell key={`cell-${idx}`} fill={categoryColors[entry.category] || '#4edea3'} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-surface-container-high p-3 rounded-card border border-outline-variant shadow-lg text-xs font-mono">
                          <p className="font-bold text-on-surface">{data.label}</p>
                          <p className="text-primary font-bold">R$ {data.value.toLocaleString('pt-BR')}</p>
                          <p className="text-on-surface-variant">{data.percentage}% da carteira</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-outline-variant">
            {distribution.map((item: any) => (
              <div key={item.category} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: categoryColors[item.category] || '#4edea3' }}></div>
                  <span className="text-on-surface-variant">{item.label}</span>
                </div>
                <span className="font-bold text-on-surface">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart Wealth Evolution */}
        <div className="lg:col-span-7 bg-surface-container p-6 rounded-card border border-outline-variant flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-sans text-lg font-bold text-on-surface">Evolução Patrimonial</h2>
            <div className="flex bg-surface-container-low p-1 rounded-card border border-outline-variant font-mono text-xs">
              <button
                onClick={() => setPeriod('12m')}
                className={`px-3 py-1 rounded-card ${period === '12m' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'}`}
              >
                12M
              </button>
              <button
                onClick={() => setPeriod('6m')}
                className={`px-3 py-1 rounded-card ${period === '6m' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'}`}
              >
                6M
              </button>
              <button
                onClick={() => setPeriod('ytd')}
                className={`px-3 py-1 rounded-card ${period === 'ytd' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'}`}
              >
                YTD
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceCurve}>
                <XAxis dataKey="month" stroke="#86948a" fontSize={12} tickLine={false} />
                <YAxis stroke="#86948a" fontSize={12} tickLine={false} />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-surface-container-high p-3 rounded-card border border-outline-variant shadow-lg text-xs font-mono">
                          <p className="font-bold text-on-surface">{data.month}</p>
                          <p className="text-primary font-bold">R$ {data.value.toLocaleString('pt-BR')}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#4edea3" strokeWidth={3} dot={{ fill: '#4edea3', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ativos em Carteira Table */}
      <div className="bg-surface-container rounded-card border border-outline-variant overflow-hidden">
        <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-sans text-base font-bold text-on-surface">Ativos em Carteira</h3>
          <span className="font-mono text-xs text-on-surface-variant">{assets.length} ativos cadastrados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase border-b border-outline-variant">
              <tr>
                <th className="p-4">Ativo / Ticker</th>
                <th className="p-4">Classe</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4">Preço Médio</th>
                <th className="p-4">Preço Atual</th>
                <th className="p-4">Retorno (Gain/Loss)</th>
                <th className="p-4">Valor Total</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {assets.map((asset: any) => (
                <tr key={asset.id} className="hover:bg-surface-container-high/40 transition-all">
                  <td className="p-4">
                    <div>
                      <span className="font-bold text-primary text-sm">{asset.ticker}</span>
                      <p className="font-sans text-xs text-on-surface-variant">{asset.name}</p>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface-variant uppercase">
                    {asset.category.replace('_', ' ')}
                  </td>
                  <td className="p-4 text-on-surface">{asset.quantity}</td>
                  <td className="p-4 text-on-surface-variant">R$ {asset.avgPrice.toLocaleString('pt-BR')}</td>
                  <td className="p-4 font-bold text-on-surface">R$ {asset.currentPrice.toLocaleString('pt-BR')}</td>
                  <td className="p-4">
                    <span className={`font-bold ${asset.gainLossPercentage >= 0 ? 'text-primary' : 'text-error'}`}>
                      {asset.gainLossPercentage >= 0 ? '+' : ''}{asset.gainLossPercentage}%
                    </span>
                  </td>
                  <td className="p-4 font-bold text-on-surface">
                    R$ {asset.currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteMutation.mutate(asset.id)}
                      className="text-on-surface-variant hover:text-error transition-all p-1"
                      title="Remover ativo"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
