import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const goalSchema = z.object({
  title: z.string().min(1),
  icon: z.string().default('flight_takeoff'),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0).default(0),
  deadline: z.string(),
  category: z.string().default('Geral'),
});

const contributionSchema = z.object({
  amount: z.number().positive(),
});

/**
 * @openapi
 * /goals:
 *   get:
 *     summary: Lista todas as metas do casal e resumo total
 */
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const householdId = req.user?.householdId!;
    const goals = await prisma.goal.findMany({
      where: { householdId, status: { in: ['active', 'completed'] } },
      include: { contributions: { include: { user: { select: { name: true, avatarUrl: true } } } } },
      orderBy: { deadline: 'asc' }
    });

    const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);

    return res.json({
      summary: {
        totalSaved,
        totalTarget,
        remainingTotal: totalTarget - totalSaved,
        percentage: totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0,
        monthlyGrowthPercentage: 8.5
      },
      goals: goals.map(g => ({
        ...g,
        progressPercentage: Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)),
        remainingAmount: Math.max(0, g.targetAmount - g.currentAmount)
      }))
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /goals:
 *   post:
 *     summary: Cria uma nova meta compartilhada
 */
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = goalSchema.parse(req.body);
    const householdId = req.user?.householdId!;

    const goal = await prisma.goal.create({
      data: {
        householdId,
        title: data.title,
        icon: data.icon,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
        deadline: new Date(data.deadline),
        category: data.category
      }
    });

    return res.status(201).json(goal);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @openapi
 * /goals/:id/contributions:
 *   post:
 *     summary: Registra um aporte financeiro em uma meta
 */
router.post('/:id/contributions', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { amount } = contributionSchema.parse(req.body);
    const householdId = req.user?.householdId!;
    const userId = req.user?.userId!;

    const goal = await prisma.goal.findFirst({
      where: { id, householdId }
    });

    if (!goal) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    const updatedCurrent = goal.currentAmount + amount;
    const isCompleted = updatedCurrent >= goal.targetAmount;

    const [contribution, updatedGoal] = await prisma.$transaction([
      prisma.goalContribution.create({
        data: {
          goalId: id,
          userId,
          amount
        }
      }),
      prisma.goal.update({
        where: { id },
        data: {
          currentAmount: updatedCurrent,
          status: isCompleted ? 'completed' : goal.status
        }
      })
    ]);

    return res.status(201).json({ contribution, updatedGoal });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @openapi
 * /goals/:id:
 *   delete:
 *     summary: Deleta ou arquiva uma meta
 */
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const householdId = req.user?.householdId!;

    await prisma.goal.deleteMany({
      where: { id, householdId }
    });

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
