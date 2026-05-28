'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Package, 
  BarChart3, 
  TrendingUp, 
  History, 
  AlertTriangle, 
  Settings,
  MoreVertical,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Calendar,
  Box,
  Layers,
  Zap,
  Edit3,
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { business } = useAuth();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (business && id) {
      fetchProductData();
    }
  }, [business, id]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('business_id', business.id)
        .single();

      if (error) throw error;
      setProduct(data);

      // Mock analytics for the "premium" look
      setAnalytics({
        salesHistory: [
          { month: 'Jan', sales: 45 },
          { month: 'Feb', sales: 52 },
          { month: 'Mar', sales: 48 },
          { month: 'Apr', sales: 70 },
          { month: 'May', sales: 61 },
          { month: 'Jun', sales: 85 },
        ],
        stockFlow: [
          { day: 'Mon', count: 120 },
          { day: 'Tue', count: 115 },
          { day: 'Wed', count: 110 },
          { day: 'Thu', count: 105 },
          { day: 'Fri', count: 130 }, // restock
          { day: 'Sat', count: 125 },
          { day: 'Sun', count: 122 },
        ]
      });
    } catch (err) {
      console.error('Error fetching product details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Analyzing Product Data...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl hover:bg-primary hover:text-white transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-on-background">{product.name}</h1>
              <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant/60 rounded-full text-[10px] font-black uppercase tracking-widest border border-outline-variant/30">
                {product.sku}
              </span>
            </div>
            <p className="text-on-surface-variant font-medium mt-1">Catalog Item • ID: {product.id.slice(0,8).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-sm font-black hover:bg-surface-container-high transition-all flex items-center gap-2">
            <Edit3 className="h-4 w-4" /> Edit Specifications
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Zap className="h-4 w-4" /> Restock Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="premium-card p-8 bg-on-background text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-8">Stock Availability</p>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h3 className="text-5xl font-black">{product.stock_quantity}</h3>
                  <p className="text-sm font-bold text-white/60 mt-1 uppercase tracking-widest">Units in Vault</p>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest",
                  product.stock_quantity > 10 ? "bg-emerald-500/20 text-emerald-400" : "bg-error/20 text-error-container"
                )}>
                  {product.stock_quantity > 10 ? 'Optimal' : 'Critical'}
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((product.stock_quantity / 100) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </div>

          <div className="premium-card p-8 bg-white border-outline-variant/30">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 mb-8">Fiscal Matrix</p>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-black text-on-background">₦{Number(product.price).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Retail Price</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">+₦{(product.price - product.cost_price).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Unit Margin</p>
                </div>
              </div>
              <div className="pt-6 border-t border-outline-variant/20">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-on-surface-variant">Inventory Value</p>
                  <p className="text-sm font-black text-on-background">₦{(product.price * product.stock_quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="premium-card p-8 md:col-span-2">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black text-on-background">Velocity Analytics</h3>
                <p className="text-sm text-on-surface-variant font-medium">Sales volume trajectories over the last 6 months.</p>
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-surface-container-low rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                  Monthly View
                </div>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.salesHistory}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--color-on-surface-variant)', opacity: 0.4 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 900 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="var(--color-primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="premium-card p-8">
            <h3 className="text-sm font-black text-on-background uppercase tracking-widest mb-8">Metadata</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <Layers className="h-5 w-5 text-on-surface-variant/40" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Category</p>
                  <p className="text-sm font-black text-on-background">{product.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <Settings className="h-5 w-5 text-on-surface-variant/40" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Threshold</p>
                  <p className="text-sm font-black text-on-background">{product.low_stock_threshold || 5} Units</p>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card p-8">
            <h3 className="text-sm font-black text-on-background uppercase tracking-widest mb-8">Activity Stream</h3>
            <div className="space-y-6">
              {[
                { type: 'sale', msg: 'Order #A492 sold 2 units', time: '2 hours ago' },
                { type: 'stock', msg: 'Restocked 50 units', time: 'Yesterday' },
                { type: 'price', msg: 'Price updated to ₦' + Number(product.price).toLocaleString(), time: '3 days ago' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== 2 && <div className="absolute left-[19px] top-10 bottom-[-24px] w-px bg-outline-variant/30" />}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10",
                    activity.type === 'sale' ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-600"
                  )}>
                    {activity.type === 'sale' ? <ShoppingBag className="h-4 w-4" /> : <Box className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-background">{activity.msg}</p>
                    <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mt-1">{activity.time}</p>
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
