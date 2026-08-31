import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag, Search, Filter, Tag, Check, ArrowUpDown,
  Sparkles, Eye, X, ShieldCheck
} from 'lucide-react';

export default function ProductsPage({ initialSearch = '', onAddToCartFeedback }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState('default');
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetch('/api/products/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories || []);
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `/api/products?sort=${sort}`;
    if (selectedCategory !== 'all') url += `&category=${selectedCategory}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [selectedCategory, search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 antialiased">
      {/* Header Banner */}
      <div className="bg-navy-900 text-white rounded-3xl p-6 sm:p-10 border border-navy-700 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-xs font-bold text-brand-300 border border-navy-600">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Confirmed Verified Pricing
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
            Mobile Accessories & Protection
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Browse verified earphones, wireless AirPods, neckbands, bluetooth speakers, and screen guards at genuine store prices in Trichy.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search accessories by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 border border-slate-200 focus:outline-none"
          >
            <option value="default">Featured / Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Product List Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No products found</h3>
          <p className="text-xs text-slate-400">Try changing your search term or category filter.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearch(''); }}
            className="text-xs font-bold text-brand-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-square bg-slate-50 p-4 overflow-hidden">
                <img
                  src={prod.image_url || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'}
                  alt={prod.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                />

                {prod.original_price && (
                  <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Save ₹{prod.original_price - prod.price}
                  </span>
                )}

                <button
                  onClick={() => setQuickViewProduct(prod)}
                  className="absolute bottom-2.5 right-2.5 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {prod.category_name}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-1 mt-0.5">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-extrabold text-navy-850 font-display">
                      ₹{prod.price}
                    </span>
                    {prod.original_price && (
                      <span className="text-xs line-through text-slate-400">
                        ₹{prod.original_price}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => { addToCart(prod); setIsCartOpen(true); }}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-brand-600/20 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setQuickViewProduct(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 z-10 space-y-4 animate-in zoom-in-95">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video bg-slate-50 rounded-2xl p-4 flex items-center justify-center">
              <img
                src={quickViewProduct.image_url}
                alt={quickViewProduct.name}
                className="h-full object-contain mix-blend-multiply"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-brand-600 uppercase">
                {quickViewProduct.category_name}
              </span>
              <h3 className="text-xl font-bold font-display text-slate-900 mt-1">
                {quickViewProduct.name}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {quickViewProduct.description}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Confirmed Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-brand-600 font-display">
                    ₹{quickViewProduct.price}
                  </span>
                  {quickViewProduct.original_price && (
                    <span className="text-sm line-through text-slate-400">
                      ₹{quickViewProduct.original_price}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(quickViewProduct);
                  setQuickViewProduct(null);
                  setIsCartOpen(true);
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
              >
                Add to Cart
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400">
              Warranty details available at the time of service.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}