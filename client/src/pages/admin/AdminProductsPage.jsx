import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, Plus, Edit2, Trash2, X, Search, CheckCircle2 } from 'lucide-react';

export default function AdminProductsPage() {
  const { adminToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNew, setIsNew] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [stockQuantity, setStockQuantity] = useState(50);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetch('/api/products/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories || []);
      });
  }, []);

  const openNewModal = () => {
    setIsNew(true);
    setEditingProduct({});
    setName('');
    setPrice('');
    setOriginalPrice('');
    setCategoryId(categories[0]?.id || 1);
    setStockQuantity(50);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400');
  };

  const openEditModal = (p) => {
    setIsNew(false);
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setOriginalPrice(p.original_price || '');
    setCategoryId(p.category_id || 1);
    setStockQuantity(p.stock_quantity);
    setDescription(p.description || '');
    setImageUrl(p.image_url || '');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      price: parseFloat(price),
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      category_id: categoryId,
      stock_quantity: parseInt(stockQuantity, 10),
      description,
      image_url: imageUrl
    };

    try {
      const url = isNew ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert(data.message || 'Error saving product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="space-y-6 antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Product Catalog & Inventory</h2>
          <p className="text-xs text-slate-400">Manage verified accessories, prices, and stock counts.</p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-navy-850 rounded-2xl border border-navy-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-700">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/60 text-slate-300">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-navy-800/50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={p.image_url} alt="" className="w-10 h-10 object-contain rounded-lg bg-navy-900 border border-navy-700" />
                      <div>
                        <p className="font-bold text-white text-sm line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{p.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-300">{p.category_name}</td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-brand-300 text-sm">₹{p.price}</span>
                      {p.original_price && <span className="text-[10px] line-through text-slate-500 ml-1">₹{p.original_price}</span>}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{p.stock_quantity} units</td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button onClick={() => openEditModal(p)} className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-brand-400">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-navy-800 hover:bg-red-950/40 text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / New Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-navy-850 rounded-3xl border border-navy-700 max-w-lg w-full p-6 space-y-4 text-white animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <h3 className="font-bold text-base font-display">{isNew ? 'Add New Product' : 'Edit Product'}</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Product Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Original Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
                    className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Stock Quantity</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-navy-800 text-white rounded-xl px-3 py-2 border border-navy-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}