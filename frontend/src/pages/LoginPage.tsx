import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, addToast } = useAppStore();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('marcos@duowealth.app');
  const [password, setPassword] = useState('senha123');
  const [name, setName] = useState('');
  const [householdName, setHouseholdName] = useState('Our Wealth');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const res = await api.post('/auth/register', {
          name,
          email,
          password,
          householdName
        });
        setAuth(res.data.token, res.data.user, { id: res.data.householdId, name: householdName });
        addToast('Conta de casal criada com sucesso!', 'success');
      } else {
        const res = await api.post('/auth/login', {
          email,
          password
        });
        setAuth(res.data.token, res.data.user, res.data.household);
        addToast('Bem-vindo de volta ao SharedClarity!', 'success');
      }
      navigate('/');
    } catch (err: any) {
      addToast(err.response?.data?.error || 'Erro na autenticação. Verifique os dados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background selection:bg-primary/30">
      <div className="bg-surface-container border border-outline-variant rounded-card w-full max-w-md p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-sans text-3xl font-bold text-primary tracking-tight">SharedClarity</h1>
          <p className="font-mono text-xs text-on-surface-variant">DuoWealth Hub Financeiro para Casais</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1">Seu Nome Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Marcos Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm text-on-surface"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1">Nome do Casal (Household)</label>
                <input
                  type="text"
                  placeholder="Ex: Our Wealth"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-primary font-bold"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-on-surface"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-card p-3 text-sm font-mono text-on-surface"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary-container font-bold py-3 rounded-card hover:brightness-110 active:scale-95 transition-all text-sm font-mono shadow-md"
          >
            {loading ? 'Acessando...' : isRegister ? 'Criar Conta Conjunta' : 'Entrar no Hub'}
          </button>
        </form>

        <div className="pt-4 border-t border-outline-variant text-center space-y-2">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-mono text-secondary hover:underline"
          >
            {isRegister ? 'Já possui conta? Faça Login' : 'Criar nova conta de casal'}
          </button>

          <p className="text-[11px] font-mono text-on-surface-variant/80">
            Dica Demo: Entre com <strong className="text-primary">marcos@duowealth.app</strong> / <strong className="text-primary">senha123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
