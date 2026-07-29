import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export const TrendsPage: React.FC = () => {
  const { addToast } = useAppStore();

  const [monthlyContribution, setMonthlyContribution] = useState<number>(2000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(10);
  const [activeScenario, setActiveScenario] = useState<'A' | 'B'>('A');

  // Simulation mutation
  const simulateMutation = useMutation({
    mutationFn: async (payload: { monthlyContribution: number; expectedReturnRate: number }) => {
      const res = await api.post('/projections/simulate', payload);
      return res.data;
    }
  });

  // Fetch insights
  const { data: insightsData } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const res = await api.get('/insights');
      return res.data;
    }
  });

  const handleOptimize = () => {
    simulateMutation.mutate({ monthlyContribution, expectedReturnRate });
    addToast('Projeção recalculada com novos parâmetros!', 'success');
  };

  const projections = simulateMutation.data?.projections || [
    { label: 'Hoje', expectedValue: 215250, conservativeValue: 215250 },
    { label: '1 Ano', expectedValue: 265000, conservativeValue: 252000 },
    { label: '3 Anos', expectedValue: 382000, conservativeValue: 341000 },
    { label: '5 Anos', expectedValue: 535000, conservativeValue: 450000 },
    { label: '10 Anos', expectedValue: 1120000, conservativeValue: 820000 },
    { label: '15 Anos', expectedValue: 2050000, conservativeValue: 1350000 },
    { label: '20 Anos', expectedValue: 3580000, conservativeValue: 2100000 },
  ];

  const insights = insightsData?.insights || [];
  const goalsTracking = insightsData?.goalsTracking || [];

  return (
    <div className="space-y-stack-lg pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-on-surface mb-1">
            Análise e Projeções Futuras
          </h1>
          <p className="text-on-surface-variant text-sm font-sans">
            Simulações de liberdade financeira, análise de cenários e insights inteligentes.
          </p>
        </div>

        {/* Cenário A / Cenário B Selector */}
        <div className="flex bg-surface-container-low p-1.5 rounded-card border border-outline-variant font-mono text-xs">
          <button
            onClick={() => {
              setActiveScenario('A');
              setMonthlyContribution(2000);
              setExpectedReturnRate(10);
            }}
            className={`px-4 py-1.5 rounded-card font-bold transition-all ${
              activeScenario === 'A' ? 'bg-primary text-on-primary-container shadow' : 'text-on-surface-variant'
            }`}
          >
            Cenário A (Atual)
          </button>
          <button
            onClick={() => {
              setActiveScenario('B');
              setMonthlyContribution(3500);
              setExpectedReturnRate(12);
            }}
            className={`px-4 py-1.5 rounded-card font-bold transition-all ${
              activeScenario === 'B' ? 'bg-secondary text-on-secondary shadow' : 'text-on-surface-variant'
            }`}
          >
            Cenário B (Acelerado)
          </button>
        </div>
      </div>

      {/* Main Grid: Projection Chart + Interactive Simulator Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        {/* Dual Curve Projection Chart */}
        <div className="lg:col-span-8 bg-surface-container p-6 rounded-card border border-outline-variant flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-sans text-lg font-bold text-on-surface">Evolução de Patrimônio Projetada</h2>
              <span className="font-mono text-xs text-on-surface-variant">Comparativo: Esperado vs Conservador</span>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded font-mono text-xs font-bold">
              Meta 20 Anos: R$ {(projections[projections.length - 1]?.expectedValue || 3580000).toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projections}>
                <XAxis dataKey="label" stroke="#86948a" fontSize={12} tickLine={false} />
                <YAxis stroke="#86948a" fontSize={12} tickLine={false} />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-surface-container-high p-3 rounded-card border border-outline-variant shadow-lg text-xs font-mono">
                          <p className="font-bold text-on-surface">{data.label}</p>
                          <p className="text-primary font-bold">Esperado: R$ {data.expectedValue.toLocaleString('pt-BR')}</p>
                          <p className="text-secondary font-bold">Conservador: R$ {data.conservativeValue.toLocaleString('pt-BR')}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'JetBrains Mono' }} />
                <Line type="monotone" dataKey="expectedValue" name="Cenário Esperado (10% a.a.)" stroke="#4edea3" strokeWidth={3} dot={{ fill: '#4edea3', r: 4 }} />
                <Line type="monotone" dataKey="conservativeValue" name="Cenário Conservador (6% a.a.)" stroke="#adc6ff" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Simulator Sliders Box */}
        <div className="lg:col-span-4 bg-surface-container p-6 rounded-card border border-outline-variant space-y-6">
          <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
            <span className="material-symbols-outlined text-primary text-xl">tune</span>
            <h2 className="font-sans text-lg font-bold text-on-surface">Simulador Interativo</h2>
          </div>

          {/* Slider 1: Aporte Mensal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-on-surface-variant">Aporte Mensal Conjunto</span>
              <span className="text-primary font-bold text-sm">R$ {monthlyContribution.toLocaleString('pt-BR')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="250"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full accent-primary bg-surface-container-low"
            />
            <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
              <span>R$ 0</span>
              <span>R$ 5.000</span>
              <span>R$ 10.000</span>
            </div>
          </div>

          {/* Slider 2: Rentabilidade Estimada */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-on-surface-variant">Rentabilidade Estimada</span>
              <span className="text-secondary font-bold text-sm">{expectedReturnRate}% a.a.</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              step="0.5"
              value={expectedReturnRate}
              onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
              className="w-full accent-secondary bg-surface-container-low"
            />
            <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
              <span>5% (Conservador)</span>
              <span>12% (Moderado)</span>
              <span>20% (Arrojado)</span>
            </div>
          </div>

          <button
            onClick={handleOptimize}
            className="w-full bg-primary text-on-primary-container font-bold py-3 rounded-card flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all text-xs font-mono"
          >
            <span className="material-symbols-outlined text-base">bolt</span>
            <span>Otimizar Cenário</span>
          </button>
        </div>
      </div>

      {/* Cards de Insights / Recomendações Automáticas */}
      <div className="space-y-4">
        <h2 className="font-sans text-xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">auto_awesome</span>
          Insights & Recomendações Automáticas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {insights.map((insight: any) => (
            <div key={insight.id} className="bg-surface-container p-5 rounded-card border border-outline-variant space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface-container-low text-primary rounded border border-outline-variant">
                  <span className="material-symbols-outlined text-xl">{insight.icon}</span>
                </div>
                <h3 className="font-sans text-base font-bold text-on-surface">{insight.title}</h3>
              </div>

              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                {insight.description}
              </p>

              {insight.impactText && (
                <div className="p-2.5 bg-primary/10 border border-primary/30 rounded text-xs font-mono text-primary font-bold">
                  {insight.impactText}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabela Rastreamento de Metas vs. Projeção */}
      <div className="bg-surface-container rounded-card border border-outline-variant overflow-hidden">
        <div className="p-4 bg-surface-container-low border-b border-outline-variant">
          <h3 className="font-sans text-base font-bold text-on-surface">
            Rastreamento de Metas vs. Projeção
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase border-b border-outline-variant">
              <tr>
                <th className="p-4">Meta</th>
                <th className="p-4">Prazo</th>
                <th className="p-4">Progresso Actual</th>
                <th className="p-4">Status Projetado</th>
                <th className="p-4 text-right">Ação Recomendada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {goalsTracking.map((item: any) => (
                <tr key={item.id} className="hover:bg-surface-container-high/40 transition-all">
                  <td className="p-4 font-bold text-on-surface">{item.title}</td>
                  <td className="p-4 text-on-surface-variant">{new Date(item.deadline).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4 text-primary font-bold">{item.progressPercentage}%</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      item.statusProjected === 'No Prazo' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                    }`}>
                      {item.statusProjected}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-secondary">
                    {item.recommendation}
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
