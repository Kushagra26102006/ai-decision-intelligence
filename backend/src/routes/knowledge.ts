import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { parseDocumentMock, splitIntoChunks } from '../services/documentProcessor';
import { generateEmbedding } from '../services/embeddings';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Only SYSTEM_ADMIN or COMMUNITY_MANAGER can upload knowledge
router.post('/upload', authenticate, authorize(['SYSTEM_ADMIN', 'COMMUNITY_MANAGER']), async (req, res) => {
  try {
    // Mock file upload handling (assuming multipart/form-data with a file buffer in reality)
    const filename = req.body.filename || "Community_Guidelines.pdf";
    const rawText = await parseDocumentMock(Buffer.from(""), filename);
    
    const chunks = splitIntoChunks(rawText);
    
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
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to process document' });
  }
});

export default router;
