'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  Loader2,
  X,
  User,
  History,
  ShieldCheck,
  Star,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomersPage() {
  const { business } = useAuth();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (business) {
      fetchCustomers();
    }
  }, [business]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*, orders(total_amount)')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('customers')
        .insert({
          ...newCustomer,
          business_id: business.id
        });

      if (error) throw error;
      
      setShowModal(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      fetchCustomers();
    } catch (err) {
      console.error('Error adding customer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-on-background mb-1">Nexus</h1>
          <p className="text-on-surface-variant font-medium">Holistic customer relationship and interaction management.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/40" />
            <input 
              type="text" 
              placeholder="Search directory..." 
              className="pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium w-64"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Hydrating Client Data...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="col-span-full py-24 text-center">
            <div className="w-20 h-20 bg-surface-container-low rounded-3xl flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-on-surface-variant/20" />
            </div>
            <h3 className="text-xl font-black text-on-background mb-2">No Clients Found</h3>
            <p className="text-on-surface-variant font-medium mb-8">Start building your network by adding your first client.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-5 w-5" /> Add Customer
            </button>
          </div>
        ) : (
          customers.map((customer, i) => {
            const totalSpent = customer.orders?.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0) || 0;
            const isHighValue = totalSpent > 100000;
            
            return (
              <motion.div 
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="premium-card p-8 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-2 hover:bg-surface-container-low rounded-xl text-on-surface-variant/40 hover:text-primary transition-all">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-5 mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-black text-2xl border border-primary/10 shadow-inner">
                      {customer.name.charAt(0)}
                    </div>
                    {isHighValue && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg">
                        <Star className="h-3 w-3 fill-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-on-background leading-tight">{customer.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mt-1">
                      <ShieldCheck className="h-3 w-3" /> Verified Client
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm font-bold text-on-surface-variant">
                    <div className="p-2 bg-surface-container-low rounded-lg">
                      <Mail className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate">{customer.email || 'No email registered'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-on-surface-variant">
                    <div className="p-2 bg-surface-container-low rounded-lg">
                      <Phone className="h-3.5 w-3.5" />
                    </div>
                    <span>{customer.phone || 'No phone registered'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/30">
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Volume</p>
                    <p className="text-sm font-black text-on-background">{customer.orders?.length || 0} Orders</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">LTV</p>
                    <p className="text-sm font-black text-primary">₦{totalSpent.toLocaleString()}</p>
                  </div>
                </div>
                
                <Link 
                  href={`/customers/${customer.id}`}
                  className="w-full mt-8 py-4 rounded-2xl bg-surface-container-low text-on-surface-variant text-sm font-black hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-xl group-hover:shadow-primary/20"
                >
                  Portal Access <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl shadow-on-background/20"
            >
              <div className="p-8 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
                <div>
                  <h2 className="text-2xl font-black text-on-background">Onboard Client</h2>
                  <p className="text-sm text-on-surface-variant font-medium">Register a new client to your business ecosystem.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-surface-container-low rounded-2xl transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddCustomer} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Full Name / Entity Name</label>
                  <input 
                    required
                    placeholder="e.g. John Doe or Acme Corp"
                    className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email"
                      placeholder="client@email.com"
                      className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Phone Number</label>
                    <input 
                      placeholder="+234 800 000 0000"
                      className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Primary Address</label>
                  <textarea 
                    placeholder="Physical or billing address"
                    className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold resize-none"
                    rows={3}
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-8 py-4 border border-outline-variant rounded-2xl font-bold hover:bg-surface-container-low transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Save Record <ArrowRight className="h-5 w-5" /></>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
