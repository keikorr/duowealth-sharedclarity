import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import { useAppStore } from '../store/useAppStore';

const queryClient = new QueryClient();

describe('AddTransactionModal Component', () => {
  beforeEach(() => {
    useAppStore.setState({ isAddTransactionOpen: true });
  });

  it('renders modal when isAddTransactionOpen is true', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddTransactionModal />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Nova Transação Compartilhada/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Supermercado Pão de Açúcar/i)).toBeInTheDocument();
  });
});
