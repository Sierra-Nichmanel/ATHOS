'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Command,
  ChevronDown,
  Sparkles,
  SearchIcon,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useAuth();

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary/10">
      {/* Permanent Sidebar */}
      <Sidebar />
      
      {/* Main Orchestration Layer */}
      <div className="flex-1 ml-[260px] flex flex-col min-w-0">
        {/* Superior Top Bar */}
        <header className="h-20 bg-white/70 backdrop-blur-2xl border-b border-outline-variant/20 sticky top-0 z-40 flex items-center justify-between px-10">
          <div className="flex items-center gap-10 flex-1">
            <div className="relative max-w-md w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Global Command Search (⌘K)" 
                className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low/50 border border-transparent rounded-xl focus:bg-white focus:border-primary/20 focus:outline-none transition-all text-xs font-black uppercase tracking-widest"
              />
            </div>
            <div className="hidden lg:flex items-center gap-6">
              {['Status', 'Infrastructure', 'Support'].map(item => (
                <button key={item} className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-all">
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 rounded-xl hover:bg-surface-container-low text-on-surface-variant/60 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </button>
            <div className="h-6 w-px bg-outline-variant/30" />
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right">
                <p className="text-xs font-black text-on-background leading-none">{profile?.full_name?.split(' ')[0] || 'Admin'}</p>
                <p className="text-[9px] font-black text-primary uppercase tracking-tighter mt-1">Enterprise Hub</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-on-background flex items-center justify-center shadow-xl shadow-on-background/10 group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-sm italic">
                  {profile?.full_name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Surface */}
        <main className="flex-1 p-10 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
