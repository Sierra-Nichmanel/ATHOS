'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-container/40 via-transparent to-transparent" />
        
        <Link href="/" className="flex items-center gap-2.5 z-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-primary font-black text-xl italic">A</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Africentric <span className="text-white/70">OS</span>
          </span>
        </Link>

        <div className="z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              Welcome back to <br/> your command center.
            </h2>
            <p className="text-white/70 text-lg max-w-md">
              Secure access to your sales, inventory, and financial insights.
            </p>
          </motion.div>
        </div>

        <div className="z-10 flex items-center gap-4 text-white/50 text-sm font-bold uppercase tracking-widest">
          <ShieldCheck className="h-5 w-5" />
          Bank-Grade Security
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center px-6 md:px-24 lg:px-32 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-8 font-bold transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-on-background mb-3">Sign In</h1>
            <p className="text-on-surface-variant">Enter your credentials to manage your business.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-semibold"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant/40" />
                <input 
                  type="email"
                  required
                  placeholder="name@business.com"
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant/40" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-container shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Access OS <ArrowRight className="h-6 w-6" />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-on-surface-variant font-medium">
            New to Africentric? <Link href="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
