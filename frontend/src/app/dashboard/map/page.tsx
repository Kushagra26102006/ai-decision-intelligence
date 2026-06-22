"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  Flame, 
  Trash2, 
  Award, 
  Calendar, 
  Car, 
  Zap, 
  Utensils, 
  PlusCircle, 
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Activity,
  ShieldCheck
} from "lucide-react";

interface ActivityLog {
  _id: string;
  category: "transportation" | "energy" | "diet" | "waste";
  date: string;
  calculatedCarbon: number;
}

// Framer Motion Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export default function Dashboard() {
  const [logs, setLogs] = useState<ActivityLog[]>([
    { _id: "1", category: "transportation", date: "2026-06-22", calculatedCarbon: 15.2 },
    { _id: "2", category: "energy", date: "2026-06-21", calculatedCarbon: 28.4 },
    { _id: "3", category: "diet", date: "2026-06-20", calculatedCarbon: 4.5 },
    { _id: "4", category: "waste", date: "2026-06-19", calculatedCarbon: 8.1 },
  ]);
  const [stats] = useState({
    totalCarbon: 124.5,
    monthlyBudget: 500.0,
    logsCount: 12,
  });
  const loading = false;
  const error = "";

  const handleDeleteLog = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this activity log?")) return;
    setLogs(prev => prev.filter(log => log._id !== id));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "transportation": return <Car className="w-5 h-5" />;
      case "energy": return <Zap className="w-5 h-5" />;
      case "diet": return <Utensils className="w-5 h-5" />;
      case "waste": return <Trash2 className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const budgetPercentage = Math.min(
    Math.round((stats.totalCarbon / stats.monthlyBudget) * 100) || 0,
    100
  );

  const getBudgetBarColor = () => {
    if (stats.totalCarbon > stats.monthlyBudget) return "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]";
    if (stats.totalCarbon > stats.monthlyBudget * 0.75) return "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
    return "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium">Syncing carbon ledger and statistics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      {/* PAGE HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 mt-2">
            Track your footprint, monitor targets, and achieve eco badges
          </p>
        </div>
        <Link 
          href="/log" 
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Log New Activity</span>
        </Link>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STATS MATRIX SECTION */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {/* Total Emissions Card */}
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-slate-900/50 border border-white/5 backdrop-blur-xl p-6 rounded-2xl flex items-center gap-5 group hover:border-white/10 transition-colors"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-[30px] rounded-full -mr-5 -mt-5 pointer-events-none" />
          <div className="p-4 bg-rose-500/15 text-rose-400 rounded-2xl shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-white tracking-tight">{stats.totalCarbon.toFixed(1)} kg</span>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Total Carbon Emitted</span>
          </div>
        </motion.div>

        {/* Budget Limit Card */}
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-slate-900/50 border border-white/5 backdrop-blur-xl p-6 rounded-2xl flex items-center gap-5 group hover:border-white/10 transition-colors"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-[30px] rounded-full -mr-5 -mt-5 pointer-events-none" />
          <div className="p-4 bg-amber-500/15 text-amber-400 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-white tracking-tight">{stats.monthlyBudget.toFixed(0)} kg</span>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Designated Budget</span>
          </div>
        </motion.div>

        {/* Activities Logged Card */}
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-slate-900/50 border border-white/5 backdrop-blur-xl p-6 rounded-2xl flex items-center gap-5 group hover:border-white/10 transition-colors"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[30px] rounded-full -mr-5 -mt-5 pointer-events-none" />
          <div className="p-4 bg-emerald-500/15 text-emerald-400 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-white tracking-tight">{stats.logsCount}</span>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Activities Tracked</span>
          </div>
        </motion.div>
      </motion.div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="relative overflow-hidden bg-slate-900/50 border border-white/5 backdrop-blur-xl p-6 rounded-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full -mr-10 -mt-10 pointer-events-none" />
            <h2 className="text-lg font-bold text-white mb-6 flex justify-between items-center">
              <span>Monthly Budget Utilization</span>
              <span className={`text-sm px-3 py-1 rounded-full font-mono ${
                stats.totalCarbon > stats.monthlyBudget ? "text-rose-400 bg-rose-500/10" : "text-emerald-400 bg-emerald-500/10"
              }`}>
                {budgetPercentage}% used
              </span>
            </h2>

            <div className="space-y-4">
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getBudgetBarColor()}`}
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-slate-400 font-medium">
                <span>{stats.totalCarbon.toFixed(1)} kg CO2e Consumed</span>
                <span>Threshold limit: {stats.monthlyBudget} kg</span>
              </div>
            </div>

            {stats.totalCarbon > stats.monthlyBudget && (
              <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl flex items-center gap-3 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>You have exceeded your carbon budget limit. Commute by bike or reduce heating settings to offset!</span>
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 border border-white/5 backdrop-blur-xl p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Recent Activity Logs</h2>
              <Link 
                href="/analytics" 
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
              >
                <span>Analytics Ledger</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border border-dashed border-white/5 rounded-2xl">
                <p className="text-sm">No recent activity logs.</p>
                <Link href="/log" className="text-emerald-400 text-xs font-bold hover:underline mt-2 inline-block">
                  Add custom activity
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div 
                    key={log._id} 
                    className="flex justify-between items-center p-4 bg-slate-950/40 hover:bg-slate-950/80 border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-900 border border-white/10 text-slate-300 rounded-xl">
                        {getCategoryIcon(log.category)}
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-white capitalize">{log.category}</span>
                        <span className="block text-xs text-slate-400 mt-0.5">
                          {new Date(log.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-white font-mono">{log.calculatedCarbon.toFixed(1)} kg</span>
                      <button 
                        onClick={() => handleDeleteLog(log._id)} 
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: BADGES CABINET */}
        <div className="bg-slate-900/50 border border-white/5 backdrop-blur-xl p-6 rounded-3xl h-fit">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Badges Showcase</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Green Transit Pioneer</span>
                <span className="block text-xs text-slate-400 mt-0.5">Committed 5 low emission rides this week</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Dietary Steward</span>
                <span className="block text-xs text-slate-400 mt-0.5">Logged plant-based diet for 7 days</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-2xl opacity-50 hover:opacity-100 transition-opacity">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Energy Conservator</span>
                <span className="block text-xs text-slate-400 mt-0.5">Keep household energy logs below budget</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}