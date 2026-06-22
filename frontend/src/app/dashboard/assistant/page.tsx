"use client";

import { useState } from "react";
import { Send, Bot, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentMessage } from "@/components/chat/AgentMessage";
import { useAuth } from "@/components/providers/AuthProvider";

interface Message {
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  reasoning?: string;
  sources?: string[];
}

export default function AssistantPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am the CommunityAI Orchestrator. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Mock network latency for realism if no token is available for the backend
      const res = await fetch("http://localhost:5001/api/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: input, sessionId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      setSessionId(data.sessionId);

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.result.insight,
        confidence: data.result.confidence,
        reasoning: data.result.reasoning,
        sources: data.result.sources
      }]);

    } catch (err: unknown) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: err instanceof Error ? err.message : String(err)
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-slate-950 text-slate-50 relative">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-slate-950/80 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold">AI Intelligence Assistant</h1>
            <p className="text-xs text-slate-400">Powered by Gemini & Multi-Agent Architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          All Agents Online
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth z-10">
        <div className="max-w-4xl mx-auto">
          {!token && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-200">
                <span className="font-semibold block mb-1">Authentication Required</span>
                You are currently viewing this page without being logged in. Please log in to securely communicate with the AI endpoints.
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <AgentMessage
              key={i}
              role={msg.role}
              content={msg.content}
              confidence={msg.confidence}
              reasoning={msg.reasoning}
              sources={msg.sources}
            />
          ))}

          {isLoading && (
            <div className="flex gap-4 w-full justify-start mb-6 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-slate-950/80 backdrop-blur-md border-t border-white/5 z-10">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about traffic, environment, or report an issue..."
            className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-6 pr-16 py-4 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm placeholder:text-slate-500"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-indigo-600 hover:bg-indigo-500 w-10 h-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none z-0" />
    </div>
  );
}
