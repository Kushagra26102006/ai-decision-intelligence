"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, TrendingUp, ShieldAlert, Activity, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

interface Forecast {
  id: string;
  domain: string;
  riskScore: number;
  prediction: string;
  confidence: number;
  factors: string[];
  recommendations: string[];
  createdAt: string;
}

export default function RiskRadarDashboard() {
  const { token } = useAuth();
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/analytics/forecasts", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setForecasts(data.forecasts || []);
        }
      } catch (error) {
        console.error("Failed to fetch forecasts", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchForecasts();
    
    // Poll every 10 seconds for MVP demo
    const interval = setInterval(fetchForecasts, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const overall = forecasts.find(f => f.domain === 'OVERALL');
  const domains = forecasts.filter(f => f.domain !== 'OVERALL');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
      <div className="p-6 border-b border-white/5 bg-background/80 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-white">Predictive Risk Radar</h1>
            <p className="text-xs text-slate-400">Forecasting anomalies and generating prescriptive recommendations</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 z-10 scrollbar-none">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Community Well-Being Index */}
          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white">
                  <Activity className="w-6 h-6 text-emerald-400" />
                  Community Well-Being Index
                </h2>
                <p className="text-slate-400 max-w-lg text-sm">
                  {overall?.prediction || "Aggregating historical and real-time data to calculate community health."}
                </p>
                {overall?.factors && overall.factors.length > 0 && (
                  <div className="mt-4 flex gap-2 text-xs">
                    <span className="text-slate-500">Based on:</span>
                    <span className="text-emerald-400">{overall.factors.join(', ')}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" className="stroke-slate-800" strokeWidth="10" fill="none" />
                    <circle 
                      cx="50" cy="50" r="45" 
                      className="stroke-emerald-500 transition-all duration-1000" 
                      strokeWidth="10" fill="none" 
                      strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * (100 - (overall?.riskScore || 50))) / 100}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{100 - (overall?.riskScore || 50)}</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Risk Cards */}
          <h3 className="font-semibold text-lg pt-4 text-white">Domain Risk Forecasts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {isLoading && !domains.length && (
              <div className="col-span-3 text-center p-12 text-slate-500 animate-pulse glass-panel">
                Generating high-fidelity forecasts...
              </div>
            )}

            {domains.map((forecast) => {
              const isHighRisk = forecast.riskScore > 65;
              const isMediumRisk = forecast.riskScore > 40 && forecast.riskScore <= 65;
              
              return (
                <div key={forecast.id} className="glass-panel p-6 flex flex-col hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-bold tracking-wider text-slate-300 uppercase">{forecast.domain}</div>
                    <div className={`px-2 py-1 rounded text-xs font-bold shadow-inner
                      ${isHighRisk ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                        isMediumRisk ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                      Risk: {forecast.riskScore}/100
                    </div>
                  </div>
                  
                  <div className="mb-6 flex-1">
                    <div className={`text-lg font-medium mb-2 ${isHighRisk ? 'text-rose-100' : 'text-white'}`}>
                      {forecast.prediction}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                      <TrendingUp className="w-3 h-3" />
                      {forecast.confidence}% Confidence
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">Contributing Factors</span>
                      <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc marker:text-primary">
                        {forecast.factors?.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                    
                    <div className={`p-4 rounded-xl border shadow-inner ${isHighRisk ? 'bg-rose-500/10 border-rose-500/30' : 'bg-background/50 border-white/10'}`}>
                      <span className={`text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5 ${isHighRisk ? 'text-rose-400' : 'text-primary'}`}>
                        <ShieldAlert className="w-3 h-3" /> Prescriptive Action
                      </span>
                      <ul className="text-xs text-slate-200 space-y-2">
                        {forecast.recommendations?.map((r, i) => (
                           <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isHighRisk ? 'text-rose-400' : 'text-primary'}`} />
                            <span className="leading-relaxed">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      
      {/* Background Gradients */}
      <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-rose-600/5 blur-[120px] pointer-events-none" />
    </div>
  );
}
