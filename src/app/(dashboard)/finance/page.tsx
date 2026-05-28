'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Loader2,
  X,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  Wallet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinancePage() {
  const { business } = useAuth();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newExpense, setNewExpense] = useState({
    amount: 0,
    category: 'Operational',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (business) {
      fetchFinanceData();
    }
  }, [business]);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('business_id', business.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          ...newExpense,
          business_id: business.id
        });

      if (error) throw error;
      
      setShowModal(false);
      setNewExpense({ amount: 0, category: 'Operational', description: '', date: new Date().toISOString().split('T')[0] });
      fetchFinanceData();
    } catch (err) {
      console.error('Error adding expense:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Group by category for the summary
  const categories = expenses.reduce((acc: any, curr) => {
    const cat = curr.category;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += Number(curr.amount);
    return acc;
  }, {});

  const categorySummary = Object.keys(categories).map(cat => ({
    name: cat,
    value: Math.round((categories[cat] / totalExpenses) * 100),
    amount: categories[cat],
    color: cat === 'Operational' ? '#0058be' : cat === 'Salaries' ? '#10b981' : '#f59e0b'
  }));

  // Group by month for the chart (mocked for visual)
  const chartData = [
    { name: 'Mar', amount: 45000 },
    { name: 'Apr', amount: 52000 },
    { name: 'May', amount: 48000 },
    { name: 'Jun', amount: totalExpenses || 61000 },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-on-background mb-1">Treasury</h1>
          <p className="text-on-surface-variant font-medium">Expense tracking, cash flow analysis, and fiscal health.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Record Expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 premium-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-on-background">Burn Rate</h3>
              <p className="text-sm text-on-surface-variant font-medium">Monthly expense trajectory</p>
            </div>
            <div className="p-3 bg-error/5 rounded-xl">
              <TrendingDown className="h-6 w-6 text-error" />
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#424754', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#424754', fontSize: 12, fontWeight: 600 }}
                    tickFormatter={(val) => `₦${val/1000}k`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0, 88, 190, 0.03)' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '16px', 
                      border: '1px solid #e5eeff',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      padding: '12px'
                    }} 
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#0058be' : '#e5eeff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Allocation Card */}
        <div className="premium-card p-8">
          <h3 className="text-xl font-black text-on-background mb-8">Allocation</h3>
          <div className="space-y-8">
            {categorySummary.length === 0 ? (
              <div className="py-12 text-center">
                <Wallet className="h-12 w-12 text-on-surface-variant/20 mx-auto mb-4" />
                <p className="text-sm text-on-surface-variant font-medium">No expenses yet.</p>
              </div>
            ) : (
              categorySummary.map((cat, i) => (
                <motion.div 
                  key={cat.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-black text-on-background">{cat.name}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">₦{Number(cat.amount).toLocaleString()}</p>
                    </div>
                    <span className="text-sm font-black text-primary">{cat.value}%</span>
                  </div>
                  <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-on-background">Activity Stream</h3>
          <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="premium-card overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {expenses.length === 0 ? (
                <div className="p-12 text-center text-on-surface-variant/50 font-medium">No transactions recorded.</div>
              ) : (
                expenses.map((t, i) => (
                  <motion.div 
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-6 hover:bg-surface-container-low/50 transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-error/5 text-error flex items-center justify-center">
                        <TrendingDown className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-on-background">{t.category}</p>
                        <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">{t.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-error">-₦{Number(t.amount).toLocaleString()}</p>
                      <div className="flex items-center gap-1.5 justify-end text-[10px] font-bold text-on-surface-variant/40">
                        <Calendar className="h-3 w-3" /> {t.date}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Record Expense Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl shadow-on-background/20"
            >
              <div className="p-8 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
                <div>
                  <h2 className="text-2xl font-black text-on-background">Record Expense</h2>
                  <p className="text-sm text-on-surface-variant font-medium">Keep your ledger accurate and up to date.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-surface-container-low rounded-2xl transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Amount (₦)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                    <input 
                      type="number"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-black text-2xl"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Category</label>
                  <select 
                    className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold appearance-none"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  >
                    <option>Operational</option>
                    <option>Salaries</option>
                    <option>Utilities</option>
                    <option>Inventory Purchase</option>
                    <option>Marketing</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Description</label>
                  <input 
                    required
                    placeholder="e.g. Office rent for June"
                    className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Transaction Date</label>
                  <input 
                    type="date"
                    required
                    className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-4 border border-outline-variant rounded-2xl font-bold hover:bg-surface-container-low transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Save Entry <ArrowRight className="h-5 w-5" /></>}
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
