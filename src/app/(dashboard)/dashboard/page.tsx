'use client';

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Target,
  AlertTriangle,
  CreditCard,
  Zap,
  Globe,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { business, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    expenses: 0,
    netProfit: 0,
    lowStock: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (business) {
      fetchDashboardData();
    }
  }, [business]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Revenue
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('business_id', business.id)
        .eq('status', 'completed');

      if (ordersError) throw ordersError;
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

      // 2. Fetch Expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('amount')
        .eq('business_id', business.id);

      if (expensesError) throw expensesError;
      const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

      // 3. Fetch Inventory
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('stock_quantity, low_stock_threshold')
        .eq('business_id', business.id);

      if (productsError) throw productsError;
      const lowStockCount = products.filter(p => p.stock_quantity <= (p.low_stock_threshold || 5)).length;

      setStats({
        revenue: totalRevenue,
        expenses: totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        lowStock: lowStockCount,
      });

      // Synthetic time-series data for the premium chart
      setChartData([
        { name: 'Mon', revenue: totalRevenue * 0.1, expenses: totalExpenses * 0.1 },
        { name: 'Tue', revenue: totalRevenue * 0.15, expenses: totalExpenses * 0.12 },
        { name: 'Wed', revenue: totalRevenue * 0.2, expenses: totalExpenses * 0.25 },
        { name: 'Thu', revenue: totalRevenue * 0.18, expenses: totalExpenses * 0.15 },
        { name: 'Fri', revenue: totalRevenue * 0.22, expenses: totalExpenses * 0.2 },
        { name: 'Sat', revenue: totalRevenue * 0.1, expenses: totalExpenses * 0.1 },
        { name: 'Sun', revenue: totalRevenue * 0.05, expenses: totalExpenses * 0.08 },
      ]);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm font-black text-on-surface-variant uppercase tracking-widest italic">Synchronizing Operational Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-on-background mb-1">Command Center</h1>
          <p className="text-on-surface-variant font-medium">Sovereign overview for <span className="text-primary font-bold">{business?.name}</span></p>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/20 shadow-inner">
          {['24H', '7D', '30D', '1Y'].map((range, i) => (
            <button 
              key={range} 
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                i === 1 ? "bg-white text-on-background shadow-md" : "text-on-surface-variant/40 hover:text-on-background"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Circulating Revenue', 
            value: `₦${stats.revenue.toLocaleString()}`, 
            icon: TrendingUp, 
            trend: '+12.5%', 
            up: true,
            color: 'text-primary',
            bg: 'bg-primary/5'
          },
          { 
            label: 'Capital Outflow', 
            value: `₦${stats.expenses.toLocaleString()}`, 
            icon: CreditCard, 
            trend: '+2.1%', 
            up: false,
            color: 'text-error',
            bg: 'bg-error/5'
          },
          { 
            label: 'Net Surplus', 
            value: `₦${stats.netProfit.toLocaleString()}`, 
            icon: Target, 
            trend: '+8.4%', 
            up: true,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/5'
          },
          { 
            label: 'Inventory Health', 
            value: stats.lowStock, 
            icon: AlertTriangle, 
            trend: stats.lowStock > 0 ? 'Action Required' : 'Optimal', 
            up: stats.lowStock === 0,
            color: stats.lowStock > 0 ? 'text-amber-500' : 'text-primary',
            bg: 'bg-amber-500/5'
          },
        ].map((kpi, i) => (
          <motion.div 
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-6 flex flex-col justify-between min-h-[180px]"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                kpi.up ? "bg-emerald-500/10 text-emerald-600" : "bg-error/10 text-error"
              )}>
                {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
              <h3 className="text-3xl font-black text-on-background">{kpi.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Central Intelligence Chart */}
      <div className="premium-card p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-2xl font-black text-on-background">Operational Velocity</h2>
            <p className="text-sm text-on-surface-variant font-medium">Comparative analysis of fiscal inflows vs. outflows.</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Inflow</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-error" />
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Outflow</span>
            </div>
          </div>
        </div>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-error)" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="var(--color-error)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10, fontWeight: 900 }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10, fontWeight: 900 }}
                tickFormatter={(value) => `₦${Math.round(value/1000)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '1.5rem', 
                  border: 'none',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                  fontWeight: 900,
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-primary)" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="var(--color-error)" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorExpenses)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Intelligence Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="premium-card p-8 lg:col-span-1">
          <h3 className="text-sm font-black text-on-background uppercase tracking-widest mb-8">Infrastructure Health</h3>
          <div className="space-y-8">
            {[
              { label: 'Database Latency', value: '14ms', status: 'Optimal' },
              { label: 'Cloud Synchrony', value: '100%', status: 'Active' },
              { label: 'AI Readiness', value: 'Enabled', status: 'Optimal' },
            ].map(sys => (
              <div key={sys.label} className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest mb-1">{sys.label}</p>
                  <p className="text-sm font-black text-on-background">{sys.value}</p>
                </div>
                <div className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/10">
                  {sys.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="premium-card p-8 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-on-background uppercase tracking-widest">Global Activity</h3>
            <Globe className="h-4 w-4 text-on-surface-variant/20" />
          </div>
          <div className="space-y-6">
            {[
              { event: 'Bulk Inventory Restock', actor: 'System', time: '10m ago' },
              { event: 'New Enterprise Client Secured', actor: 'Admin', time: '45m ago' },
              { event: 'Fiscal Report Exported', actor: 'Finance Bot', time: '2h ago' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p className="text-sm font-bold text-on-background">{log.event}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{log.actor}</p>
                  <p className="text-[9px] font-bold text-on-surface-variant/40">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
