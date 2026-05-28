'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Loader2,
  X,
  Package,
  Layers,
  TrendingDown,
  ChevronRight,
  ArrowRight,
  Barcode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function InventoryPage() {
  const { business } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: 'General',
    price: 0,
    cost_price: 0,
    stock_quantity: 0,
  });

  useEffect(() => {
    if (business) {
      fetchProducts();
    }
  }, [business]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          ...newProduct,
          business_id: business.id
        });

      if (error) throw error;
      
      setShowModal(false);
      setNewProduct({ name: '', sku: '', category: 'General', price: 0, cost_price: 0, stock_quantity: 0 });
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const lowStockCount = products.filter(p => p.stock_quantity <= (p.low_stock_threshold || 5)).length;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-on-background mb-1">Stock Vault</h1>
          <p className="text-on-surface-variant font-medium">Precision inventory tracking and catalog management.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Inventory', value: products.length, icon: Layers, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Low Stock Alerts', value: lowStockCount, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/5' },
          { label: 'Out of Stock', value: outOfStockCount, icon: TrendingDown, color: 'text-error', bg: 'bg-error/5' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-6 flex items-center gap-6"
          >
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-on-background">{loading ? '...' : stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Products Table */}
      <div className="premium-card overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/40" />
            <input 
              type="text" 
              placeholder="Filter by name, SKU, or category..." 
              className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all">
            <Filter className="h-4 w-4" />
            Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Product Info</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Pricing</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Stock Level</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant/50 font-medium">No products found. Add some to get started.</td>
                </tr>
              ) : (
                products.map((product) => {
                  const status = product.stock_quantity === 0 ? 'Out of Stock' : 
                                product.stock_quantity <= (product.low_stock_threshold || 5) ? 'Low Stock' : 'Optimal';
                  return (
                    <tr key={product.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center">
                            <Package className="h-5 w-5 text-on-surface-variant/40" />
                          </div>
                          <div>
                            <Link 
                              href={`/inventory/${product.id}`}
                              className="text-sm font-black text-on-background hover:text-primary transition-colors cursor-pointer"
                            >
                              {product.name}
                            </Link>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-tighter">
                              <Barcode className="h-3 w-3" /> {product.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-on-surface-variant px-3 py-1 bg-surface-container-low rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-0.5">
                          <p className="text-sm font-black text-primary">₦{Number(product.price).toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-on-surface-variant/40">Cost: ₦{Number(product.cost_price).toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="w-full max-w-[120px] space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                            <span>{product.stock_quantity} units</span>
                          </div>
                          <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all duration-500",
                                status === 'Optimal' ? "bg-emerald-500" : 
                                status === 'Low Stock' ? "bg-amber-500" : "bg-error"
                              )} 
                              style={{ width: `${Math.min((product.stock_quantity / 100) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          status === 'Optimal' ? "bg-emerald-500/10 text-emerald-600" : 
                          status === 'Low Stock' ? "bg-amber-500/10 text-amber-600" : "bg-error/10 text-error"
                        )}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant/40 hover:text-primary transition-all">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-error/5 text-on-surface-variant/40 hover:text-error transition-all">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
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
                  <h2 className="text-2xl font-black text-on-background">Add Product</h2>
                  <p className="text-sm text-on-surface-variant font-medium">Populate your catalog with high-quality entries.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-surface-container-low rounded-2xl transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Product Name</label>
                    <input 
                      required
                      placeholder="e.g. Premium Wireless Headphones"
                      className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">SKU / Barcode</label>
                    <input 
                      required
                      placeholder="WH-1000XM4"
                      className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Category</label>
                    <select 
                      className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold appearance-none"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option>General</option>
                      <option>Electronics</option>
                      <option>Fashion</option>
                      <option>Groceries</option>
                      <option>Health & Beauty</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Cost Price (₦)</label>
                    <input 
                      type="number"
                      required
                      className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                      value={newProduct.cost_price}
                      onChange={(e) => setNewProduct({...newProduct, cost_price: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Selling Price (₦)</label>
                    <input 
                      type="number"
                      required
                      className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Initial Stock Level</label>
                    <input 
                      type="number"
                      required
                      className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-center text-2xl"
                      value={newProduct.stock_quantity}
                      onChange={(e) => setNewProduct({...newProduct, stock_quantity: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-8 py-4 border border-outline-variant rounded-2xl font-bold hover:bg-surface-container-low transition-all"
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
