"use client";

import { useState } from "react";
import { Database, Activity, GitCommit, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MockEvent {
  id: string;
  source: string;
  type: string;
  status: "PENDING" | "PROCESSING" | "ENRICHED";
  time: string;
}

export default function DataPipelineDashboard() {
  const [events, setEvents] = useState<MockEvent[]>([
    { id: "evt_1a2b", source: "citizen_app", type: "complaint", status: "ENRICHED", time: "Just now" },
    { id: "evt_3c4d", source: "iot_sensor_44", type: "traffic_update", status: "PROCESSING", time: "2m ago" },
    { id: "evt_5e6f", source: "weather_api", type: "air_quality", status: "PENDING", time: "5m ago" },
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateIngestion = async () => {
    setIsSimulating(true);
    try {
      const payload = {
        source: "citizen_app",
        eventType: "complaint",
        payload: { text: "Huge pothole on 5th Avenue causing traffic jams.", location: "5th Ave" }
      };
      
      const res = await fetch("http://localhost:5001/api/data/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        setEvents(prev => [
          { id: data.eventId.substring(0,8), source: payload.source, type: payload.eventType, status: "PENDING", time: "Just now" },
          ...prev
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-background text-foreground">
      <div className="p-6 border-b border-white/5 bg-background/80 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-white">Data Intelligence Pipeline</h1>
            <p className="text-xs text-slate-400">Real-time Pub/Sub Stream & AI Enrichment</p>
          </div>
        </div>
        
        <Button 
          onClick={simulateIngestion}
          disabled={isSimulating}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-6 font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
        >
          {isSimulating ? "Publishing..." : "Simulate IoT Event"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 z-10 scrollbar-none">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Pipeline Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-slate-400 block mb-2">Ingestion Rate</span>
                <span className="text-4xl font-black text-white group-hover:text-emerald-400 transition-colors">142<span className="text-sm text-slate-500 font-normal"> /sec</span></span>
              </div>
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <Activity className="w-7 h-7" />
              </div>
            </div>
            <div className="glass-panel p-6 flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-slate-400 block mb-2">Active Streams</span>
                <span className="text-4xl font-black text-white group-hover:text-cyan-400 transition-colors">8</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
                <GitCommit className="w-7 h-7" />
              </div>
            </div>
            <div className="glass-panel p-6 flex items-center justify-between group hover:border-amber-500/30 transition-colors">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-slate-400 block mb-2">AI Enrichment Queue</span>
                <span className="text-4xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">12</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                <AlertCircle className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Live Event Stream */}
          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[60px] rounded-bl-full pointer-events-none -mt-10 -mr-10" />
            <h3 className="font-bold text-white mb-6 flex items-center gap-3 text-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              Live Event Stream
            </h3>
            
            <div className="space-y-4">
              {events.map((evt, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-background/50 border border-white/5 hover:border-white/20 transition-colors group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 text-xs font-mono border border-white/5 shadow-inner group-hover:bg-slate-800 transition-colors">
                      {evt.id}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-3 mb-1">
                        {evt.source}
                        <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase text-slate-400 tracking-wider">
                          {evt.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{evt.time}</div>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-inner border
                    ${evt.status === 'ENRICHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                      evt.status === 'PROCESSING' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}
                  >
                    {evt.status === 'ENRICHED' && <CheckCircle2 className="w-4 h-4" />}
                    {evt.status === 'PROCESSING' && <Activity className="w-4 h-4 animate-spin" />}
                    {evt.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none z-0" />
    </div>
  );
}
