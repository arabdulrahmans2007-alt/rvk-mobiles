import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, ArrowRight, ShieldCheck, ShoppingBag, Truck, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage({ setCurrentRoute }) {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    if (!items.length) {
      alert('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('rvk_token')}` } : {})
        },
        body: JSON.stringify({
          items,
          customer_name: name,
          customer_email: email || 'customer@rvkmobiles.com',
          customer_phone: phone,
          delivery_address: address,
          payment_method: paymentMethod,
          notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setOrderResult(data);
        clearCart();
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch {}
      } else {
        alert(data.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Network error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center antialiased">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Order Confirmed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-850 mt-2 font-display">
              Thank You for Your Order!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your order has been recorded into the RVK Mobiles database.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs text-slate-500 font-medium">Order Number:</span>
              <span className="font-mono font-extrabold text-brand-600 text-base">
                {orderResult.orderNumber}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-800">{name} ({phone})</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Payable:</span>
              <span className="font-black text-navy-900 text-sm">₹{orderResult.order?.total_amount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Payment:</span>
              <span className="font-bold text-slate-800">{paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Delivery Address:</span>
              <span className="font-bold text-slate-800 line-clamp-1">{address}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setCurrentRoute('orders')}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              View My Orders <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentRoute('products')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 antialiased">
      <div>
        <h1 className="text-2xl font-bold font-display text-navy-850">Checkout</h1>
        <p className="text-xs text-slate-500">Enter delivery details for your order in Trichy.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Customer & Address Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="font-bold text-base text-navy-850 font-display">Delivery Details</h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Complete Delivery Address in Trichy</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Door No, Street Name, Area, Landmark, Trichy"
                className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700">Payment Option</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-3 rounded-xl border-2 cursor-pointer flex flex-col justify-between ${paymentMethod === 'Cash on Delivery' ? 'border-brand-600 bg-brand-50/40' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="payment" checked={paymentMethod === 'Cash on Delivery'} onChange={() => setPaymentMethod('Cash on Delivery')} />
                    <span className="font-bold text-xs text-slate-800">Cash on Delivery</span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border-2 cursor-pointer flex flex-col justify-between ${paymentMethod === 'UPI on Delivery' ? 'border-brand-600 bg-brand-50/40' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="payment" checked={paymentMethod === 'UPI on Delivery'} onChange={() => setPaymentMethod('UPI on Delivery')} />
                    <span className="font-bold text-xs text-slate-800">UPI on Delivery</span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border-2 cursor-pointer flex flex-col justify-between ${paymentMethod === 'Pay at Shop' ? 'border-brand-600 bg-brand-50/40' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="payment" checked={paymentMethod === 'Pay at Shop'} onChange={() => setPaymentMethod('Pay at Shop')} />
                    <span className="font-bold text-xs text-slate-800">Pay at Store</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Order Delivery Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please call before delivery"
                className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-base text-navy-850 font-display">Items in Order ({items.length})</h2>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex-1 pr-2">
                  <p className="font-bold text-slate-800 line-clamp-1">{item.name}</p>
                  <p className="text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <span className="font-extrabold text-navy-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Trichy Delivery Charge</span>
              <span className="font-bold">₹0 (FREE)</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline border-t border-slate-100 pt-3">
            <span className="font-bold text-sm text-navy-850">Total Payable</span>
            <span className="text-2xl font-black text-brand-600 font-display">₹{subtotal}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase py-3.5 rounded-xl shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting Order...' : 'Confirm & Place Order'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}