import React, { useState } from 'react';
import { BrainCircuit, User, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface AgentMessageProps {
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  reasoning?: string;
  sources?: string[];
}

export function AgentMessage({ role, content, confidence, reasoning, sources }: AgentMessageProps) {
  const [showXAI, setShowXAI] = useState(false);
  const isAssistant = role === 'assistant';

  return (
    <div className={`flex gap-4 w-full ${isAssistant ? 'justify-start' : 'justify-end'} mb-6`}>
      {isAssistant && (
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
        </div>
      )}
      
      <div className={`max-w-[80%] rounded-2xl p-5 ${
        isAssistant 
          ? 'bg-slate-900/50 border border-white/5 backdrop-blur-md' 
          : 'bg-indigo-600 text-white'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

        {isAssistant && confidence !== undefined && reasoning && (
          <div className="mt-4 border-t border-white/10 pt-4">
            <button 
              onClick={() => setShowXAI(!showXAI)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              {showXAI ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Explainable AI (XAI) Trace
            </button>
            
            {showXAI && (
              <div className="mt-4 space-y-4 bg-slate-950/50 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Confidence Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${confidence > 80 ? 'bg-emerald-500' : confidence > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold">{confidence}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">Agent Reasoning</span>
                  <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-indigo-500/50 pl-3">
                    {reasoning}
                  </p>
                </div>

                {sources && sources.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-2">Grounded Sources</span>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((src, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {src}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-slate-400" />
        </div>
      )}
    </div>
  );
}
