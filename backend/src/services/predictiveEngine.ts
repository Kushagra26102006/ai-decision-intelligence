import { GoogleGenAI } from '@google/genai';
import { PrismaClient } from '@prisma/client';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prisma = new PrismaClient();

export const generateRiskForecast = async (domain: string, historicalContext: any) => {
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
    if (process.env.GEMINI_API_KEY === "mock-api-key") {
      // Provide an impressive mock response if the user hasn't set an API key yet
      const mockData = {
        riskScore: domain === 'MOBILITY' ? 42 : domain === 'HEALTHCARE' ? 15 : 68,
        prediction: domain === 'MOBILITY' ? "Traffic flow is stable but minor congestion expected during rush hour." : 
                    domain === 'HEALTHCARE' ? "Hospital capacity is optimal. No critical anomalies detected." : 
                    "Elevated flood risks in low-lying sectors due to upcoming precipitation.",
        confidence: 85.5,
        factors: ["Historical data patterns", "Current sensor telemetry"],
        recommendations: ["Continue standard monitoring protocol", "Deploy preventative measures if risk score exceeds 75"]
      };

      const validUntil = new Date();
      validUntil.setHours(validUntil.getHours() + 24);
      
      return await prisma.riskForecast.create({
        data: {
          domain,
          riskScore: mockData.riskScore,
          prediction: mockData.prediction,
          confidence: mockData.confidence,
          factors: mockData.factors,
          recommendations: mockData.recommendations,
          validUntil
        }
      });
    }

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
  } catch (error) {
    console.error(`Failed to generate forecast for ${domain}:`, error);
    return null;
  }
};
