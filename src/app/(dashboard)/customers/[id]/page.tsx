'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  TrendingUp, 
  Clock,
  MoreVertical,
  ChevronRight,
  User,
  Star,
  ExternalLink,
  Loader2,
  FileText,
  CreditCard
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { business } = useAuth();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (business && id) {
      fetchCustomerData();
    }
  }, [business, id]);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      // Fetch customer details
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .eq('business_id', business.id)
        .single();

      if (customerError) throw customerError;
      setCustomer(customerData);

      // Fetch order history
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name))')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });

      if (orderError) throw orderError;
      setOrders(orderData || []);
    } catch (err) {
      console.error('Error fetching customer details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Accessing Client Profile...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-black mb-4">Client Not Found</h2>
        <button onClick={() => router.back()} className="text-primary font-bold hover:underline">
          Return to Nexus
        </button>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const averageOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl hover:bg-primary hover:text-white transition-all group"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-on-background">{customer.name}</h1>
              {totalSpent > 100000 && (
                <div className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-500/20">
                  <Star className="h-3 w-3 fill-amber-500" /> High-Value
                </div>
              )}
            </div>
            <p className="text-on-surface-variant font-medium mt-1">Client Profile • Member since {new Date(customer.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-sm font-black hover:bg-surface-container-high transition-all">
            Edit Profile
          </button>
          <button className="btn-primary">
            New Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-8">
          <div className="premium-card p-8">
            <h3 className="text-sm font-black text-on-background uppercase tracking-widest mb-8">Contact Intelligence</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/5 rounded-xl">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Email Protocol</p>
                  <p className="text-sm font-black text-on-background">{customer.email || 'Not verified'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/5 rounded-xl">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Secure Line</p>
                  <p className="text-sm font-black text-on-background">{customer.phone || 'No direct line'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/5 rounded-xl">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Operational Base</p>
                  <p className="text-sm font-black text-on-background">{customer.address || 'Location redacted'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card p-8 bg-on-background text-white relative overflow-hidden">
            <TrendingUp className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 rotate-12" />
            <div className="relative z-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-8">Fiscal Performance</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-4xl font-black">₦{totalSpent.toLocaleString()}</p>
                  <p className="text-xs font-bold text-white/40 mt-1 uppercase tracking-widest">Lifetime Value (LTV)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xl font-black">₦{averageOrderValue.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest">Avg Order</p>
                  </div>
                  <div>
                    <p className="text-xl font-black">{orders.length}</p>
                    <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest">Transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="premium-card p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-on-background">Transaction Ledger</h3>
                <p className="text-sm text-on-surface-variant font-medium">Historical audit of all fiscal interactions.</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-surface-container-low rounded-xl text-on-surface-variant hover:text-primary transition-all">
                  <Clock className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-20 text-center">
                  <ShoppingBag className="h-12 w-12 text-on-surface-variant/20 mx-auto mb-4" />
                  <p className="text-sm font-bold text-on-surface-variant/40 uppercase tracking-widest">No transaction history detected</p>
                </div>
              ) : (
                orders.map((order, i) => (
                  <div key={order.id} className="flex items-center justify-between p-6 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl hover:bg-surface-container-low transition-all group">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        order.status === 'completed' ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                      )}>
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-on-background">Order #{order.id.slice(-6).toUpperCase()}</p>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                            order.status === 'completed' ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                          )}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-on-surface-variant/60">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-on-background">₦{Number(order.total_amount).toLocaleString()}</p>
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline mt-1 opacity-0 group-hover:opacity-100 transition-all">
                        View Receipt
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interaction Log / Notes */}
          <div className="premium-card p-8">
            <h3 className="text-sm font-black text-on-background uppercase tracking-widest mb-8">Intelligence Notes</h3>
            <div className="space-y-4">
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 italic text-on-surface-variant font-medium text-sm">
                "Client prefers bulk orders at the end of the fiscal quarter. Priority handling required for all logistics requests."
              </div>
              <button className="w-full py-4 border-2 border-dashed border-outline-variant/40 rounded-2xl text-xs font-black text-on-surface-variant/40 uppercase tracking-[0.2em] hover:bg-surface-container-low hover:border-primary/20 transition-all">
                Append Interaction Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
