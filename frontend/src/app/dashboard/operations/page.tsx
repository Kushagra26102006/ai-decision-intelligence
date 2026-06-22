"use client";

import { useState, useEffect } from "react";
import { GitPullRequestDraft, ShieldCheck, Clock, CheckCircle2, AlertCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";

interface WorkflowStep {
  action: string;
  status: "PENDING" | "COMPLETED";
  timestamp: string | null;
}

interface Workflow {
  id: string;
  triggerSource: string;
  workflowType: string;
  status: "ACTIVE" | "PENDING_APPROVAL" | "COMPLETED" | "ESCALATED" | "FAILED";
  steps: WorkflowStep[];
  pendingApproval: string | null;
  createdAt: string;
}

export default function OperationsDashboard() {
  const { token } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isApproving, setIsApproving] = useState<string | null>(null);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/operations/workflows", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data.workflows);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkflows();
    const interval = setInterval(fetchWorkflows, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleApprove = async (workflowId: string) => {
    setIsApproving(workflowId);
    try {
      await fetch(`http://localhost:5001/api/operations/workflows/${workflowId}/approve`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ stepAction: "Deploy Emergency Resources / Adjust Budget" }) // Hardcoded for MVP matching
      });
      fetchWorkflows();
    } finally {
      setIsApproving(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
      <div className="p-6 border-b border-white/5 bg-background/80 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <GitPullRequestDraft className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-white">Community Operations</h1>
            <p className="text-xs text-slate-400">Autonomous Workflow Engine & Approvals</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 z-10 scrollbar-none">
        <div className="max-w-5xl mx-auto space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4">Active Workflows</span>
              <span className="text-5xl font-black text-white">{workflows.filter(w => w.status !== 'COMPLETED').length}</span>
            </div>
            <div className="glass-panel p-6 flex flex-col border border-amber-500/20 hover:border-amber-500/40 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[30px] rounded-full -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-colors" />
              <span className="text-sm font-bold tracking-widest uppercase text-amber-400 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Pending Approvals
              </span>
              <span className="text-5xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                {workflows.filter(w => w.status === 'PENDING_APPROVAL').length}
              </span>
            </div>
            <div className="glass-panel p-6 flex flex-col border border-emerald-500/20 hover:border-emerald-500/40 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[30px] rounded-full -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors" />
              <span className="text-sm font-bold tracking-widest uppercase text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Automation SLA
              </span>
              <span className="text-5xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">99.8%</span>
            </div>
          </div>

          <h3 className="font-bold text-xl text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <PlayCircle className="w-5 h-5 text-indigo-400" />
            </div>
            Active Executions
          </h3>

          <div className="space-y-6">
            {workflows.length === 0 && (
              <div className="p-10 text-center text-slate-400 glass-panel border-dashed border-white/20">
                No active workflows. Wait for an event to trigger or simulate an ingestion from the Data Pipeline.
              </div>
            )}

            {workflows.map(workflow => (
              <div key={workflow.id} className="glass-panel p-8 hover:border-primary/30 transition-colors relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  workflow.status === 'PENDING_APPROVAL' ? 'bg-amber-500' : 
                  workflow.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-indigo-500'
                }`} />
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-xs font-mono font-bold tracking-wider text-slate-500 mb-2 uppercase">ID: {workflow.id}</div>
                    <div className="font-bold text-xl text-white">{workflow.workflowType.replace('SOP_', '').replace(/_/g, ' ')}</div>
                    <div className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                      Trigger: {workflow.triggerSource}
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-inner
                    ${workflow.status === 'PENDING_APPROVAL' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                      workflow.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                      'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}
                  >
                    {workflow.status === 'PENDING_APPROVAL' && <Clock className="w-4 h-4 animate-pulse" />}
                    {workflow.status === 'COMPLETED' && <CheckCircle2 className="w-4 h-4" />}
                    {workflow.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="space-y-4 pl-4 border-l-2 border-white/10 ml-2 relative">
                  {workflow.steps.map((step, idx) => (
                    <div key={idx} className="relative pl-8 pb-4">
                      <div className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 bg-background shadow-lg
                        ${step.status === 'COMPLETED' ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} 
                      />
                      <div className={`text-sm ${step.status === 'COMPLETED' ? 'text-slate-400' : 'text-amber-400 font-bold'}`}>
                        {step.action}
                      </div>
                      
                      {step.status === 'PENDING' && workflow.status === 'PENDING_APPROVAL' && (
                        <div className="mt-4 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 shadow-inner">
                          <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                            <div>
                              <div className="text-sm font-bold tracking-wide text-amber-400 mb-1">Human-in-the-Loop Required</div>
                              <div className="text-xs text-amber-200/70 mb-4 font-medium">This action requires explicit authorization from a Community Administrator.</div>
                              <Button 
                                onClick={() => handleApprove(workflow.id)}
                                disabled={isApproving === workflow.id}
                                className="bg-amber-500 hover:bg-amber-400 text-black text-xs px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all hover:scale-105"
                              >
                                {isApproving === workflow.id ? 'Authorizing...' : 'Authorize Action'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      
      {/* Background Gradients */}
      <div className="absolute top-[10%] left-[40%] w-[30%] h-[30%] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none z-0" />
    </div>
  );
}
