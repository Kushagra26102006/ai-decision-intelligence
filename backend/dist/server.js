"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const genai_1 = require("@google/genai");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize Gemini API Client
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const auth_1 = __importDefault(require("./routes/auth"));
app.use('/api/auth', auth_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'CommunityAI Backend' });
});
const ai_1 = __importDefault(require("./routes/ai"));
const ingestion_1 = __importDefault(require("./routes/ingestion"));
const knowledge_1 = __importDefault(require("./routes/knowledge"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const operations_1 = __importDefault(require("./routes/operations"));
const enrichment_1 = require("./workers/enrichment");
const forecaster_1 = require("./workers/forecaster");
app.use('/api/ai', ai_1.default);
app.use('/api/data', ingestion_1.default);
app.use('/api/knowledge', knowledge_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/operations', operations_1.default);
// Start the background workers
(0, enrichment_1.startEnrichmentWorker)();
(0, forecaster_1.startForecasterWorker)();
app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
