"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  BrainCircuit, 
  AlertTriangle, 
  Users, 
  MessageSquare,
  BookOpen,
  Database,
  GitPullRequestDraft,
  Map as MapIcon,
  Sparkles
} from "lucide-react";
import clsx from "clsx";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { section: "Intelligence" },
    { name: "Executive Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "AI Command Center", href: "/dashboard/command-center", icon: Sparkles },
    { name: "Digital Twin", href: "/dashboard/map", icon: MapIcon },
    { name: "Prediction Radar", href: "/dashboard/risk-radar", icon: AlertTriangle },
    { section: "Operations" },
    { name: "Workflow Builder", href: "/dashboard/operations", icon: GitPullRequestDraft },
    { name: "Data Pipeline", href: "/dashboard/data", icon: Database },
    { name: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
    { section: "Engagement" },
    { name: "Citizen Portal", href: "/citizen", icon: Users },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: MessageSquare },
  ];

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 border-r border-white/5 bg-background/50 backdrop-blur-2xl hidden md:flex flex-col z-50 relative shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
    >
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            CommunityAI
          </span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-none">
        {navItems.map((item, index) => {
          if (item.section) {
            return (
              <div key={index} className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2 px-3">
                {item.section}
              </div>
            );
          }
          
          const isActive = pathname === item.href;
          const Icon = item.icon!;
          
          return (
            <Link 
              key={item.href} 
              href={item.href!}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative overflow-hidden group",
                isActive 
                  ? "text-white" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={clsx("w-5 h-5 relative z-10", isActive ? "text-indigo-400" : "group-hover:text-indigo-400 transition-colors")} />
              <span className="relative z-10 font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
