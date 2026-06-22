import { PrismaClient } from '@prisma/client';
import { generateRiskForecast } from '../services/predictiveEngine';

const prisma = new PrismaClient();

// This simulates a CRON job that runs nightly or hourly
export const startForecasterWorker = () => {
  console.log('[Forecaster] Predictive Intelligence Worker started.');
  
  // Run once immediately, then every 1 hour (simulated with 1 minute for testing)
  const runForecast = async () => {
    console.log('[Forecaster] Generating fresh community risk predictions...');
    
    const domains = ['MOBILITY', 'HEALTHCARE', 'ENVIRONMENT'];
    
    for (const domain of domains) {
      // Mock historical data retrieval (In production, run aggregations via SQL)
      const recentEvents = await prisma.dataEvent.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
      });
      
      await generateRiskForecast(domain, recentEvents);
    }
    
    // Generate OVERALL Well-Being Index
    const latestForecasts = await prisma.riskForecast.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    });
    
    const avgRisk = latestForecasts.reduce((acc, curr) => acc + curr.riskScore, 0) / (latestForecasts.length || 1);
    const wellBeingScore = Math.max(0, 100 - avgRisk);
    
    await prisma.riskForecast.create({
      data: {
        domain: 'OVERALL',
        riskScore: Math.round(avgRisk), // For overall, this represents community hazard level
        prediction: `Community Well-Being Index is currently ${Math.round(wellBeingScore)}/100.`,
        confidence: 95.0,
        factors: ["Aggregated Mobility Risk", "Aggregated Health Risk", "Aggregated Environment Risk"],
        recommendations: ["Maintain current operational readiness."],
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
    
    console.log('[Forecaster] Predictions and Well-Being Index updated successfully.');
  };

  runForecast();
  // For MVP demonstration, we re-run every 60 seconds (in prod: 24h)
  setInterval(runForecast, 60000); 
};
