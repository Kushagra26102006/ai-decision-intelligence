import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get the latest risk forecasts
router.get('/forecasts', authenticate, async (req, res) => {
  try {
    // Get the most recent forecast for each domain
    const domains = ['MOBILITY', 'HEALTHCARE', 'ENVIRONMENT', 'OVERALL'];
    const results = await Promise.all(domains.map(async (domain) => {
      return prisma.riskForecast.findFirst({
        where: { domain },
        orderBy: { createdAt: 'desc' }
      });
    }));

    // Filter out nulls
    const activeForecasts = results.filter(f => f !== null);

    res.json({ forecasts: activeForecasts });
  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    res.status(500).json({ error: 'Failed to retrieve forecasts' });
  }
});

export default router;
