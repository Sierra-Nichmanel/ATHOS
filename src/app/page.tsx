'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  TrendingUp, 
  LayoutDashboard,
  CheckCircle2,
  Users,
  BarChart3,
  Globe,
  Rocket,
  Lock,
  ChevronRight,
  Sparkles,
  Command
} from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "circOut" }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-primary/10 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-on-background rounded-2xl flex items-center justify-center shadow-2xl shadow-on-background/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Command className="text-white h-6 w-6 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-on-background leading-none">
                Africentric <span className="text-primary italic">OS</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40">Business Ecosystem</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-12">
            {['Architecture', 'Ecosystem', 'Security', 'Enterprise'].map((item) => (
              <Link key={item} href="#" className="text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-black text-on-surface-variant hover:text-primary transition-colors">
              Access Vault
            </Link>
            <Link 
              href="/signup" 
              className="bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-container shadow-2xl shadow-primary/20 transition-all active:scale-[0.95]"
            >
              Initialize Deployment
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative py-32 lg:py-48 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary/5 blur-[120px] rounded-full rotate-12" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-emerald-500/5 blur-[120px] rounded-full -rotate-12" />
          </div>
          
          <motion.div 
            className="max-w-7xl mx-auto px-6 text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants as any}
          >
            <motion.div variants={itemVariants as any} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-on-background/5 border border-on-background/10 text-on-background text-[10px] font-black uppercase tracking-[0.2em] mb-12">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              V3.0 Architecture Now Live
            </motion.div>
            
            <motion.h1 variants={itemVariants as any} className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tight text-on-background leading-[0.85] mb-12">
              The Sovereign <br/> <span className="text-primary">Business OS.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants as any} className="text-xl md:text-3xl text-on-surface-variant font-medium max-w-3xl mx-auto leading-relaxed mb-16 px-4">
              A high-performance operating system designed for the next generation of African enterprises. Precision-engineered for scale.
            </motion.p>
            
            <motion.div variants={itemVariants as any} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto bg-on-background text-white px-12 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-primary shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all flex items-center justify-center gap-4 group"
              >
                Provision Account
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                href="#ecosystem" 
                className="w-full sm:w-auto px-12 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest border-2 border-outline-variant hover:bg-surface-container-low transition-all flex items-center justify-center gap-3"
              >
                View Documentation
              </Link>
            </motion.div>

            {/* Premium App Preview */}
            <motion.div 
              variants={itemVariants as any}
              className="mt-32 relative max-w-6xl mx-auto"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[150px] -z-10 opacity-50" />
              <div className="rounded-[3rem] border border-outline-variant/30 bg-white shadow-2xl overflow-hidden p-3 relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="bg-surface-container-lowest rounded-[2.5rem] aspect-[16/10] overflow-hidden border border-outline-variant/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full p-12 flex flex-col gap-8 opacity-40">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-6">
                          {[1,2,3].map(i => <div key={i} className="h-32 w-52 bg-surface-container-low rounded-[2rem] border border-outline-variant/30" />)}
                        </div>
                      </div>
                      <div className="flex-1 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/30 p-10 flex flex-col gap-6">
                        <div className="h-6 w-1/4 bg-on-background/10 rounded-full" />
                        <div className="flex-1 grid grid-cols-3 gap-6">
                          <div className="bg-white rounded-3xl" />
                          <div className="bg-white rounded-3xl col-span-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Glass Card Overlays */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 aspect-video bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/50 shadow-2xl flex items-center justify-center">
                    <div className="text-center p-12">
                      <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40">
                        <Rocket className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-4xl font-black text-on-background mb-4 tracking-tight">Mission Control</h3>
                      <p className="text-lg font-bold text-on-surface-variant">Real-time telemetry for your entire business ecosystem.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section id="ecosystem" className="py-48 bg-on-background text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/10 blur-[150px] -z-0" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="mb-32 max-w-3xl">
              <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-8">Modular Architecture</h2>
              <p className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
                Built to outperform <br/> <span className="text-white/30">every legacy system.</span>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  title: "Fiscal Intelligence",
                  desc: "Precision tracking of treasury, burn rates, and unit economics with real-time reporting.",
                  icon: BarChart3,
                  tags: ['GL Integration', 'Tax Auto-Sync']
                },
                {
                  title: "Global Supply",
                  desc: "Omnichannel inventory orchestration across multiple warehouses and storefronts.",
                  icon: Globe,
                  tags: ['RFID Support', 'Auto-Reorder']
                },
                {
                  title: "Secure Commerce",
                  desc: "Enterprise-grade order processing and client relationship management.",
                  icon: Shield,
                  tags: ['LTV Analysis', 'Encrypted Data']
                }
              ].map((item, i) => (
                <div key={i} className="p-12 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary transition-colors">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black mb-6">{item.title}</h3>
                  <p className="text-white/50 font-medium leading-relaxed mb-10">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-48 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative p-12 md:p-32 rounded-[4rem] bg-surface-container-low border border-outline-variant/20 overflow-hidden">
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
              <div className="relative z-10 text-center max-w-4xl mx-auto">
                <h2 className="text-5xl md:text-8xl font-black tracking-tight text-on-background leading-[0.9] mb-12">
                  Upgrade to the <br/> <span className="text-primary italic">Business OS of the future.</span>
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link 
                    href="/signup" 
                    className="w-full sm:w-auto bg-on-background text-white px-12 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-primary shadow-2xl transition-all flex items-center justify-center gap-4"
                  >
                    Get Started Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="/login" 
                    className="w-full sm:w-auto px-12 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest border-2 border-on-background/10 hover:bg-white transition-all"
                  >
                    Corporate Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-on-background text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-16 mb-32">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <Command className="h-8 w-8 text-primary" />
                <span className="text-2xl font-black tracking-tighter">Africentric <span className="text-primary italic">OS</span></span>
              </div>
              <p className="text-white/40 font-medium max-w-xs leading-relaxed text-sm">
                The premier operating system for the African business class. Engineered for sovereign scale and absolute precision.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">System</h4>
              <ul className="space-y-4 text-sm font-bold text-white/60">
                <li><Link href="#" className="hover:text-white transition-colors">Core Architecture</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Global Ecosystem</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security Vault</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">Resources</h4>
              <ul className="space-y-4 text-sm font-bold text-white/60">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>
            <div className="col-span-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">Newsletter</h4>
              <p className="text-sm font-bold text-white/40 mb-6">Stay updated with our latest architectural releases.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="admin@corp.com" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="p-3 bg-white text-on-background rounded-xl hover:bg-primary hover:text-white transition-all">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-xs font-black uppercase tracking-widest text-white/20">
              © 2026 Africentric Tech Hub. Sovereign Business Systems.
            </p>
            <div className="flex items-center gap-8">
              {['X (Twitter)', 'LinkedIn', 'Github'].map(s => (
                <Link key={s} href="#" className="text-xs font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors">
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
