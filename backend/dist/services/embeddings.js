"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = void 0;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const generateEmbedding = async (text) => {
    try {
        const response = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: text,
        });
        return response.embeddings?.[0]?.values || [];
    }
    catch (error) {
        console.error('Failed to generate embedding:', error);
        return [];
    }
};
exports.generateEmbedding = generateEmbedding;
