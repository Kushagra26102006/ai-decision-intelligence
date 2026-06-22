"use client";

import { useState } from "react";
import { Send, UploadCloud, AlertCircle, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CitizenPortal() {
  const [issueType, setIssueType] = useState('Pothole / Road Damage');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send to Data Ingestion Pipeline API
      const res = await fetch("http://localhost:5001/api/data/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "citizen_app",
          eventType: "complaint",
          payload: {
            issueType,
            description,
            location: { lat: 40.7128, lng: -74.0060 }, // Mock location
            timestamp: new Date().toISOString()
          }
        })
      });

      if (res.ok) {
        setSuccess(true);
        setDescription('');
      }
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-md w-full glass-panel p-10 text-center relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/30">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-white">Issue Reported!</h2>
          <p className="text-slate-400 mb-10 leading-relaxed">
            Thank you for helping keep the community safe. <span className="text-primary font-semibold">CommunityAI</span> is currently analyzing your report and notifying the responsible department.
          </p>
          <Button 
            onClick={() => setSuccess(false)}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-7 font-bold text-lg shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all hover:scale-105"
          >
            Report Another Issue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full mb-10 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-primary/20 text-primary rounded-2xl mb-6 shadow-[0_0_20px_rgba(var(--primary),0.3)] border border-primary/30">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white mb-3">Community Connect</h1>
        <p className="text-slate-400 font-medium">Report issues directly to your local AI administration.</p>
      </div>

      <div className="max-w-md w-full glass-panel overflow-hidden relative z-10 shadow-2xl">
        <div className="p-8 bg-gradient-to-br from-primary/20 to-transparent border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 blur-[40px] rounded-full -mr-16 -mt-16 pointer-events-none" />
          <h2 className="font-bold text-2xl text-white relative z-10">
            New Incident Report
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-bold tracking-widest uppercase text-slate-400">Issue Category</label>
            <div className="relative">
              <select 
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer hover:bg-white/5"
              >
                <option className="bg-slate-900">Pothole / Road Damage</option>
                <option className="bg-slate-900">Water Leak / Flooding</option>
                <option className="bg-slate-900">Streetlight Outage</option>
                <option className="bg-slate-900">Waste Collection</option>
                <option className="bg-slate-900">Public Safety Concern</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold tracking-widest uppercase text-slate-400">Location</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10" />
              <input 
                type="text" 
                readOnly
                value="Current Location (GPS Active)"
                className="w-full bg-primary/10 border border-primary/30 rounded-xl pl-12 pr-5 py-4 text-sm text-primary font-medium cursor-not-allowed relative z-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold tracking-widest uppercase text-slate-400">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
              rows={4}
              required
              className="w-full bg-background/50 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none hover:bg-white/5"
            />
          </div>

          <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-white/5 hover:border-primary/50 cursor-pointer transition-all group">
            <div className="w-14 h-14 rounded-full bg-background/50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
              <UploadCloud className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-bold tracking-wide">Tap to upload a photo</span>
          </div>

          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-8 font-black tracking-widest text-lg shadow-[0_0_20px_rgba(var(--primary),0.4)] flex items-center justify-center gap-3 transition-all hover:scale-105"
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT REPORT"} <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>

    </div>
  );
}
