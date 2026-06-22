"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDocumentMock = exports.splitIntoChunks = void 0;
const splitIntoChunks = (text, chunkSize = 512, overlap = 50) => {
    // Simple token-based (approximate via words) chunker for MVP
    const words = text.split(/\\s+/);
    const chunks = [];
    let i = 0;
    while (i < words.length) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        chunks.push(chunk);
        i += (chunkSize - overlap);
    }
    return chunks;
};
exports.splitIntoChunks = splitIntoChunks;
const parseDocumentMock = async (fileBuffer, filename) => {
    // In a real implementation, this would use pdf-parse, Google Cloud Vision, etc.
    // For MVP, we'll just return a mock string.
    return `This is the extracted content from ${filename}. It discusses community policies, traffic regulations, and healthcare guidelines.`;
};
exports.parseDocumentMock = parseDocumentMock;
