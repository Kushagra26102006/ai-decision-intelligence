import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simulates a Pub/Sub topic push
export const publishEvent = async (source: string, eventType: string, payload: any) => {
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
  } catch (error) {
    console.error('[PubSub Mock] Failed to publish event:', error);
    throw error;
  }
};
