import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ setCurrentRoute }) {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal } = useCart();
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="font-display font-bold text-lg text-navy-850">Your Cart</h2>
              <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">{items.length} items</span>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-700 text-base">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 mt-1">Browse our verified mobile accessories and add items.</p>
                </div>
                <button onClick={() => { setIsCartOpen(false); setCurrentRoute('products'); }} className="text-xs font-bold bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
                  Shop Accessories Now
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 shadow-sm">
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200'} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 text-xs line-clamp-1">{item.name}</h4>
                    <p className="font-bold text-brand-600 text-sm mt-0.5">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-brand-600 text-slate-500"><Minus className="w-3 h-3" /></button>
                        <span className="px-2 text-xs font-bold text-slate-700">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-brand-600 text-slate-500"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 p-1" title="Remove item"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-sm">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-extrabold text-navy-850 text-base">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-600">
                <span>Doorstep Delivery in Trichy</span>
                <span className="font-bold">Available (COD / UPI)</span>
              </div>
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button onClick={() => { setIsCartOpen(false); setCurrentRoute('cart'); }} className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 py-2.5 rounded-xl hover:bg-slate-100">
                  View Full Cart
                </button>
                <button onClick={() => { setIsCartOpen(false); setCurrentRoute('checkout'); }} className="w-full text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-md">
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}