"use client";

import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Bell,
  Search
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

const chartData = [
  { name: 'Mon', sentiment: 4000, risk: 2400 },
  { name: 'Tue', sentiment: 3000, risk: 1398 },
  { name: 'Wed', sentiment: 2000, risk: 9800 },
  { name: 'Thu', sentiment: 2780, risk: 3908 },
  { name: 'Fri', sentiment: 1890, risk: 4800 },
  { name: 'Sat', sentiment: 2390, risk: 3800 },
  { name: 'Sun', sentiment: 3490, risk: 4300 },
];

function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} vertical={false} />
        <XAxis dataKey="name" stroke="currentColor" strokeOpacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="currentColor" strokeOpacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', borderRadius: '12px', backdropFilter: 'blur(16px)' }}
          itemStyle={{ color: 'var(--color-foreground)' }}
        />
        <Area type="monotone" dataKey="sentiment" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSentiment)" />
        <Area type="monotone" dataKey="risk" stroke="var(--color-chart-2)" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex-1 flex items-center max-w-2xl">
          <div className="relative w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Ask CommunityAI anything (e.g., 'What is the flood risk in District 4?')" 
              className="w-full bg-slate-900/50 border border-white/10 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-500 text-white backdrop-blur-md shadow-inner"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--color-primary)]"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[2px] cursor-pointer hover:shadow-lg hover:shadow-primary/30 transition-shadow">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <motion.div 
          className="max-w-7xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                Executive Overview
              </h1>
              <p className="text-slate-400 mt-1">Real-time intelligence for your city.</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-lg shadow-primary/20">
              Generate Briefing
            </Button>
          </motion.div>

          {/* KPI Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Community Health Score", value: "86", change: "+4.2%", icon: <Activity className="w-5 h-5 text-emerald-400" />, trend: "up" },
              { label: "Critical Alerts", value: "3", change: "-1", icon: <AlertTriangle className="w-5 h-5 text-rose-400" />, trend: "down" },
              { label: "Active Workflows", value: "142", change: "+12%", icon: <TrendingUp className="w-5 h-5 text-indigo-400" />, trend: "up" },
              { label: "AI Predictions", value: "2,045", change: "+350", icon: <BrainCircuit className="w-5 h-5 text-cyan-400" />, trend: "up" },
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-400 tracking-wide uppercase">{stat.label}</span>
                  <div className="p-2.5 rounded-xl bg-slate-800/50 border border-white/5 shadow-inner">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-end gap-3 mt-4">
                  <span className="text-4xl font-bold tracking-tighter text-white">{stat.value}</span>
                  <span className={`text-sm font-medium mb-1 px-2 py-0.5 rounded-md ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Charts and Insights Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-6 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Sentiment vs. Risk Trend</h3>
                  <p className="text-sm text-slate-400">7-day moving average</p>
                </div>
                <select className="bg-slate-900 border border-white/10 rounded-lg text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white">
                  <option>This Week</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="flex-1 w-full relative">
                <DashboardChart />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-panel p-6 bg-gradient-to-b from-indigo-950/40 to-background/40 border border-indigo-500/20 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <BrainCircuit className="w-48 h-48" />
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_var(--color-primary)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none relative z-10">
                {[
                  { title: "Flood Risk in Zone 4", priority: "High", impact: 92, action: "Deploy Pumps" },
                  { title: "Traffic Congestion Route A", priority: "Medium", impact: 75, action: "Reroute Flow" },
                  { title: "Public Park Maintenance", priority: "Low", impact: 45, action: "Schedule Crew" },
                  { title: "Water Quality Alert", priority: "High", impact: 95, action: "Issue Notice" }
                ].map((rec, i) => (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    key={i} 
                    className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-primary/40 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-slate-200 group-hover:text-primary transition-colors">{rec.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-md font-medium border ${
                        rec.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                        rec.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-slate-500">Impact Score:</div>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${rec.impact}%` }} />
                        </div>
                      </div>
                      <button className="text-xs font-semibold text-primary hover:text-white transition-colors bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary">
                        {rec.action}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
