'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  ChevronLeft,
  Store,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    businessName: '',
    industry: 'Retail & Sales',
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.fullName }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { data: bizData, error: bizError } = await supabase
          .from('businesses')
          .insert({
            name: formData.businessName,
            business_type: formData.industry,
            owner_id: authData.user.id
          })
          .select()
          .single();

        if (bizError) throw bizError;

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            business_id: bizData.id,
            role: 'owner'
          });

        if (profileError) throw profileError;
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col lg:flex-row">
      {/* Visual Identity Layer */}
      <div className="hidden lg:flex lg:w-1/2 bg-on-background p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary blur-[120px]" />
        </div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform shadow-xl shadow-primary/20">
              <span className="text-white font-black text-2xl italic">A</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">AFRICENTRIC</span>
          </Link>
          
          <div className="mt-32 max-w-md">
            <h1 className="text-6xl font-black text-white leading-tight tracking-tighter">
              Orchestrate <br />
              <span className="text-primary italic">Sovereignty.</span>
            </h1>
            <p className="text-white/40 text-lg font-medium mt-8 leading-relaxed">
              Join the elite circle of businesses operating with absolute precision and African ingenuity.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-widest">Enterprise Ready</p>
              <p className="text-white/40 text-xs font-bold mt-1">Multi-tenant architecture with high-security protocols.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orchestration Layer (Form) */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20 bg-white">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <div className={cn("w-2 h-2 rounded-full transition-all duration-500", step === 1 ? "bg-primary w-8" : "bg-outline-variant")} />
              <div className={cn("w-2 h-2 rounded-full transition-all duration-500", step === 2 ? "bg-primary w-8" : "bg-outline-variant")} />
            </div>
            <h2 className="text-4xl font-black text-on-background tracking-tighter">
              {step === 1 ? "Operator Profile" : "Business Intelligence"}
            </h2>
            <p className="text-on-surface-variant font-medium mt-2">
              {step === 1 ? "Define your identity within the system." : "Initialize your organizational parameters."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSignup} 
              className="space-y-8"
            >
              {error && (
                <div className="p-4 bg-error/5 border border-error/20 rounded-2xl text-error text-xs font-black uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Full Operator Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant/40" />
                      <input 
                        name="fullName"
                        type="text" 
                        required
                        className="w-full pl-12 pr-6 py-4 bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Work Protocol (Email)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant/40" />
                      <input 
                        name="email"
                        type="email" 
                        required
                        className="w-full pl-12 pr-6 py-4 bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Access Credential (Password)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant/40" />
                      <input 
                        name="password"
                        type="password" 
                        required
                        className="w-full pl-12 pr-6 py-4 bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Enterprise Designation</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant/40" />
                      <input 
                        name="businessName"
                        type="text" 
                        required
                        className="w-full pl-12 pr-6 py-4 bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                        value={formData.businessName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Industrial Sector</label>
                    <select 
                      name="industry"
                      className="w-full px-6 py-4 bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold appearance-none cursor-pointer"
                      value={formData.industry}
                      onChange={handleChange}
                    >
                      <option>Retail & Sales</option>
                      <option>Manufacturing</option>
                      <option>Services</option>
                      <option>Logistics</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-6 space-y-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-on-background text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-on-background/20 hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <>
                      {step === 1 ? "Proceed to Business Intelligence" : "Initialize System"}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                {step === 2 && !loading && (
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="w-full py-2 text-[10px] font-black text-on-surface-variant/40 hover:text-on-background uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" /> Go Back
                  </button>
                )}
              </div>
            </motion.form>
          </AnimatePresence>

          <div className="pt-10 border-t border-outline-variant/30 text-center">
            <p className="text-sm font-medium text-on-surface-variant">
              Already an operator?{' '}
              <Link href="/login" className="text-primary font-black hover:underline transition-all">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
