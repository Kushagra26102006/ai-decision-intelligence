"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestratorAgent = void 0;
const genai_1 = require("@google/genai");
const specialized_1 = require("./specialized");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
class OrchestratorAgent {
    agents;
    constructor() {
        this.agents = {
            CITIZEN_SUPPORT: new specialized_1.CitizenSupportAgent(),
            HEALTHCARE: new specialized_1.HealthcareAgent(),
            ENVIRONMENTAL: new specialized_1.EnvironmentalAgent(),
            // More agents can be added here
        };
    }
    async handleQuery(query, context) {
        const routingPrompt = `
      You are the Central Orchestrator for CommunityAI.
      Available Agents:
      - CITIZEN_SUPPORT: For complaints, waste, general citizen queries.
      - HEALTHCARE: For disease trends, hospital capacity, wellness.
      - ENVIRONMENTAL: For weather, water shortages, pollution.
      
      User Query: "${query}"
      
      Which agent should handle this? Respond ONLY with the EXACT name of the agent from the list above. If unsure, respond CITIZEN_SUPPORT.
    `;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: routingPrompt,
            });
            const selectedAgentKey = response.text?.trim().toUpperCase() || 'CITIZEN_SUPPORT';
            const agent = this.agents[selectedAgentKey] || this.agents['CITIZEN_SUPPORT'];
            console.log(`[Orchestrator] Routing query to: ${agent.name}`);
            // Execute the selected specialized agent
            const agentResponse = await agent.process(query, context);
            return agentResponse;
        }
        catch (error) {
            console.error('[Orchestrator] Failed to route query:', error);
            return {
                insight: "System is currently unavailable to process this request.",
                confidence: 0,
                reasoning: "Orchestrator failure.",
                sources: []
            };
        }
    }
}
exports.OrchestratorAgent = OrchestratorAgent;
