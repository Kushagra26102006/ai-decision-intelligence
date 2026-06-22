"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Brain, 
  Shield, 
  Map as MapIcon,
  LineChart,
  Network,
  Cpu,
  Globe
} from "lucide-react";
import { useRef } from "react";

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30" ref={targetRef}>
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-2xl"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all duration-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-gradient">CommunityAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-300">
            <Link href="#platform" className="hover:text-white transition-colors">Platform</Link>
            <Link href="#solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link href="#impact" className="hover:text-white transition-colors">Impact</Link>
            <Link href="#technology" className="hover:text-white transition-colors">Technology</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4">Sign In</Link>
            <Link href="/dashboard">
              <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-6 h-11 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-105">
                Launch Platform
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative pt-40 pb-32 px-6 overflow-hidden">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 text-primary text-sm font-bold tracking-wide uppercase shadow-[0_0_20px_var(--color-primary)]"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              The Operating System for Smart Communities
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]"
            >
              Mission Control for <br className="hidden md:block" />
              <span className="text-gradient">Tomorrow&apos;s Cities.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              CommunityAI transforms raw urban data into real-time, actionable intelligence. Shift your community from reactive responses to predictive mastery.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10"
            >
              <Link href="/dashboard">
                <Button size="lg" className="h-16 px-10 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-lg shadow-[0_0_40px_var(--color-primary)] transition-all hover:scale-105 duration-300">
                  Enter Command Center <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-16 px-10 border-white/20 text-white hover:bg-white/5 rounded-full font-bold text-lg glass">
                View Interactive Demo
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Abstract 3D Hero Visual Element */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[120vw] h-[100vh] -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_50%)] opacity-20 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] border-t border-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)] flex justify-center items-start pt-10">
            {/* Mock Digital Twin Grid */}
            <div className="w-[80%] h-full" style={{ 
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '100px 100px',
              transform: 'perspective(1000px) rotateX(60deg) scale(2)',
              transformOrigin: 'top center'
            }}></div>
          </div>
        </div>
      </main>

      {/* Impact Metrics Section */}
      <section className="py-24 relative z-20 border-y border-white/5 bg-background/50 backdrop-blur-3xl">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-white/5">
            {[
              { value: "40%", label: "Faster Emergency Response" },
              { value: "2M+", label: "Citizen Data Points Analyzed" },
              { value: "85%", label: "Accuracy in Risk Forecasting" },
              { value: "24/7", label: "Autonomous Infrastructure Monitoring" }
            ].map((metric, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center p-4"
              >
                <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-4">{metric.value}</div>
                <div className="text-slate-400 font-medium text-lg uppercase tracking-wider">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="platform" className="py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">A Platform Built for <span className="text-primary">Impact.</span></h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Discover the suite of tools powering the next generation of community management and citizen engagement.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8 text-primary" />,
                title: "AI Command Center",
                description: "Interact with your community's data through an advanced conversational interface. Ask complex questions, get instant insights."
              },
              {
                icon: <MapIcon className="w-8 h-8 text-cyan-400" />,
                title: "Digital Twin Mapping",
                description: "Visualize traffic, weather, and risks on a fully interactive 3D spatial map of your entire urban environment."
              },
              {
                icon: <LineChart className="w-8 h-8 text-emerald-400" />,
                title: "Executive Dashboards",
                description: "Customizable, drag-and-drop widget boards displaying real-time metrics, KPI scores, and AI-driven recommendations."
              },
              {
                icon: <Shield className="w-8 h-8 text-rose-400" />,
                title: "Risk Prediction Radar",
                description: "Forecast floods, traffic jams, and utility failures before they happen with high-confidence machine learning models."
              },
              {
                icon: <Network className="w-8 h-8 text-indigo-400" />,
                title: "Workflow Automation",
                description: "Visually build automated standard operating procedures (SOPs) that trigger instantly when critical events occur."
              },
              {
                icon: <Globe className="w-8 h-8 text-amber-400" />,
                title: "Citizen Intelligence",
                description: "Aggregate citizen complaints, social sentiment, and IoT sensors into a single, unified health score for your city."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-panel p-10 hover:border-primary/50 transition-colors group cursor-default"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 blur-[100px]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-panel p-16 md:p-24 border-primary/30"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Ready to upgrade your city?</h2>
            <p className="text-2xl text-slate-300 mb-12">Join the municipalities already leveraging CommunityAI to build safer, smarter, and more resilient environments.</p>
            <Link href="/dashboard">
              <Button size="lg" className="h-16 px-12 bg-white text-black hover:bg-slate-200 rounded-full font-bold text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 duration-300">
                Launch Platform Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-background py-12 text-center text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-primary" />
          <span className="font-bold tracking-tight text-white">CommunityAI</span>
        </div>
        <p>© 2026 CommunityAI. Built for the Future.</p>
      </footer>
    </div>
  );
}
