import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// This worker simulates a Cloud Function triggered by a Pub/Sub message
export const startEnrichmentWorker = () => {
  console.log('[Worker] AI Enrichment Worker started. Polling for events...');
  
  setInterval(async () => {
    try {
      // Find one pending event to process
      const pendingEvent = await prisma.dataEvent.findFirst({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'asc' }
      });

      if (!pendingEvent) return;

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

      let enrichmentResult;
      
      if (process.env.GEMINI_API_KEY === "mock-api-key") {
        enrichmentResult = {
          category: pendingEvent.eventType === 'CITIZEN_REPORT' ? 'Public Safety' : 'Infrastructure',
          priority: 'High',
          entities: ['Sector 7G', 'Main Street'],
          action: 'Dispatch maintenance crew immediately.'
        };
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });
        enrichmentResult = JSON.parse(response.text || '{}');
      }

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
      const { triggerWorkflow } = await import('../services/workflowEngine');
      if (enrichmentResult.priority === 'High' || enrichmentResult.priority === 'Critical') {
        await triggerWorkflow(`DataEvent#${pendingEvent.id}`, enrichmentResult.priority, enrichmentResult);
      }

    } catch (error) {
      console.error('[Worker] Error processing event:', error);
      // In a real system, we'd mark it as FAILED and use a Dead Letter Queue
    }
  }, 5001); // Poll every 5 seconds
};
