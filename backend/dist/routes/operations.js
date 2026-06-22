"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const workflowEngine_1 = require("../services/workflowEngine");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Get active and pending workflows
router.get('/workflows', auth_1.authenticate, (0, auth_1.authorize)(['SYSTEM_ADMIN', 'COMMUNITY_MANAGER']), async (req, res) => {
    try {
        const workflows = await prisma.workflowExecution.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        res.json({ workflows });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch workflows' });
    }
});
// Approve a pending action step
router.post('/workflows/:id/approve', auth_1.authenticate, (0, auth_1.authorize)(['SYSTEM_ADMIN', 'COMMUNITY_MANAGER']), async (req, res) => {
    try {
        const { stepAction } = req.body;
        if (!stepAction)
            return res.status(400).json({ error: 'stepAction is required' });
        const updated = await (0, workflowEngine_1.approveWorkflowStep)(req.params.id, stepAction);
        res.json({ message: 'Step approved and executed successfully', workflow: updated });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to approve workflow step' });
    }
});
exports.default = router;
