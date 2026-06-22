import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import { approveWorkflowStep } from '../services/workflowEngine';

const router = express.Router();
const prisma = new PrismaClient();

// Get active and pending workflows
router.get('/workflows', authenticate, authorize(['SYSTEM_ADMIN', 'COMMUNITY_MANAGER']), async (req, res) => {
  try {
    const workflows = await prisma.workflowExecution.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json({ workflows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// Approve a pending action step
router.post('/workflows/:id/approve', authenticate, authorize(['SYSTEM_ADMIN', 'COMMUNITY_MANAGER']), async (req, res) => {
  try {
    const { stepAction } = req.body;
    if (!stepAction) return res.status(400).json({ error: 'stepAction is required' });

    const updated = await approveWorkflowStep(req.params.id as string, stepAction as string);
    res.json({ message: 'Step approved and executed successfully', workflow: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to approve workflow step' });
  }
});

export default router;
