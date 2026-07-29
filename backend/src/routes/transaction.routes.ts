import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const transactionSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(['fixed', 'variable', 'income']),
  categoryId: z.string(),
  cardId: z.string().optional().nullable(),
  monthRef: z.string().regex(/^\d{4}-\d{2}$/),
  paidByRole: z.enum(['userA', 'userB', 'joint']),
  splitRatioA: z.number().min(0).max(100).default(50),
  splitRatioB: z.number().min(0).max(100).default(50),
  paymentMethod: z.string().default('Pix'),
  status: z.enum(['paid', 'pending']).default('paid'),
  date: z.string().optional(),
});

/**
 * @openapi
 * /transactions:
 *   get:
 *     summary: Lista transações com filtros de tipo, mês e categoria
 */
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const householdId = req.user?.householdId!;
    const { type, month, categoryId, status } = req.query;

    const where: any = { householdId };
    if (type) where.type = type as string;
    if (month) where.monthRef = month as string;
    if (categoryId) where.categoryId = categoryId as string;
    if (status) where.status = status as string;

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true, card: true, paidBy: true },
      orderBy: { date: 'desc' }
    });

    return res.json(transactions);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /transactions:
 *   post:
 *     summary: Cria uma nova transação com split customizado
 */
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = transactionSchema.parse(req.body);
    const householdId = req.user?.householdId!;

    const transaction = await prisma.transaction.create({
      data: {
        householdId,
        description: data.description,
        amount: data.amount,
        type: data.type,
        categoryId: data.categoryId,
        cardId: data.cardId || null,
        paidById: req.user?.userId,
        monthRef: data.monthRef,
        paidByRole: data.paidByRole,
        splitRatioA: data.splitRatioA,
        splitRatioB: data.splitRatioB,
        paymentMethod: data.paymentMethod,
        status: data.status,
        date: data.date ? new Date(data.date) : new Date(),
      },
      include: { category: true, card: true }
    });

    return res.status(201).json(transaction);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Erro ao criar transação' });
  }
});

/**
 * @openapi
 * /transactions/:id:
 *   patch:
 *     summary: Atualiza status ou campos de uma transação
 */
router.patch('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const householdId = req.user?.householdId!;

    const transaction = await prisma.transaction.findFirst({
      where: { id, householdId }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: req.body,
      include: { category: true, card: true }
    });

    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @openapi
 * /transactions/:id:
 *   delete:
 *     summary: Remove uma transação
 */
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const householdId = req.user?.householdId!;

    await prisma.transaction.deleteMany({
      where: { id, householdId }
    });

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
