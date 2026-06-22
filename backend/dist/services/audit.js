"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const logAudit = async (userId, action, resource, metadata) => {
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
    }
    catch (error) {
        console.error('Failed to write audit log:', error);
    }
};
exports.logAudit = logAudit;
