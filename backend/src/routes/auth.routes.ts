import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'duowealth-secret-key-2024';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  householdName: z.string().optional(),
  joinHouseholdId: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário e cria ou vincula a um household
 */
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    let householdId = data.joinHouseholdId;

    if (!householdId) {
      const household = await prisma.household.create({
        data: { name: data.householdName || 'Our Wealth' }
      });
      householdId = household.id;
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
        households: {
          create: {
            householdId: householdId!,
            role: 'owner'
          }
        }
      }
    });

    const token = jwt.sign(
      { userId: user.id, householdId, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      householdId
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Erro ao registrar usuário' });
  }
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autentica o usuário e retorna o JWT
 */
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { households: { include: { household: true } } }
    });

    if (!user) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const primaryHousehold = user.households[0]?.household;
    const householdId = primaryHousehold ? primaryHousehold.id : '';

    const token = jwt.sign(
      { userId: user.id, householdId, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      },
      household: primaryHousehold
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Erro ao realizar login' });
  }
});

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Retorna os dados do usuário e household ativos
 */
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: { id: true, name: true, email: true, avatarUrl: true }
    });
    const household = await prisma.household.findUnique({
      where: { id: req.user?.householdId },
      include: { members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } } }
    });

    return res.json({ user, household });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
