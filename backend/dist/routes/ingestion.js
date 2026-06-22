"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pubsub_mock_1 = require("../services/pubsub-mock");
const router = express_1.default.Router();
// High-throughput ingestion endpoint
// In production, this would immediately push to Google Cloud Pub/Sub
router.post('/events', async (req, res) => {
    try {
        const { source, eventType, payload } = req.body;
        if (!source || !eventType || !payload) {
            return res.status(400).json({ error: 'Missing required fields: source, eventType, payload' });
        }
        const event = await (0, pubsub_mock_1.publishEvent)(source, eventType, payload);
        res.status(202).json({
            message: 'Event accepted for processing',
            eventId: event.id
        });
    }
    catch (error) {
        console.error('Ingestion Error:', error);
        res.status(500).json({ error: 'Failed to ingest event' });
    }
});
exports.default = router;
