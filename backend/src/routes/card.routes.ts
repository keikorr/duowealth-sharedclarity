import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const cardSchema = z.object({
  name: z.string().min(1),
  bank: z.string().min(1),
  lastFour: z.string().optional(),
  closingDay: z.number().min(1).max(31),
  dueDay: z.number().min(1).max(31),
  creditLimit: z.number().positive(),
  currentBill: z.number().min(0).default(0),
  isPaid: z.boolean().default(false),
});

/**
 * @openapi
 * /cards:
 *   get:
 *     summary: Lista cartões de crédito do casal
 */
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const householdId = req.user?.householdId!;
    const cards = await prisma.card.findMany({
      where: { householdId },
      orderBy: { dueDay: 'asc' }
    });
    return res.json(cards);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /cards:
 *   post:
 *     summary: Adiciona um novo cartão de crédito
 */
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const data = cardSchema.parse(req.body);
    const householdId = req.user?.householdId!;

    const card = await prisma.card.create({
      data: {
        householdId,
        ...data
      }
    });

    return res.status(201).json(card);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @openapi
 * /cards/:id/pay:
 *   patch:
 *     summary: Marcar fatura do cartão como paga
 */
router.patch('/:id/pay', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const householdId = req.user?.householdId!;

    const card = await prisma.card.updateMany({
      where: { id, householdId },
      data: { isPaid: true }
    });

    return res.json({ success: true, card });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
