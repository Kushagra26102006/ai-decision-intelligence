import { BaseAgent, XAIResponse } from './BaseAgent';

export class CitizenSupportAgent extends BaseAgent {
  constructor() {
    super(
      'Citizen Support Agent',
      'You understand citizen concerns, classify complaints, prioritize issues, and route them to correct departments.'
    );
  }

  public async process(query: string, context?: any): Promise<XAIResponse> {
    const prompt = `
      Analyze the following citizen query: "${query}"
      Context provided: ${JSON.stringify(context || {})}
      
      Determine the category, priority, and recommended department.
    `;
    return this.callGeminiWithXAI(prompt);
  }
}

export class HealthcareAgent extends BaseAgent {
  constructor() {
    super(
      'Healthcare Intelligence Agent',
      'You monitor community health, predict disease trends, and forecast hospital utilization.'
    );
  }

  public async process(query: string, context?: any): Promise<XAIResponse> {
    const prompt = `
      Analyze the following healthcare query: "${query}"
      Context provided: ${JSON.stringify(context || {})}
      
      Provide a health risk score and resource recommendation.
    `;
    return this.callGeminiWithXAI(prompt);
  }
}

export class EnvironmentalAgent extends BaseAgent {
  constructor() {
    super(
      'Environmental Intelligence Agent',
      'You analyze weather, pollution, water quality, and environmental risks.'
    );
  }

  public async process(query: string, context?: any): Promise<XAIResponse> {
    const prompt = `
      Analyze the following environmental query: "${query}"
      Context provided: ${JSON.stringify(context || {})}
      
      Provide environmental risk index and recommendations.
    `;
    return this.callGeminiWithXAI(prompt);
  }
}
