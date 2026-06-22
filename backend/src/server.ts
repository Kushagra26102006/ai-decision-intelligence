import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize Gemini API Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

import authRoutes from './routes/auth';
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CommunityAI Backend' });
});

import aiRoutes from './routes/ai';
import ingestionRoutes from './routes/ingestion';
import knowledgeRoutes from './routes/knowledge';
import analyticsRoutes from './routes/analytics';
import operationsRoutes from './routes/operations';
import { startEnrichmentWorker } from './workers/enrichment';
import { startForecasterWorker } from './workers/forecaster';

app.use('/api/ai', aiRoutes);
app.use('/api/data', ingestionRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/operations', operationsRoutes);

// Start the background workers
startEnrichmentWorker();
startForecasterWorker();

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
