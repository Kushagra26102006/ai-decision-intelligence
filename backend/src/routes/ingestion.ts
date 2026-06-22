import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { publishEvent } from '../services/pubsub-mock';

const router = express.Router();

// High-throughput ingestion endpoint
// In production, this would immediately push to Google Cloud Pub/Sub
router.post('/events', async (req, res) => {
  try {
    const { source, eventType, payload } = req.body;
    
    if (!source || !eventType || !payload) {
      return res.status(400).json({ error: 'Missing required fields: source, eventType, payload' });
    }

    const event = await publishEvent(source, eventType, payload);

    res.status(202).json({ 
      message: 'Event accepted for processing',
      eventId: event.id 
    });
  } catch (error) {
    console.error('Ingestion Error:', error);
    res.status(500).json({ error: 'Failed to ingest event' });
  }
});

export default router;
