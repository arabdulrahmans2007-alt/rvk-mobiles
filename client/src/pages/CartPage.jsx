import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartPage({ setCurrentRoute }) {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 antialiased">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-navy-850 font-display">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Browse our verified mobile accessories and screen protection items in Trichy.
        </p>
        <button
          onClick={() => setCurrentRoute('products')}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl shadow-md transition-all"
        >
          Explore Catalog Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 antialiased">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-navy-850">Your Shopping Cart</h1>
          <p className="text-xs text-slate-500">{items.length} items selected for purchase</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-500 hover:text-red-700 font-semibold"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200'}
                  alt={item.name}
                  className="w-16 h-16 object-contain rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h3>
                  <p className="text-xs font-bold text-brand-600 mt-0.5">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1.5 hover:text-brand-600 text-slate-500"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1.5 hover:text-brand-600 text-slate-500"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-extrabold text-navy-900 text-sm w-16 text-right">
                  ₹{item.price * item.quantity}
                </span>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => setCurrentRoute('products')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Add more products
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-base text-navy-850 font-display">Order Summary</h2>

          <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-3">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-800">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Trichy Delivery Fee</span>
              <span className="font-bold">FREE</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="font-bold text-sm text-navy-850">Total Amount</span>
            <span className="text-2xl font-black text-brand-600 font-display">₹{subtotal}</span>
          </div>

          <button
            onClick={() => setCurrentRoute('checkout')}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-slate-400">
            Payment on Delivery (Cash / UPI) accepted in Trichy.
          </p>
        </div>
      </div>
    </div>
  );
}