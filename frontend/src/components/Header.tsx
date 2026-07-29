import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const Header: React.FC = () => {
  const { user, household, addToast } = useAppStore();

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface-container/80 backdrop-blur-xl border-b border-outline-variant md:hidden">
      <span className="font-sans text-xl font-bold text-primary">SharedClarity</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => addToast('Nenhuma notificação pendente', 'info')}
          className="text-on-surface-variant hover:text-on-surface p-1"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="flex -space-x-2">
          <img
            className="w-8 h-8 rounded-full border border-surface-container-low object-cover"
            src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
            alt="User"
          />
        </div>
      </div>
    </header>
  );
};
