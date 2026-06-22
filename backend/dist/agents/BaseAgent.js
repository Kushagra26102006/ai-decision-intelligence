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
exports.BaseAgent = void 0;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
class BaseAgent {
    name;
    description;
    modelName = 'gemini-2.5-flash';
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
    // Common method to call Gemini with standard XAI prompt and RAG injection
    async callGeminiWithXAI(prompt) {
        // Dynamic import to avoid circular dependency issues if any
        const { hybridSearch } = await Promise.resolve().then(() => __importStar(require('../services/rag')));
        // Perform RAG Retrieval
        const retrievedContext = await hybridSearch(prompt, 3);
        const contextString = retrievedContext.map((c) => `Source: ${c.metadata.source}\nContent: ${c.content}`).join('\n\n');
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
            const parsed = JSON.parse(text);
            return parsed;
        }
        catch (error) {
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
exports.BaseAgent = BaseAgent;
