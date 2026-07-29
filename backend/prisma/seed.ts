import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DuoWealth database...');

  // Clean existing tables
  await prisma.goalContribution.deleteMany({});
  await prisma.goal.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.investment.deleteMany({});
  await prisma.card.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.userHousehold.deleteMany({});
  await prisma.household.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Household
  const household = await prisma.household.create({
    data: {
      name: 'Our Wealth'
    }
  });

  // 2. Create Users (Marcos & Ana)
  const passwordHash = await bcrypt.hash('senha123', 10);

  const marcos = await prisma.user.create({
    data: {
      name: 'Marcos Silva',
      email: 'marcos@duowealth.app',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      households: {
        create: {
          householdId: household.id,
          role: 'owner'
        }
      }
    }
  });

  const ana = await prisma.user.create({
    data: {
      name: 'Ana Costa',
      email: 'ana@duowealth.app',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      households: {
        create: {
          householdId: household.id,
          role: 'partner'
        }
      }
    }
  });

  // 3. Create Accounts
  await prisma.account.createMany({
    data: [
      { householdId: household.id, name: 'Conta Conjunta Santander', type: 'checking', balance: 28450.0 },
      { householdId: household.id, name: 'Reserva Itaú Personnalité', type: 'savings', balance: 45000.0 },
      { householdId: household.id, name: 'XP Investimentos', type: 'investment', balance: 142800.0 }
    ]
  });

  // 4. Create Credit Cards
  const cardNubank = await prisma.card.create({
    data: {
      householdId: household.id,
      name: 'Nubank Violeta',
      bank: 'Nubank',
      lastFour: '8842',
      closingDay: 3,
      dueDay: 10,
      creditLimit: 25000.0,
      currentBill: 4820.50,
      isPaid: false
    }
  });

  const cardInter = await prisma.card.create({
    data: {
      householdId: household.id,
      name: 'Inter Black Duo',
      bank: 'Banco Inter',
      lastFour: '1092',
      closingDay: 12,
      dueDay: 20,
      creditLimit: 30000.0,
      currentBill: 2310.0,
      isPaid: true
    }
  });

  // 5. Create Categories
  const catMoradia = await prisma.category.create({
    data: { householdId: household.id, name: 'Moradia', icon: 'home', color: '#4edea3' }
  });
  const catAlimentacao = await prisma.category.create({
    data: { householdId: household.id, name: 'Alimentação', icon: 'restaurant', color: '#adc6ff' }
  });
  const catTransporte = await prisma.category.create({
    data: { householdId: household.id, name: 'Transporte', icon: 'directions_car', color: '#d0bcff' }
  });
  const catLazer = await prisma.category.create({
    data: { householdId: household.id, name: 'Lazer & Cultura', icon: 'sports_esports', color: '#ffb4ab' }
  });
  const catAssinaturas = await prisma.category.create({
    data: { householdId: household.id, name: 'Assinaturas', icon: 'subscriptions', color: '#10b981' }
  });
  const catOutros = await prisma.category.create({
    data: { householdId: household.id, name: 'Outros', icon: 'payments', color: '#86948a' }
  });

  const currentMonth = new Date().toISOString().substring(0, 7);

  // 6. Budgets
  await prisma.budget.createMany({
    data: [
      { householdId: household.id, categoryId: catMoradia.id, amount: 4500, monthRef: currentMonth },
      { householdId: household.id, categoryId: catAlimentacao.id, amount: 2800, monthRef: currentMonth },
      { householdId: household.id, categoryId: catTransporte.id, amount: 1500, monthRef: currentMonth },
      { householdId: household.id, categoryId: catLazer.id, amount: 1200, monthRef: currentMonth },
      { householdId: household.id, categoryId: catAssinaturas.id, amount: 400, monthRef: currentMonth }
    ]
  });

  // 7. Transactions
  await prisma.transaction.createMany({
    data: [
      // Income
      {
        householdId: household.id,
        categoryId: catOutros.id,
        paidById: marcos.id,
        description: 'Salário Marcos (Tech Lead)',
        amount: 14500.0,
        type: 'income',
        paidByRole: 'userA',
        splitRatioA: 50,
        splitRatioB: 50,
        paymentMethod: 'Pix',
        status: 'paid',
        monthRef: currentMonth,
        date: new Date()
      },
      {
        householdId: household.id,
        categoryId: catOutros.id,
        paidById: ana.id,
        description: 'Salário Ana (Product Designer)',
        amount: 12800.0,
        type: 'income',
        paidByRole: 'userB',
        splitRatioA: 50,
        splitRatioB: 50,
        paymentMethod: 'Pix',
        status: 'paid',
        monthRef: currentMonth,
        date: new Date()
      },
      // Fixed Expenses
      {
        householdId: household.id,
        categoryId: catMoradia.id,
        paidById: marcos.id,
        description: 'Aluguel & Condomínio',
        amount: 4200.0,
        type: 'fixed',
        paidByRole: 'joint',
        splitRatioA: 50,
        splitRatioB: 50,
        paymentMethod: 'Pix',
        status: 'paid',
        monthRef: currentMonth,
        date: new Date()
      },
      {
        householdId: household.id,
        categoryId: catMoradia.id,
        paidById: ana.id,
        description: 'Energia Enel & Gás',
        amount: 380.0,
        type: 'fixed',
        paidByRole: 'userB',
        splitRatioA: 30,
        splitRatioB: 70,
        paymentMethod: 'Pix',
        status: 'paid',
        monthRef: currentMonth,
        date: new Date()
      },
      {
        householdId: household.id,
        categoryId: catAssinaturas.id,
        cardId: cardNubank.id,
        paidById: marcos.id,
        description: 'Netflix, Spotify & Gympass',
        amount: 290.0,
        type: 'fixed',
        paidByRole: 'joint',
        splitRatioA: 50,
        splitRatioB: 50,
        paymentMethod: 'CreditCard',
        status: 'pending',
        monthRef: currentMonth,
        date: new Date()
      },
      // Variable Expenses
      {
        householdId: household.id,
        categoryId: catAlimentacao.id,
        cardId: cardNubank.id,
        paidById: ana.id,
        description: 'Supermercado Pão de Açúcar',
        amount: 1420.50,
        type: 'variable',
        paidByRole: 'userB',
        splitRatioA: 50,
        splitRatioB: 50,
        paymentMethod: 'CreditCard',
        status: 'paid',
        monthRef: currentMonth,
        date: new Date()
      },
      {
        householdId: household.id,
        categoryId: catLazer.id,
        cardId: cardInter.id,
        paidById: marcos.id,
        description: 'Jantar de Casal - Terraço Itália',
        amount: 650.0,
        type: 'variable',
        paidByRole: 'userA',
        splitRatioA: 100,
        splitRatioB: 0,
        paymentMethod: 'CreditCard',
        status: 'paid',
        monthRef: currentMonth,
        date: new Date()
      }
    ]
  });

  // 8. Goals
  const goalJapan = await prisma.goal.create({
    data: {
      householdId: household.id,
      title: 'Viagem para o Japão (Tokyo & Kyoto)',
      icon: 'flight_takeoff',
      targetAmount: 45000.0,
      currentAmount: 32000.0,
      deadline: new Date('2025-05-15'),
      category: 'Viagem',
      status: 'active'
    }
  });

  const goalHouse = await prisma.goal.create({
    data: {
      householdId: household.id,
      title: 'Entrada do Novo Apartamento',
      icon: 'real_estate_agent',
      targetAmount: 200000.0,
      currentAmount: 115000.0,
      deadline: new Date('2026-12-01'),
      category: 'Imóvel',
      status: 'active'
    }
  });

  const goalEmergency = await prisma.goal.create({
    data: {
      householdId: household.id,
      title: 'Reserva de Emergência (6 Meses)',
      icon: 'shield_with_heart',
      targetAmount: 40000.0,
      currentAmount: 40000.0,
      deadline: new Date('2024-01-01'),
      category: 'Reserva',
      status: 'completed'
    }
  });

  // Goal contributions
  await prisma.goalContribution.createMany({
    data: [
      { goalId: goalJapan.id, userId: marcos.id, amount: 2000.0 },
      { goalId: goalJapan.id, userId: ana.id, amount: 2000.0 },
      { goalId: goalHouse.id, userId: marcos.id, amount: 5000.0 },
      { goalId: goalHouse.id, userId: ana.id, amount: 4000.0 }
    ]
  });

  // 9. Investments
  await prisma.investment.createMany({
    data: [
      {
        householdId: household.id,
        ticker: 'TESOURO SELIC 2029',
        name: 'Tesouro Direto Pós-Fixado',
        category: 'fixed_income',
        quantity: 85.5,
        avgPrice: 1000.0,
        currentPrice: 1085.20,
        monthlyReturnFloat: 0.92
      },
      {
        householdId: household.id,
        ticker: 'ITUB4',
        name: 'Itaú Unibanco PN',
        category: 'stocks',
        quantity: 1200,
        avgPrice: 28.50,
        currentPrice: 34.80,
        monthlyReturnFloat: 2.1
      },
      {
        householdId: household.id,
        ticker: 'IVVB11',
        name: 'iShares S&P 500 ETF',
        category: 'stocks',
        quantity: 250,
        avgPrice: 240.0,
        currentPrice: 310.50,
        monthlyReturnFloat: 1.85
      },
      {
        householdId: household.id,
        ticker: 'HGLG11',
        name: 'CSHG Logística FII',
        category: 'reits',
        quantity: 180,
        avgPrice: 155.0,
        currentPrice: 168.40,
        monthlyReturnFloat: 0.85
      },
      {
        householdId: household.id,
        ticker: 'BTC',
        name: 'Bitcoin (Cold Wallet)',
        category: 'crypto',
        quantity: 0.45,
        avgPrice: 180000.0,
        currentPrice: 340000.0,
        monthlyReturnFloat: 5.4
      }
    ]
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
