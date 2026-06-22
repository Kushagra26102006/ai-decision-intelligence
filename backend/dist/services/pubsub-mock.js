"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEvent = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Simulates a Pub/Sub topic push
const publishEvent = async (source, eventType, payload) => {
    try {
        const event = await prisma.dataEvent.create({
            data: {
                source,
                eventType,
                payload,
                status: 'PENDING'
            }
        });
        console.log(`[PubSub Mock] Event published to topic ${eventType}: ${event.id}`);
        return event;
    }
    catch (error) {
        console.error('[PubSub Mock] Failed to publish event:', error);
        throw error;
    }
};
exports.publishEvent = publishEvent;
