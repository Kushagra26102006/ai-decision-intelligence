"use client";

import { useState } from "react";
import { BookOpen, UploadCloud, Search, FileText, CheckCircle2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";

export default function KnowledgeBase() {
  const { token } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [documents] = useState([
    { name: "Traffic Report 2025.pdf", chunks: 42, date: "Today" },
    { name: "Emergency Guidelines v2.pdf", chunks: 115, date: "Yesterday" },
    { name: "Community Healthcare Mandate.docx", chunks: 28, date: "3 days ago" }
  ]);

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadStatus("Parsing and Chunking...");

    try {
      const res = await fetch("http://localhost:5001/api/knowledge/upload", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ filename: "New_Policy_Document.pdf" })
      });

      if (res.ok) {
        setUploadStatus("Successfully Vectorized and Stored!");
      } else {
        setUploadStatus("Upload failed (Check console/auth)");
      }
    } catch {
      setUploadStatus("Error uploading document");
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus("");
      }, 3000);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
      <div className="p-6 border-b border-white/5 bg-background/80 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-white">Knowledge Engine</h1>
            <p className="text-xs text-slate-400">RAG Semantic Search & Memory</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 z-10 scrollbar-none">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div className="glass-panel p-8 border-dashed hover:border-purple-500/50 flex flex-col items-center justify-center text-center min-h-[300px] transition-all relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 rounded-full bg-background/50 flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-500">
                <UploadCloud className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Ingest New Knowledge</h3>
              <p className="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">
                Upload PDFs, DOCX, or unstructured data. The system will parse, chunk, generate Gemini embeddings, and store them in the vector database.
              </p>
              
              <Button 
                onClick={simulateUpload}
                disabled={isUploading}
                className="bg-purple-600 hover:bg-purple-500 text-white rounded-full px-10 py-6 text-lg font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-105"
              >
                {isUploading ? "Processing..." : "Select Document"}
              </Button>

              {uploadStatus && (
                <div className="mt-6 flex items-center gap-2 text-sm font-bold tracking-wide text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                  {uploadStatus}
                </div>
              )}
            </div>

            {/* Indexed Documents */}
            <div className="glass-panel p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-white flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 shadow-inner">
                    <DatabaseIcon />
                  </div>
                  Indexed Documents
                </h3>
                <div className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  185 Total Chunks
                </div>
              </div>

              <div className="space-y-4">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-white/5 hover:border-purple-500/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 shadow-inner group-hover:bg-purple-500/10 transition-colors">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">{doc.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-1">{doc.chunks} vector chunks • Indexed {doc.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RAG Preview */}
          <div className="mt-8 glass-panel p-8 bg-gradient-to-b from-purple-900/10 to-background/50 border border-purple-500/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Bot className="w-64 h-64" />
            </div>
            
            <h3 className="font-bold text-white mb-3 flex items-center gap-3 text-xl relative z-10">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <Search className="w-5 h-5 text-purple-400" />
              </div>
              Semantic Search Simulation
            </h3>
            <p className="text-sm text-slate-400 mb-8 relative z-10 max-w-2xl leading-relaxed">
              When an Agent processes a query, it performs a Hybrid Search across the Vector DB before generating a response.
            </p>

            <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/5 shadow-inner relative z-10">
              <div className="text-sm font-bold tracking-widest uppercase mb-4 text-purple-400">Mock Retrieved Context (Top-k=3):</div>
              <div className="space-y-4">
                <div className="text-sm text-slate-300 border-l-4 border-purple-500 pl-4 py-1 bg-gradient-to-r from-purple-500/5 to-transparent rounded-r-lg">
                  <span className="font-bold text-white block mb-1">Source: Traffic Report 2025</span>
                  <span className="font-mono text-slate-400">&quot;Traffic on 5th Avenue increases by 38% during heavy rainfall due to inadequate drainage.&quot;</span>
                </div>
                <div className="text-sm text-slate-300 border-l-4 border-purple-500 pl-4 py-1 bg-gradient-to-r from-purple-500/5 to-transparent rounded-r-lg mt-4">
                  <span className="font-bold text-white block mb-1">Source: Emergency Guidelines v2</span>
                  <span className="font-mono text-slate-400">&quot;Flood preparedness policies require deploying auxiliary pumps to Zone A when precipitation exceeds 2 inches.&quot;</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Background Gradients */}
      <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none z-0" />
    </div>
  );
}

function DatabaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
  );
}
