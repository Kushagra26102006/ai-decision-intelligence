export const splitIntoChunks = (text: string, chunkSize: number = 512, overlap: number = 50): string[] => {
  // Simple token-based (approximate via words) chunker for MVP
  const words = text.split(/\\s+/);
  const chunks: string[] = [];
  
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);
    i += (chunkSize - overlap);
  }
  
  return chunks;
};

export const parseDocumentMock = async (fileBuffer: Buffer, filename: string): Promise<string> => {
  // In a real implementation, this would use pdf-parse, Google Cloud Vision, etc.
  // For MVP, we'll just return a mock string.
  return `This is the extracted content from ${filename}. It discusses community policies, traffic regulations, and healthcare guidelines.`;
};
