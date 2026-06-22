import { GoogleGenAI } from '@google/genai';
import { BaseAgent, XAIResponse } from './BaseAgent';
import { CitizenSupportAgent, HealthcareAgent, EnvironmentalAgent } from './specialized';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class OrchestratorAgent {
  private agents: Record<string, BaseAgent>;

  constructor() {
    this.agents = {
      CITIZEN_SUPPORT: new CitizenSupportAgent(),
      HEALTHCARE: new HealthcareAgent(),
      ENVIRONMENTAL: new EnvironmentalAgent(),
      // More agents can be added here
    };
  }

  public async handleQuery(query: string, context?: any): Promise<XAIResponse> {
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
      if (process.env.GEMINI_API_KEY === "mock-api-key") {
        return {
          insight: "I am a mock response because a valid Gemini API Key has not been configured in the .env file. Once configured, I will intelligently route your query to specialized AI models.",
          confidence: 99.9,
          reasoning: "Mock-mode active. Bypassing Orchestrator.",
          sources: ["System"]
        };
      }

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
      
    } catch (error) {
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
