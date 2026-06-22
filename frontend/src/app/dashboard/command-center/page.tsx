"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
  Send, 
  Mic, 
  Map as MapIcon, 
  AlertTriangle,
  Lightbulb,
  FileText,
  Activity,
  Maximize2
} from "lucide-react";

export default function CommandCenter() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to the AI Command Center. I am monitoring 4,203 active sensors across the community. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    
    // Mock AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I've analyzed the current data. The flood risk in District 4 has increased by 15% due to recent heavy rainfall. I recommend deploying 2 auxiliary water pumps to the sector.` 
      }]);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-background">
      {/* Left Column: AI Chat Interface */}
      <div className="w-full md:w-1/3 border-r border-white/5 flex flex-col h-full bg-slate-950/30 backdrop-blur-md relative z-10">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-background/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_10px_var(--color-primary)]">
              <BrainCircuit className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Community Copilot</h2>
              <p className="text-[10px] text-emerald-400 font-medium tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                SYSTEM ACTIVE
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none shadow-[0_4px_20px_rgba(99,102,241,0.3)]' 
                    : 'bg-slate-900 border border-white/5 text-slate-200 rounded-bl-none shadow-lg'
                }`}>
                  {msg.content}
                  
                  {msg.role === 'assistant' && i === messages.length - 1 && messages.length > 1 && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                      <button className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded hover:bg-emerald-500 hover:text-white transition-colors">
                        Approve Action
                      </button>
                      <button className="text-xs bg-white/5 text-slate-400 border border-white/10 px-2 py-1 rounded hover:bg-white/10 transition-colors">
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-background/50 border-t border-white/5">
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-none pb-1">
            {["Show traffic status", "Flood risks today", "Analyze hospital capacity"].map((suggestion, i) => (
              <button key={i} onClick={() => setInput(suggestion)} className="whitespace-nowrap text-xs bg-slate-900 border border-white/5 text-slate-400 px-3 py-1.5 rounded-full hover:border-primary/50 hover:text-white transition-colors">
                {suggestion}
              </button>
            ))}
          </div>
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Command the AI..." 
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm focus:outline-none focus:border-primary/50 text-white shadow-inner"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button className="p-2 text-slate-500 hover:text-white transition-colors">
                <Mic className="w-4 h-4" />
              </button>
              <button onClick={handleSend} className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Spatial & Insight Workspace (The "Notion + Maps" part) */}
      <div className="w-full md:w-2/3 h-full flex flex-col bg-slate-950 relative overflow-hidden">
        
        {/* Dynamic 3D Map Mock Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-10 blur-[80px]"></div>
          <div className="w-full h-full" style={{ 
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            transform: 'perspective(1000px) rotateX(45deg) scale(2) translateY(-10%)',
            transformOrigin: 'top center'
          }}></div>
        </div>

        <div className="flex-1 p-6 z-10 overflow-y-auto scrollbar-none flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <MapIcon className="w-6 h-6 text-primary" />
              Spatial Intelligence
            </h1>
            <button className="p-2 bg-slate-900 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-panel p-6 border-l-4 border-l-rose-500 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white">Active Anomalies</h3>
              </div>
              <ul className="space-y-3">
                <li className="text-sm text-slate-300 flex items-center justify-between">
                  <span>District 4 Water Level</span>
                  <span className="text-rose-400 font-mono">+1.2m</span>
                </li>
                <li className="text-sm text-slate-300 flex items-center justify-between">
                  <span>Sector B Traffic</span>
                  <span className="text-amber-400 font-mono">Standstill</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-emerald-500 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white">System Operations</h3>
              </div>
              <ul className="space-y-3">
                <li className="text-sm text-slate-300 flex items-center justify-between">
                  <span>IoT Sensors Online</span>
                  <span className="text-emerald-400 font-mono">99.8%</span>
                </li>
                <li className="text-sm text-slate-300 flex items-center justify-between">
                  <span>AI Inference Latency</span>
                  <span className="text-emerald-400 font-mono">42ms</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-6 flex-1 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
              <Lightbulb className="w-64 h-64" />
            </div>
            
            <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Live Strategic Insights
            </h3>
            
            <div className="flex-1 border border-white/5 bg-slate-950/50 rounded-xl p-6 font-mono text-sm text-slate-300 leading-relaxed overflow-y-auto">
              <p className="mb-4 text-emerald-400">&gt; Processing multi-modal data streams...</p>
              <p className="mb-2">- [WEATHER] Heavy rainfall expected continuously for next 6 hours.</p>
              <p className="mb-2">- [TRAFFIC] Congestion forming on Main Arterial Route due to minor flooding.</p>
              <p className="mb-2">- [SOCIAL] 145 complaints registered via Citizen App regarding waterlogging in District 4.</p>
              <p className="mb-4 text-amber-400">&gt; Correlation detected. Risk probability elevated to 88%.</p>
              <p className="mb-2 text-primary font-bold">RECOMMENDED ACTION STRATEGY:</p>
              <p className="mb-1">1. Dispatch Municipal Pump Team Alpha to Coordinates 45.2, -12.4</p>
              <p className="mb-1">2. Automatically reroute city buses away from Main Arterial via Smart Traffic Lights.</p>
              <p className="mb-1">3. Issue localized push-notification warning to citizens in District 4.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
