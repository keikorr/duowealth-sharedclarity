import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const SupportModal: React.FC = () => {
  const { isSupportOpen, closeSupport } = useAppStore();

  if (!isSupportOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-surface-container border border-outline-variant rounded-card w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">support_agent</span>
            Suporte DuoWealth
          </h2>
          <button onClick={closeSupport} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-3 text-sm text-on-surface-variant">
          <p className="text-on-surface font-semibold">Precisa de ajuda com o planejamento financeiro do seu casal?</p>
          <div className="p-3 bg-surface-container-low rounded-card border border-outline-variant space-y-2">
            <div className="flex items-center gap-2 text-primary font-mono font-bold">
              <span className="material-symbols-outlined text-base">mail</span>
              suporte@duowealth.app
            </div>
            <div className="flex items-center gap-2 text-secondary font-mono font-bold">
              <span className="material-symbols-outlined text-base">chat</span>
              WhatsApp: +55 (11) 98844-2200
            </div>
          </div>
          <p className="text-xs">Horário de atendimento: Segunda a Sexta, das 09h às 18h.</p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={closeSupport}
            className="bg-surface-container-high text-on-surface font-bold px-5 py-2 rounded-card hover:bg-surface-variant transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
