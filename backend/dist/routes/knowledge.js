"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const documentProcessor_1 = require("../services/documentProcessor");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Only SYSTEM_ADMIN or COMMUNITY_MANAGER can upload knowledge
router.post('/upload', auth_1.authenticate, (0, auth_1.authorize)(['SYSTEM_ADMIN', 'COMMUNITY_MANAGER']), async (req, res) => {
    try {
        // Mock file upload handling (assuming multipart/form-data with a file buffer in reality)
        const filename = req.body.filename || "Community_Guidelines.pdf";
        const rawText = await (0, documentProcessor_1.parseDocumentMock)(Buffer.from(""), filename);
        const chunks = (0, documentProcessor_1.splitIntoChunks)(rawText);
        // In a full implementation, we'd loop through chunks, generate embeddings, and insert.
        // For MVP demonstration:
        console.log(`[Knowledge API] Processed ${filename} into ${chunks.length} chunks.`);
        // const embeddedChunks = await Promise.all(chunks.map(async (c) => ({
        //   content: c,
        //   metadata: { source: filename },
        //   embedding: await generateEmbedding(c)
        // })));
        // Insert into Prisma using raw SQL for the Unsupported vector type...
        res.json({ message: 'Document successfully ingested and vectorized', chunksProcessed: chunks.length });
    }
    catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to process document' });
    }
});
exports.default = router;
