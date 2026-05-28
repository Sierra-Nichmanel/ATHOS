'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  Loader2,
  X,
  ShoppingCart,
  Calendar,
  ChevronRight,
  User,
  Package,
  ArrowRight,
  TrendingUp,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function SalesPage() {
  const { business } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [orderItems, setOrderItems] = useState<any[]>([]);

  useEffect(() => {
    if (business) {
      fetchSalesData();
      fetchCustomersAndProducts();
    }
  }, [business]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, customers(name)')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersAndProducts = async () => {
    const { data: custData } = await supabase.from('customers').select('*').eq('business_id', business.id);
    const { data: prodData } = await supabase.from('products').select('*').eq('business_id', business.id);
    setCustomers(custData || []);
    setProducts(prodData || []);
  };

  const addItem = () => {
    setOrderItems([...orderItems, { product_id: '', quantity: 1, unit_price: 0 }]);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          business_id: business.id,
          customer_id: selectedCustomer || null,
          total_amount: totalAmount,
          status: 'completed'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const itemsToInsert = orderItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;

      setShowModal(false);
      setSelectedCustomer('');
      setOrderItems([]);
      fetchSalesData();
    } catch (err) {
      console.error('Error creating order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayRevenue = orders
    .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const avgOrderValue = orders.length > 0 
    ? orders.reduce((sum, o) => sum + Number(o.total_amount), 0) / orders.length 
    : 0;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-on-background mb-1">Fiscal Ledger</h1>
          <p className="text-on-surface-variant font-medium">Real-time revenue orchestration and order telemetry.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Initialize Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Circulating Revenue', value: `₦${todayRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-primary', sub: "Current Fiscal Cycle" },
          { label: 'Order Velocity', value: orders.length, icon: ShoppingCart, color: 'text-emerald-500', sub: "Total Processed" },
          { label: 'Average Ticket', value: `₦${Math.round(avgOrderValue).toLocaleString()}`, icon: DollarSign, color: 'text-amber-500', sub: "Per Transaction" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-surface-container-low rounded-2xl">
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">{stat.label}</p>
            </div>
            <h3 className="text-4xl font-black text-on-background mb-2">{stat.value}</h3>
            <p className="text-xs font-bold text-on-surface-variant/60">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="premium-card overflow-hidden">
        <div className="p-8 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-container-lowest">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/40" />
            <input 
              type="text" 
              placeholder="Search Ledger (⌘F)" 
              className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-3 text-sm font-black text-on-surface-variant hover:bg-surface-container-low rounded-2xl transition-all border border-outline-variant/20">
              <Filter className="h-4 w-4" />
              Parameters
            </button>
            <button className="flex items-center gap-2 px-5 py-3 text-sm font-black text-primary hover:bg-primary/5 rounded-2xl transition-all border border-primary/20">
              <ArrowRight className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Protocol ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Stakeholder</th>
                <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Fiscal Value</th>
                <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <p className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest">No transaction records detected</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-on-background">#{order.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-on-background text-white flex items-center justify-center font-black text-[10px] uppercase">
                          {order.customers?.name?.charAt(0) || 'W'}
                        </div>
                        <span className="text-sm font-black text-on-background">{order.customers?.name || 'Walk-in'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                        <Calendar className="h-3.5 w-3.5 opacity-40" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-primary">₦{Number(order.total_amount).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        order.status === 'completed' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                      )}>
                        {order.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant/40 hover:text-primary transition-all">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl shadow-on-background/20"
            >
              <div className="p-10 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
                <div>
                  <h2 className="text-3xl font-black text-on-background leading-tight">New Transaction</h2>
                  <p className="text-sm text-on-surface-variant font-medium">Record a fiscal interaction within your ecosystem.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-4 hover:bg-surface-container-low rounded-[1.5rem] transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-10 space-y-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    Target Stakeholder
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-6 py-5 bg-surface-container-low border border-outline-variant/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-black text-sm appearance-none"
                      value={selectedCustomer}
                      onChange={(e) => setSelectedCustomer(e.target.value)}
                    >
                      <option value="">Walk-in Customer</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 rotate-90 opacity-20 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] flex items-center gap-2">
                      <Package className="h-3.5 w-3.5" />
                      Manifest Items
                    </label>
                    <button 
                      type="button" 
                      onClick={addItem}
                      className="text-[10px] font-black text-primary hover:underline flex items-center gap-1.5 uppercase tracking-widest"
                    >
                      <Plus className="h-3.5 w-3.5" /> Append Item
                    </button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {orderItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 p-5 rounded-3xl bg-surface-container-low/50 border border-outline-variant/20 group">
                        <div className="col-span-6">
                          <select 
                            required
                            className="w-full px-4 py-3 bg-white border border-outline-variant/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-xs font-black"
                            value={item.product_id}
                            onChange={(e) => {
                              const prod = products.find(p => p.id === e.target.value);
                              const newItems = [...orderItems];
                              newItems[index] = { ...newItems[index], product_id: e.target.value, unit_price: prod?.price || 0 };
                              setOrderItems(newItems);
                            }}
                          >
                            <option value="">Select Asset...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <input 
                            type="number" 
                            placeholder="Qty"
                            min="1"
                            required
                            className="w-full px-3 py-3 bg-white border border-outline-variant/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-xs font-black text-center"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...orderItems];
                              newItems[index].quantity = Number(e.target.value);
                              setOrderItems(newItems);
                            }}
                          />
                        </div>
                        <div className="col-span-3">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 font-black text-[10px]">₦</span>
                            <input 
                              type="number" 
                              disabled
                              className="w-full pl-7 pr-3 py-3 bg-surface-container-high/30 border border-outline-variant/10 rounded-xl text-xs font-black text-primary"
                              value={item.unit_price}
                            />
                          </div>
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <button 
                            type="button" 
                            onClick={() => setOrderItems(orderItems.filter((_, i) => i !== index))}
                            className="p-2 text-on-surface-variant/20 hover:text-error transition-all"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-outline-variant/30">
                  <div className="text-left w-full md:w-auto">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">Fiscal Total</p>
                    <p className="text-4xl font-black text-on-background">
                      ₦{orderItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 md:flex-none px-8 py-5 border border-outline-variant rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-surface-container-low transition-all"
                    >
                      Abort
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting || orderItems.length === 0}
                      className="flex-1 md:flex-none bg-on-background text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-on-background/20 hover:bg-primary disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Finalize Order <ArrowRight className="h-5 w-5" /></>}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
