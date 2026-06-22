import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    });
    return response.embeddings?.[0]?.values || [];
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    return [];
  }
};
