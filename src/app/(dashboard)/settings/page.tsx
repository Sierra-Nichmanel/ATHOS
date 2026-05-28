'use client';

import React from 'react';
import { 
  Settings as SettingsIcon, 
  Building2, 
  Bell, 
  Shield, 
  CreditCard,
  User,
  ChevronRight,
  Globe,
  Zap,
  Lock,
  Smartphone,
  ExternalLink,
  Crown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { business, profile } = useAuth();

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-on-background mb-1">Configuration</h1>
          <p className="text-on-surface-variant font-medium">Fine-tune your business parameters and security protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Business Identity */}
          <div className="premium-card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/5 rounded-2xl">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black text-on-background">Business Identity</h3>
                <p className="text-sm text-on-surface-variant font-medium">Public-facing organizational details.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Legal Name</label>
                <div className="px-5 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl font-black text-on-background">
                  {business?.name || 'Africentric Corp'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Industry Classification</label>
                <div className="px-5 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl font-black text-on-background capitalize">
                  {business?.business_type || 'General Commerce'}
                </div>
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Registered Address</label>
                <div className="px-5 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl font-black text-on-background">
                  12th Floor, Tower C, Central Business District, Abuja
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-outline-variant/20">
              <button className="text-sm font-black text-primary flex items-center gap-2 hover:underline">
                Request Profile Update <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Security Protocols */}
          <div className="premium-card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/5 rounded-2xl">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black text-on-background">Security Protocols</h3>
                <p className="text-sm text-on-surface-variant font-medium">Authentication and access control.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Primary Administrator', value: profile?.email, icon: User, action: 'Rotate' },
                { label: 'Security Passphrase', value: '••••••••••••••••', icon: Lock, action: 'Modify' },
                { label: 'Two-Factor Auth', value: 'Biometric / SMS Enabled', icon: Smartphone, action: 'Settings' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-5 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl group hover:bg-surface-container-low transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <item.icon className="h-4 w-4 text-on-surface-variant/60" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">{item.label}</p>
                      <p className="text-sm font-black text-on-background">{item.value}</p>
                    </div>
                  </div>
                  <button className="text-xs font-black text-primary opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan & Features */}
        <div className="space-y-8">
          <div className="premium-card p-8 bg-on-background text-white overflow-hidden relative">
            <Crown className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 rotate-12" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <Crown className="h-5 w-5 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Subscription Level</span>
              </div>
              
              <h3 className="text-4xl font-black mb-1 capitalize">{business?.subscription_tier || 'Starter'}</h3>
              <p className="text-sm font-medium text-white/40 mb-10">Elite tier for scaling enterprises.</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white/40 uppercase">Next Billing</span>
                  <span>June 12, 2026</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
              
              <button className="w-full py-4 bg-white text-on-background rounded-2xl font-black text-sm hover:bg-primary hover:text-white transition-all">
                Manage Billing
              </button>
            </div>
          </div>

          <div className="premium-card p-8">
            <h3 className="text-sm font-black text-on-background uppercase tracking-widest mb-6">Module Ecosystem</h3>
            <div className="space-y-6">
              {[
                { name: 'Omnichannel Sales', active: true, icon: Zap },
                { name: 'Global Inventory', active: true, icon: Globe },
                { name: 'Auto-Tax Compliance', active: false, icon: Shield }
              ].map((mod) => (
                <div key={mod.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <mod.icon className="h-4 w-4 text-on-surface-variant/40" />
                    <span className="text-sm font-bold text-on-background">{mod.name}</span>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative transition-all cursor-pointer",
                    mod.active ? "bg-primary" : "bg-surface-container-high"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                      mod.active ? "right-1" : "left-1"
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
