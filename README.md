# 💚 DuoWealth (SharedClarity)

> **Hub Financeiro Completo para Casais com Transparência Total**  
> Gerencie contas conjuntas, divisão de gastos proporcional (split 50/50, 70/30, custom), metas compartilhadas, carteira de investimentos e projeções patrimoniais de longo prazo.

---

## 🎨 Design System: "Deep Slate"
O DuoWealth foi desenvolvido seguindo uma estética moderna estilo *Modern Corporate* com **glassmorphic cards**, **dark mode "Deep Slate"** e tipografia otimizada para legibilidade financeira:

- **Background**: `#051424` (Deep Slate)
- **Superfícies**: `#122131`, `#0d1c2d`, `#1c2b3c`
- **Primary Mint Green**: `#4edea3`
- **Secondary Action Blue**: `#adc6ff`
- **Tipografia**: **Inter** (Textos/UI) e **JetBrains Mono** (Valores monetários, porcentagens e IDs)
- **Ícones**: Material Symbols Outlined

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Tokens do design system customizados)
- **React Router v6** (Navegação SPA)
- **TanStack Query (React Query)** (Data-fetching e cache)
- **Zustand** (Estado global de autenticação e modais)
- **Recharts** (Gráficos interativos de Donut, Linhas de Evolução e Barras)

### Backend
- **Node.js** + **Express** (API REST)
- **Prisma ORM** + **PostgreSQL**
- **JWT + Refresh Token** (Autenticação compartilhada por casal/household)
- **Zod** (Validação rigorosa de payloads)
- **Swagger / OpenAPI** (Documentação interativa em `/api-docs`)
- **Vitest** (Testes unitários e de componente)

### DevOps & Deploy
- **Docker & Docker Compose** (Containerização de banco + backend + frontend)
- **Vercel Ready** (Deploy Serverless em 1 clique)

---

## 📱 Funcionalidades & Telas

### 1. 🏠 Dashboard Geral (`/`)
- Saudação personalizada ao casal e resumo da saúde financeira.
- Seletor de mês de referência (ex.: *Março 2024*, *Outubro 2023*).
- **4 KPIs principais**: Saldo Conjunto, Receita Mensal, Despesas Fixas (% pago) e Taxa de Poupança vs Meta.
- **Gráfico Donut**: Gastos por Categoria com total no centro e detalhamento interativo.
- **Transações Recentes**: Indicadores visuais de quem pagou (*Marcos / Ana / Conjunta*) e proporção da divisão (*split*).
- Menu flutuante de ações rápidas.

### 2. 💳 Gestão de Gastos & Cartões (`/expenses`)
- Alternador em *Segmented Control*: **Gastos Fixos / Gastos Variáveis / Cartões**.
- **Orçado vs. Realizado (Budgeted vs. Actual)** em gráfico de barras por categoria.
- **Cartões de Crédito**: Gestão de faturas (Nubank, Inter), dia de fechamento, vencimento e limite.
- **Tabela de Gastos**: Status pago/pendente, divisão de custos (*50/50, 70/30, 100/0*), método de pagamento e ações.
- Modal **"Salvar Gasto"** com presets e slider de divisão customizada.

### 3. 🎯 Metas e Sonhos (`/goals`)
- Banner de resumo total poupado em metas e taxa de evolução mensal.
- Cards por objetivo (*Viagem Japão, Entrada Apartamento, Reserva de Emergência, Carro*).
- Barra de progresso visual, prazo limite e valor restante.
- Modal para realizar **aportes financeiros** diretamente na meta.
- Bloco contextual de dicas de investimento inteligentes.

### 4. 📈 Investimentos e Patrimônio (`/wealth`)
- KPI de Total Investido e rentabilidade acumulada (+15.8%).
- Gráfico Donut de **Distribuição por Classe de Ativo** (*Renda Fixa, Ações, FIIs, Cripto*).
- Gráfico de Linha de **Evolução Patrimonial** com seletor de período (*12M, 6M, YTD*).
- Tabela detalhada de ativos em carteira com preço médio, preço atual, ganho/perda e ações CRUD.

### 5. 🔮 Análise e Projeções Futuras (`/trends`)
- Comparador de **Cenário A vs. Cenário B**.
- Gráfico de **Patrimônio Projetado para 20 Anos** com curvas dupla (*Cenário Esperado vs. Conservador*).
- **Simulador Interativo**: Sliders para ajustar Aporte Mensal (R$ 0 - R$ 10.000) e Rentabilidade Estimada (5% - 20% a.a.).
- Cards de **Insights Automáticos**: Impacto no tempo até a aposentadoria, alertas de delivery acima da média, cobertura da reserva de emergência e otimização fiscal (VGBL).
- Tabela de rastreamento de metas vs. projeção.

### 6. ⚙️ Configurações & Suporte (`/settings`)
- Gestão do casal (*Household*), código de convite do parceiro, membros conectados e preferências de notificação.

---

## ⚡ Rodando Localmente (Quickstart)

### Opção 1: Via Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/keikorr/duowealth-sharedclarity.git
cd duowealth-sharedclarity

# Suba a aplicação inteira (PostgreSQL + Backend + Frontend)
docker-compose up --build
```

Acesse:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001/api`
- **Swagger API Docs**: `http://localhost:3001/api-docs`

---

### Opção 2: Desenvolvendo sem Docker

#### 1. Backend:
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run prisma:seed   # Popula o banco com dados realistas do casal
npm run dev
```

#### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Credenciais de Teste / Demo

O banco vem populado por padrão com uma conta de casal pré-configurada:

- **E-mail**: `marcos@duowealth.app`
- **Senha**: `senha123`
- **Casal/Household**: *Our Wealth (Shared Clarity)*

---

## 🧪 Testes

### Testes Unitários no Backend:
```bash
cd backend
npm test
```

### Testes de Componente no Frontend:
```bash
cd frontend
npm test
```

---

## 📄 Licença

Este projeto está licenciado sob a licença [MIT](LICENSE).
