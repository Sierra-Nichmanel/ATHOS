'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { ATHOSLogo } from '@/components/ui/ATHOSLogo';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sales', href: '/sales', icon: ShoppingCart },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Finance', href: '/finance', icon: TrendingUp },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { business, profile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-outline-variant/30 bg-white px-6 py-8 flex flex-col">
      <div className="mb-12 px-2">
        <ATHOSLogo size={40} variant="light" />
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-on-surface-variant/40 group-hover:text-primary")} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 text-white/50" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-6">
        <div className="px-2">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-background truncate">{profile?.full_name || 'User'}</p>
              <p className="text-[10px] font-bold text-on-surface-variant/50 truncate uppercase tracking-tighter">
                {business?.name || 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-error hover:bg-error/10 transition-all group"
        >
          <LogOut className="h-5 w-5 text-error/50 group-hover:text-error" />
          Logout
        </button>
      </div>
    </aside>
  );
}
