"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentalAgent = exports.HealthcareAgent = exports.CitizenSupportAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
class CitizenSupportAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super('Citizen Support Agent', 'You understand citizen concerns, classify complaints, prioritize issues, and route them to correct departments.');
    }
    async process(query, context) {
        const prompt = `
      Analyze the following citizen query: "${query}"
      Context provided: ${JSON.stringify(context || {})}
      
      Determine the category, priority, and recommended department.
    `;
        return this.callGeminiWithXAI(prompt);
    }
}
exports.CitizenSupportAgent = CitizenSupportAgent;
class HealthcareAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super('Healthcare Intelligence Agent', 'You monitor community health, predict disease trends, and forecast hospital utilization.');
    }
    async process(query, context) {
        const prompt = `
      Analyze the following healthcare query: "${query}"
      Context provided: ${JSON.stringify(context || {})}
      
      Provide a health risk score and resource recommendation.
    `;
        return this.callGeminiWithXAI(prompt);
    }
}
exports.HealthcareAgent = HealthcareAgent;
class EnvironmentalAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super('Environmental Intelligence Agent', 'You analyze weather, pollution, water quality, and environmental risks.');
    }
    async process(query, context) {
        const prompt = `
      Analyze the following environmental query: "${query}"
      Context provided: ${JSON.stringify(context || {})}
      
      Provide environmental risk index and recommendations.
    `;
        return this.callGeminiWithXAI(prompt);
    }
}
exports.EnvironmentalAgent = EnvironmentalAgent;
