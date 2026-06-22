"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRiskForecast = void 0;
const genai_1 = require("@google/genai");
const client_1 = require("@prisma/client");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prisma = new client_1.PrismaClient();
const generateRiskForecast = async (domain, historicalContext) => {
    const prompt = `
    You are the CommunityAI Predictive Intelligence Engine.
    Analyze the following recent historical data for the domain: ${domain}
    Data: ${JSON.stringify(historicalContext)}
    
    Predict the near-future risk (0-100), identify anomalies, and provide prescriptive recommendations.
    Return ONLY valid JSON in this format:
    {
      "riskScore": Int (0-100),
      "prediction": "String describing the forecast",
      "confidence": Float (0.0-100.0),
      "factors": ["Factor 1", "Factor 2"],
      "recommendations": ["Action 1", "Action 2"]
    }
  `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        const parsed = JSON.parse(response.text || '{}');
        // ValidUntil 24 hours from now
        const validUntil = new Date();
        validUntil.setHours(validUntil.getHours() + 24);
        return await prisma.riskForecast.create({
            data: {
                domain,
                riskScore: parsed.riskScore || 50,
                prediction: parsed.prediction || "Stable conditions expected.",
                confidence: parsed.confidence || 80.0,
                factors: parsed.factors || [],
                recommendations: parsed.recommendations || [],
                validUntil
            }
        });
    }
    catch (error) {
        console.error(`Failed to generate forecast for ${domain}:`, error);
        return null;
    }
};
exports.generateRiskForecast = generateRiskForecast;
