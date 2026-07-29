import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const investmentSchema = z.object({
  ticker: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['fixed_income', 'stocks', 'crypto', 'reits']),
  quantity: z.number().positive(),
  avgPrice: z.number().positive(),
  currentPrice: z.number().positive(),
  monthlyReturnFloat: z.number().default(0),
});

/**
 * @openapi
 * /investments:
 *   get:
 *     summary: Retorna a carteira de investimentos e distribuição por classe
 */
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const householdId = req.user?.householdId!;
    const investments = await prisma.investment.findMany({
      where: { householdId }
    });

    const totalInvested = investments.reduce((acc, inv) => acc + (inv.quantity * inv.currentPrice), 0);
    const totalCost = investments.reduce((acc, inv) => acc + (inv.quantity * inv.avgPrice), 0);
    const totalReturnPercentage = totalCost > 0 ? Math.round(((totalInvested - totalCost) / totalCost) * 1000) / 10 : 0;

    // Distribution by category
    const categoryTotals: Record<string, number> = {
      fixed_income: 0,
      stocks: 0,
      crypto: 0,
      reits: 0
    };

    investments.forEach(inv => {
      const val = inv.quantity * inv.currentPrice;
      categoryTotals[inv.category] = (categoryTotals[inv.category] || 0) + val;
    });

    const distribution = Object.entries(categoryTotals).map(([catKey, value]) => ({
      category: catKey,
      label: catKey === 'fixed_income' ? 'Renda Fixa' : catKey === 'stocks' ? 'Ações' : catKey === 'crypto' ? 'Cripto' : 'FIIs (Fundos)',
      value,
      percentage: totalInvested > 0 ? Math.round((value / totalInvested) * 1000) / 10 : 0
    }));

    // Historical 12M monthly performance curve (mock timeline for chart)
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const performanceCurve = months.map((m, idx) => {
      const growthFactor = 1 + (idx * 0.015);
      return {
        month: m,
        value: Math.round((totalInvested * 0.85) * growthFactor)
      };
    });

    return res.json({
      summary: {
        totalInvested,
        totalCost,
        totalReturnPercentage,
        accumulatedGain: totalInvested - totalCost
      },
      distribution,
      performanceCurve,
      assets: investments.map(inv => {
        const currentValue = inv.quantity * inv.currentPrice;
        const gainLossPercentage = Math.round(((inv.currentPrice - inv.avgPrice) / inv.avgPrice) * 1000) / 10;
        return {
          ...inv,
          currentValue,
          gainLossPercentage
        };
      })
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /investments:
 *   post:
 *     summary: Adiciona ou atualiza uma posição na carteira
 */
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = investmentSchema.parse(req.body);
    const householdId = req.user?.householdId!;

    const investment = await prisma.investment.create({
      data: {
        householdId,
        ticker: data.ticker.toUpperCase(),
        name: data.name,
        category: data.category,
        quantity: data.quantity,
        avgPrice: data.avgPrice,
        currentPrice: data.currentPrice,
        monthlyReturnFloat: data.monthlyReturnFloat
      }
    });

    return res.status(201).json(investment);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @openapi
 * /investments/:id:
 *   delete:
 *     summary: Remove um ativo da carteira
 */
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const householdId = req.user?.householdId!;

    await prisma.investment.deleteMany({
      where: { id, householdId }
    });

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
