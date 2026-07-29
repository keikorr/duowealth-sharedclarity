import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const SettingsPage: React.FC = () => {
  const { user, household, logout, openSupport, addToast } = useAppStore();

  return (
    <div className="space-y-stack-lg pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-on-surface mb-1">
          Configurações do Casal
        </h1>
        <p className="text-on-surface-variant text-sm font-sans">
          Gerencie os perfis compartilhados, preferências de notificação e vínculo do household.
        </p>
      </div>

      {/* Household Section */}
      <div className="bg-surface-container p-6 rounded-card border border-outline-variant space-y-4">
        <h2 className="font-sans text-lg font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">family_history</span>
          Perfil do Casal (Household)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">Nome da Conta Conjunta</label>
            <input
              type="text"
              value={household?.name || 'Our Wealth'}
              readOnly
              className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 font-mono text-sm text-primary font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">Código de Vínculo de Parceiro</label>
            <div className="flex gap-2">
              <input
                type="text"
                value="DUO-8849-CLARITY"
                readOnly
                className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 font-mono text-xs text-on-surface"
              />
              <button
                onClick={() => addToast('Código copiado para a área de transferência!', 'info')}
                className="px-3 py-2 bg-surface-container-high hover:bg-primary hover:text-on-primary-container rounded-card text-xs font-mono font-bold transition-all"
              >
                Copiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Partners List */}
      <div className="bg-surface-container p-6 rounded-card border border-outline-variant space-y-4">
        <h2 className="font-sans text-lg font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">group</span>
          Membros Conectados
        </h2>

        <div className="divide-y divide-outline-variant/40 space-y-3">
          {/* Partner 1 (Eu) */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                className="w-10 h-10 rounded-full border border-primary object-cover"
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
                alt="Marcos"
              />
              <div>
                <p className="font-sans text-sm font-bold text-on-surface">{user?.name || 'Marcos Silva'} (Você)</p>
                <span className="font-mono text-xs text-on-surface-variant">{user?.email || 'marcos@duowealth.app'}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/30 rounded font-mono text-xs font-bold">
              ADMINISTRADOR
            </span>
          </div>

          {/* Partner 2 (Ana) */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                className="w-10 h-10 rounded-full border border-secondary object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
                alt="Ana"
              />
              <div>
                <p className="font-sans text-sm font-bold text-on-surface">Ana Costa (Parceira)</p>
                <span className="font-mono text-xs text-on-surface-variant">ana@duowealth.app</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-secondary/10 text-secondary border border-secondary/30 rounded font-mono text-xs font-bold">
              CONECTADO
            </span>
          </div>
        </div>
      </div>

      {/* Preferences & Actions */}
      <div className="bg-surface-container p-6 rounded-card border border-outline-variant space-y-4">
        <h2 className="font-sans text-lg font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">tune</span>
          Preferências Globais
        </h2>

        <div className="space-y-3 font-mono text-xs text-on-surface">
          <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-card border border-outline-variant">
            <span>Notificações de Contas a Vencer por E-mail</span>
            <input type="checkbox" defaultChecked className="accent-primary w-4 h-4 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-card border border-outline-variant">
            <span>Alerta de Gastos Acima do Orçado</span>
            <input type="checkbox" defaultChecked className="accent-primary w-4 h-4 cursor-pointer" />
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center border-t border-outline-variant">
          <button
            onClick={openSupport}
            className="text-xs font-mono text-secondary font-bold hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">help</span>
            <span>Central de Ajuda & Suporte</span>
          </button>

          <button
            onClick={() => {
              logout();
              addToast('Você saiu da conta.', 'info');
            }}
            className="bg-error-container text-on-error hover:brightness-110 font-bold px-4 py-2 rounded-card text-xs font-mono flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
