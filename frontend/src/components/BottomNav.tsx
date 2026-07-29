import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const BottomNav: React.FC = () => {
  const { openAddTransaction } = useAppStore();

  const navItems = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Gastos', path: '/expenses', icon: 'receipt_long' },
    { label: 'Metas', path: '/goals', icon: 'target' },
    { label: 'Patrimônio', path: '/wealth', icon: 'account_balance_wallet' },
    { label: 'Tendências', path: '/trends', icon: 'query_stats' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface-container/95 backdrop-blur-xl border-t border-outline-variant px-2 py-2 flex justify-around items-center">
      {navItems.slice(0, 2).map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs px-2 py-1 ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}

      {/* Floating Add Transaction Button in Mobile Nav */}
      <button
        onClick={openAddTransaction}
        className="bg-primary text-on-primary-container p-3 rounded-full shadow-lg -mt-5 hover:scale-105 active:scale-95 transition-all"
        title="Nova Transação"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>

      {navItems.slice(2).map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs px-2 py-1 ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};
