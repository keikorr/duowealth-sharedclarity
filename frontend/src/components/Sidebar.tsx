import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const Sidebar: React.FC = () => {
  const { openAddTransaction, openSupport, user, household } = useAppStore();

  const navItems = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Expenses', path: '/expenses', icon: 'receipt_long' },
    { label: 'Goals', path: '/goals', icon: 'target' },
    { label: 'Wallet', path: '/wealth', icon: 'account_balance_wallet' },
    { label: 'Trends', path: '/trends', icon: 'query_stats' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full hidden md:flex flex-col p-4 w-64 bg-surface-container-low border-r border-outline-variant z-50">
      <div className="flex flex-col mb-stack-lg">
        {/* Couple / Household Selector */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex -space-x-2">
            <img
              className="w-10 h-10 rounded-full border-2 border-surface-container-low object-cover"
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
              alt="Marcos"
            />
            <img
              className="w-10 h-10 rounded-full border-2 border-surface-container-low object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
              alt="Ana"
            />
          </div>
          <div>
            <h2 className="font-sans text-lg font-bold text-primary">{household?.name || 'Our Wealth'}</h2>
            <p className="font-mono text-xs text-on-surface-variant">Shared Clarity</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-card transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-secondary-container/20 border-r-4 border-primary font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-mono text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-1">
        <button
          onClick={openAddTransaction}
          className="bg-primary text-on-primary-container font-bold py-3 px-4 rounded-card flex items-center justify-center gap-2 mb-4 hover:brightness-110 active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Add Transaction</span>
        </button>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-card text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-all ${
              isActive ? 'text-primary font-semibold' : ''
            }`
          }
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-mono text-sm">Settings</span>
        </NavLink>

        <button
          onClick={openSupport}
          className="flex items-center gap-3 px-4 py-2 rounded-card text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-all text-left w-full"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="font-mono text-sm">Support</span>
        </button>
      </div>
    </aside>
  );
};
