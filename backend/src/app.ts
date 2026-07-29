import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import transactionRoutes from './routes/transaction.routes';
import budgetRoutes from './routes/budget.routes';
import cardRoutes from './routes/card.routes';
import goalRoutes from './routes/goal.routes';
import investmentRoutes from './routes/investment.routes';
import projectionRoutes from './routes/projection.routes';

const app = express();

app.use(cors());
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'duowealth-backend', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/projections', projectionRoutes);
app.use('/api/insights', projectionRoutes);

export default app;
