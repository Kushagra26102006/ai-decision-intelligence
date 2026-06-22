"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hybridSearch = void 0;
const client_1 = require("@prisma/client");
const embeddings_1 = require("./embeddings");
const prisma = new client_1.PrismaClient();
const hybridSearch = async (query, limit = 3) => {
    try {
        const queryEmbedding = await (0, embeddings_1.generateEmbedding)(query);
        // For MVP without active pgvector running locally, we will fallback to a mocked retrieval
        // In production, the raw SQL query would look like:
        // const results = await prisma.$queryRaw`
        //   SELECT id, content, metadata, 1 - (embedding <=> ${queryEmbedding}::vector) as similarity
        //   FROM "DocumentChunk"
        //   ORDER BY embedding <=> ${queryEmbedding}::vector LIMIT ${limit};
        // `;
        console.log('[RAG] Performing Hybrid Search for:', query);
        // Mock response assuming the database has these chunks
        const mockResults = [
            {
                content: "Traffic on 5th Avenue increases by 38% during heavy rainfall.",
                metadata: { source: "Traffic Report 2025" }
            },
            {
                content: "Flood preparedness policies require deploying pumps to Zone A.",
                metadata: { source: "Emergency Guidelines v2" }
            }
        ];
        return mockResults;
    }
    catch (error) {
        console.error('RAG Search Error:', error);
        return [];
    }
};
exports.hybridSearch = hybridSearch;
