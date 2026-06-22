"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OrchestratorAgent_1 = require("../agents/OrchestratorAgent");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const orchestrator = new OrchestratorAgent_1.OrchestratorAgent();
// Protected route for AI interactions
router.post('/ask', auth_1.authenticate, async (req, res) => {
    try {
        const { prompt, sessionId } = req.body;
        const userId = req.user.id;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        // Optional: Fetch previous context (RAG mock) from the database
        let context = {};
        let currentSessionId = sessionId;
        if (sessionId) {
            const messages = await prisma.message.findMany({
                where: { sessionId },
                orderBy: { createdAt: 'asc' },
                take: 5
            });
            context = { previousMessages: messages.map(m => ({ role: m.role, content: m.content })) };
        }
        else {
            // Create new session if none provided
            const session = await prisma.chatSession.create({
                data: { userId, title: prompt.substring(0, 30) }
            });
            currentSessionId = session.id;
        }
        // Process through Orchestrator
        const result = await orchestrator.handleQuery(prompt, context);
        // Save interaction to Memory DB
        await prisma.message.create({
            data: {
                sessionId: currentSessionId,
                role: 'user',
                content: prompt
            }
        });
        await prisma.message.create({
            data: {
                sessionId: currentSessionId,
                role: 'assistant',
                content: result.insight,
                confidence: result.confidence,
                reasoning: result.reasoning,
                sources: result.sources,
            }
        });
        res.json({
            sessionId: currentSessionId,
            result: result
        });
    }
    catch (error) {
        console.error('AI Route Error:', error);
        res.status(500).json({ error: 'Failed to process AI request' });
    }
});
exports.default = router;
