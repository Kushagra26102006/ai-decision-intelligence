"use client";

import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/4 w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none z-0" />
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto z-10 scrollbar-none relative">
          {children}
        </div>
      </div>
    </div>
  );
}
