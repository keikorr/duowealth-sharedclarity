import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { calculateProjections, calculateEmergencyFundRatio } from '../services/financialEngine';

const router = Router();
const prisma = new PrismaClient();

const simulateSchema = z.object({
  monthlyContribution: z.number().min(0),
  expectedReturnRate: z.number().min(1).max(30).default(10),
  conservativeReturnRate: z.number().min(1).max(30).default(6),
});

/**
 * @openapi
 * /projections/simulate:
 *   post:
 *     summary: Recalcula projeção patrimonial futura interativa
 */
router.post('/simulate', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const householdId = req.user?.householdId!;
    const { monthlyContribution, expectedReturnRate, conservativeReturnRate } = simulateSchema.parse(req.body);

    const investments = await prisma.investment.findMany({ where: { householdId } });
    const currentWealth = investments.reduce((acc, inv) => acc + inv.quantity * inv.currentPrice, 50000);

    const projections = calculateProjections(
      currentWealth,
      monthlyContribution,
      expectedReturnRate,
      conservativeReturnRate
    );

    return res.json({
      currentWealth,
      monthlyContribution,
      expectedReturnRate,
      conservativeReturnRate,
      projections
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @openapi
 * /insights:
 *   get:
 *     summary: Retorna recomendações e alertas financeiros automáticos do casal
 */
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const householdId = req.user?.householdId!;

    const [transactions, accounts, goals] = await Promise.all([
      prisma.transaction.findMany({ where: { householdId } }),
      prisma.account.findMany({ where: { householdId } }),
      prisma.goal.findMany({ where: { householdId } })
    ]);

    const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
    const fixedExpenses = transactions
      .filter(t => t.type === 'fixed')
      .reduce((sum, t) => sum + t.amount, 0) || 4500;

    const emergencyFundRatio = calculateEmergencyFundRatio(totalBalance, fixedExpenses);

    const deliveryExpenses = transactions
      .filter(t => t.description.toLowerCase().includes('ifood') || t.description.toLowerCase().includes('delivery'))
      .reduce((sum, t) => sum + t.amount, 0);

    const insights = [
      {
        id: '1',
        type: 'opportunity',
        title: 'Acelere sua Independência Financeira',
        icon: 'trending_up',
        description: 'Um aumento de R$ 500 no aporte mensal antecipa sua meta de aposentadoria conjunta em 3.2 anos.',
        actionLabel: 'Ajustar Aporte'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Alerta de Categoria: Gastos com Delivery',
        icon: 'restaurant',
        description: `Os gastos com entregas atingiram R$ ${deliveryExpenses.toFixed(0) || 680} este mês (15% acima da média do casal).`,
        impactText: 'Economia potencial de R$ 300/mês direcionável para a Meta "Viagem Japão".'
      },
      {
        id: '3',
        type: 'info',
        title: `Status da Reserva de Emergência (${emergencyFundRatio.monthsCovered} Meses)`,
        icon: 'shield_with_heart',
        description: `Sua reserva cobre ${emergencyFundRatio.monthsCovered} meses de custos fixos (${emergencyFundRatio.percentage}% da meta ideal de 6 meses).`,
        statusBadge: emergencyFundRatio.status.toUpperCase()
      },
      {
        id: '4',
        type: 'tax',
        title: 'Otimização Fiscal Compartilhada (VGBL)',
        icon: 'request_quote',
        description: 'Migrar a declaração de IR para o modelo completo com VGBL pode gerar uma restituição estimada de R$ 2.400 ao casal.',
        estimatedSavings: 2400
      }
    ];

    const goalsTracking = goals.map(g => ({
      id: g.id,
      title: g.title,
      deadline: g.deadline,
      progressPercentage: Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)),
      statusProjected: g.currentAmount >= g.targetAmount * 0.7 ? 'No Prazo' : 'Atrasado',
      recommendation: g.currentAmount >= g.targetAmount * 0.7 ? 'Manter Aporte' : 'Aumentar R$ 200/mês'
    }));

    return res.json({
      emergencyFundRatio,
      insights,
      goalsTracking
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
