import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

/**
 * @openapi
 * /budgets:
 *   get:
 *     summary: Retorna a comparação Budgeted vs Actual por categoria para o mês selecionado
 */
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const householdId = req.user?.householdId!;
    const month = (req.query.month as string) || new Date().toISOString().substring(0, 7);

    const [categories, budgets, transactions] = await Promise.all([
      prisma.category.findMany({ where: { OR: [{ householdId }, { householdId: null }] } }),
      prisma.budget.findMany({ where: { householdId, monthRef: month } }),
      prisma.transaction.findMany({
        where: { householdId, monthRef: month, type: { in: ['fixed', 'variable'] } }
      })
    ]);

    const budgetMap = new Map(budgets.map(b => [b.categoryId, b.amount]));
    
    const actualMap = new Map<string, number>();
    transactions.forEach(t => {
      actualMap.set(t.categoryId, (actualMap.get(t.categoryId) || 0) + t.amount);
    });

    const result = categories.map(cat => {
      const budgeted = budgetMap.get(cat.id) || 1500; // default benchmark
      const actual = actualMap.get(cat.id) || 0;
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        icon: cat.icon,
        color: cat.color,
        budgeted,
        actual,
        difference: budgeted - actual,
        isOverBudget: actual > budgeted
      };
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const householdId = req.user?.householdId!;
    const { categoryId, amount, monthRef } = req.body;

    const budget = await prisma.budget.upsert({
      where: { id: req.body.id || 'new-budget' },
      update: { amount },
      create: { householdId, categoryId, amount, monthRef }
    });

    return res.json(budget);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
