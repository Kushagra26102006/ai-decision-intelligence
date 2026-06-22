"use client";

import { useState } from "react";
import Link from "next/link";
import { BrainCircuit, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/AuthProvider";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "CITIZEN" }), // default role
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      login(data.token, data.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden py-20">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Request Access</h1>
          <p className="text-slate-400">Join the smart community platform today.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          {error && (
            <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-300">Full Name</Label>
              <Input 
                name="fullName"
                placeholder="John Doe" 
                value={formData.fullName}
                onChange={handleChange}
                required
                className="bg-slate-950/50 border-white/5 text-white h-12 rounded-xl focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Email Address</Label>
              <Input 
                name="email"
                type="email" 
                placeholder="citizen@community.ai" 
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-slate-950/50 border-white/5 text-white h-12 rounded-xl focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Phone Number (Optional)</Label>
              <Input 
                name="phone"
                placeholder="+1 (555) 000-0000" 
                value={formData.phone}
                onChange={handleChange}
                className="bg-slate-950/50 border-white/5 text-white h-12 rounded-xl focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Password</Label>
              <Input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-slate-950/50 border-white/5 text-white h-12 rounded-xl focus-visible:ring-indigo-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-md font-semibold transition-all mt-4 group"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Register Account <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
