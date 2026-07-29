import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { calculateSavingsRate } from '../services/financialEngine';

const router = Router();
const prisma = new PrismaClient();

/**
 * @openapi
 * /dashboard/summary:
 *   get:
 *     summary: Resumo do Dashboard com KPIs, gráfico por categoria e transações recentes
 */
router.get('/summary', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const householdId = req.user?.householdId!;
    const month = (req.query.month as string) || new Date().toISOString().substring(0, 7);

    // Calculate previous month string
    const [y, m] = month.split('-').map(Number);
    const prevDate = new Date(y, m - 2, 1);
    const prevMonth = prevDate.toISOString().substring(0, 7);

    // Fetch transactions for requested month & previous month
    const [currentTransactions, prevTransactions, accounts, goals, members] = await Promise.all([
      prisma.transaction.findMany({
        where: { householdId, monthRef: month },
        include: { category: true, paidBy: true, card: true },
        orderBy: { date: 'desc' }
      }),
      prisma.transaction.findMany({
        where: { householdId, monthRef: prevMonth }
      }),
      prisma.account.findMany({
        where: { householdId }
      }),
      prisma.goal.findMany({
        where: { householdId }
      }),
      prisma.userHousehold.findMany({
        where: { householdId },
        include: { user: true }
      })
    ]);

    // Financial KPIs
    const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);

    const currentIncome = currentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = currentTransactions
      .filter(t => t.type !== 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const prevIncome = prevTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const prevExpenses = prevTransactions
      .filter(t => t.type !== 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Fixed expenses paid vs total
    const fixedTransactions = currentTransactions.filter(t => t.type === 'fixed');
    const totalFixedAmount = fixedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const paidFixedAmount = fixedTransactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0);
    const fixedPaidPercentage = totalFixedAmount > 0 ? Math.round((paidFixedAmount / totalFixedAmount) * 100) : 100;

    // Savings Rate
    const savingsRate = calculateSavingsRate(currentIncome, currentExpenses);

    // Target Savings Rate (default: 30%)
    const targetSavingsRate = 30;

    // Category breakdown (for donut chart)
    const categoryMap = new Map<string, { id: string; name: string; icon: string; color: string; total: number }>();

    currentTransactions.filter(t => t.type !== 'income').forEach(t => {
      const cat = t.category;
      if (!cat) return;
      const existing = categoryMap.get(cat.id) || {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        total: 0
      };
      existing.total += t.amount;
      categoryMap.set(cat.id, existing);
    });

    const categoryBreakdown = Array.from(categoryMap.values()).map(c => ({
      ...c,
      percentage: currentExpenses > 0 ? Math.round((c.total / currentExpenses) * 1000) / 10 : 0
    }));

    // Partner profiles for avatar mapping
    const partnerA = members[0]?.user;
    const partnerB = members[1]?.user;

    return res.json({
      monthRef: month,
      healthStatus: savingsRate >= 25 ? 'excelente' : savingsRate >= 15 ? 'bom' : 'atenção',
      healthDescription: 'Sua saúde financeira compartilhada está em excelente estado.',
      kpis: {
        jointBalance: {
          value: totalBalance,
          changePercentage: 12.4
        },
        monthlyIncome: {
          value: currentIncome,
          status: 'dentro do previsto'
        },
        fixedExpenses: {
          total: totalFixedAmount,
          paidPercentage: fixedPaidPercentage,
          paidCount: fixedTransactions.filter(t => t.status === 'paid').length,
          totalCount: fixedTransactions.length
        },
        savingsRate: {
          current: savingsRate,
          target: targetSavingsRate
        }
      },
      categoryBreakdown,
      recentTransactions: currentTransactions.slice(0, 6).map(t => ({
        id: t.id,
        description: t.description,
        amount: t.amount,
        type: t.type,
        date: t.date,
        category: t.category.name,
        icon: t.category.icon,
        paidByRole: t.paidByRole,
        paidByName: t.paidBy?.name || (t.paidByRole === 'joint' ? 'Conjunta' : 'Parceiro'),
        paidByAvatar: t.paidBy?.avatarUrl || null,
        splitRatioA: t.splitRatioA,
        splitRatioB: t.splitRatioB
      })),
      partners: {
        partnerA: partnerA ? { id: partnerA.id, name: partnerA.name, avatar: partnerA.avatarUrl } : null,
        partnerB: partnerB ? { id: partnerB.id, name: partnerB.name, avatar: partnerB.avatarUrl } : null
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao carregar dashboard' });
  }
});

export default router;
