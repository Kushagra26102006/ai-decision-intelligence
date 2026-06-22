import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logAudit = async (userId: string, action: string, resource: string, metadata?: any) => {
  try {
    // We wrap this in a try-catch to ensure that if auditing fails, it doesn't break the main flow.
    // In a real system, you might want it to fail the request if it's a critical security action.
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        metadata: metadata ? metadata : undefined,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};
