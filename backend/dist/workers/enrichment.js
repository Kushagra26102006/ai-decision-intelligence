"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.startEnrichmentWorker = void 0;
const client_1 = require("@prisma/client");
const genai_1 = require("@google/genai");
const prisma = new client_1.PrismaClient();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// This worker simulates a Cloud Function triggered by a Pub/Sub message
const startEnrichmentWorker = () => {
    console.log('[Worker] AI Enrichment Worker started. Polling for events...');
    setInterval(async () => {
        try {
            // Find one pending event to process
            const pendingEvent = await prisma.dataEvent.findFirst({
                where: { status: 'PENDING' },
                orderBy: { createdAt: 'asc' }
            });
            if (!pendingEvent)
                return;
            console.log(`[Worker] Processing event ${pendingEvent.id}...`);
            // Mark as processing
            await prisma.dataEvent.update({
                where: { id: pendingEvent.id },
                data: { status: 'PROCESSING' }
            });
            // Use Gemini to enrich the unstructured payload
            const prompt = `
        You are an AI Data Enrichment engine.
        Analyze this incoming event from source: ${pendingEvent.source}
        Event Type: ${pendingEvent.eventType}
        Raw Payload: ${JSON.stringify(pendingEvent.payload)}
        
        Extract structured insights: Category, Priority (Low/Medium/High), Detected Entities (locations, issues), and Recommended Action.
        Respond ONLY in valid JSON format:
        {
          "category": "String",
          "priority": "String",
          "entities": ["String"],
          "action": "String"
        }
      `;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            const enrichmentResult = JSON.parse(response.text || '{}');
            // Update event with enrichment data and mark as enriched
            await prisma.dataEvent.update({
                where: { id: pendingEvent.id },
                data: {
                    status: 'ENRICHED',
                    aiEnrichment: enrichmentResult,
                    processedAt: new Date()
                }
            });
            console.log(`[Worker] Event ${pendingEvent.id} successfully enriched.`);
            // PHASE 7: Trigger Workflow Automation
            const { triggerWorkflow } = await Promise.resolve().then(() => __importStar(require('../services/workflowEngine')));
            if (enrichmentResult.priority === 'High' || enrichmentResult.priority === 'Critical') {
                await triggerWorkflow(`DataEvent#${pendingEvent.id}`, enrichmentResult.priority, enrichmentResult);
            }
        }
        catch (error) {
            console.error('[Worker] Error processing event:', error);
            // In a real system, we'd mark it as FAILED and use a Dead Letter Queue
        }
    }, 5000); // Poll every 5 seconds
};
exports.startEnrichmentWorker = startEnrichmentWorker;
