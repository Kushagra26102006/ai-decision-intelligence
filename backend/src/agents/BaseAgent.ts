import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface XAIResponse {
  insight: string;
  confidence: number;
  reasoning: string;
  sources: string[];
}

export abstract class BaseAgent {
  public name: string;
  public description: string;
  protected modelName: string = 'gemini-2.5-flash';

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  // Each specialized agent must implement this
  public abstract process(query: string, context?: any): Promise<XAIResponse>;

  // Common method to call Gemini with standard XAI prompt and RAG injection
  protected async callGeminiWithXAI(prompt: string): Promise<XAIResponse> {
    // Dynamic import to avoid circular dependency issues if any
    const { hybridSearch } = await import('../services/rag');
    
    // Perform RAG Retrieval
    const retrievedContext = await hybridSearch(prompt, 3);
    const contextString = retrievedContext.map((c: any) => `Source: ${c.metadata.source}\nContent: ${c.content}`).join('\n\n');

    const systemInstruction = `
      You are the ${this.name}. ${this.description}.
      You must respond with a JSON object exactly matching this structure:
      {
        "insight": "Your actionable recommendation or direct answer.",
        "confidence": 0.0 to 100.0,
        "reasoning": "A step-by-step explanation of why you reached this conclusion based on data.",
        "sources": ["List", "of", "sources", "used"]
      }
      Respond ONLY with valid JSON. Do not use markdown blocks like \`\`\`json.
      
      CRITICAL: Use the following retrieved knowledge context to ground your answer and cite the sources.
      --- RETRIEVED KNOWLEDGE ---
      ${contextString}
      ---------------------------
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text) as XAIResponse;
      return parsed;
    } catch (error) {
      console.error(`[${this.name}] Gemini Error:`, error);
      return {
        insight: "I encountered an error analyzing this request.",
        confidence: 0,
        reasoning: "API failure or parsing error.",
        sources: []
      };
    }
  }
}
