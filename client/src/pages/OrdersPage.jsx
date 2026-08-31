import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, ShieldCheck, ArrowRight, Printer, X, ShoppingBag } from 'lucide-react';

export default function OrdersPage({ setCurrentRoute }) {
  const { user, token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetch('/api/orders/my-orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [isAuthenticated, token]);

  const viewInvoice = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/invoice/${orderId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedInvoice(data.invoice);
      }
    } catch (err) {
      console.error('Error loading invoice:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Completed</span>;
      case 'Processing':
        return <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">Processing</span>;
      case 'Confirmed':
        return <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800">Confirmed</span>;
      case 'Ready':
        return <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">Ready</span>;
      case 'Cancelled':
        return <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">Pending</span>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 antialiased">
        <Package className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold font-display text-navy-850">Customer Login Required</h2>
        <p className="text-xs text-slate-500">Please sign in to view your order history and invoices.</p>
        <button
          onClick={() => setCurrentRoute('login')}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl shadow-md"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 antialiased">
      <div>
        <h1 className="text-2xl font-bold font-display text-navy-850">My Customer Orders</h1>
        <p className="text-xs text-slate-500">View your purchase history and order invoices.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No orders placed yet</h3>
          <p className="text-xs text-slate-400">Discover verified accessories and place your first order.</p>
          <button
            onClick={() => setCurrentRoute('products')}
            className="bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md mt-2"
          >
            Shop Accessories
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-navy-900 text-sm">{ord.order_number}</span>
                  {getStatusBadge(ord.order_status)}
                </div>
                <div className="text-xs text-slate-400">
                  Placed on: {new Date(ord.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-50">
                {ord.items?.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{item.product_name}</span>
                      <span className="text-slate-400">× {item.quantity}</span>
                    </div>
                    <span className="font-extrabold text-slate-900">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Total Payable: </span>
                  <span className="text-base font-extrabold text-brand-600 font-display">₹{ord.total_amount}</span>
                  <span className="text-slate-400 ml-2">({ord.payment_method})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => viewInvoice(ord.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" /> View Invoice
                  </button>
                  <button
                    onClick={() => setCurrentRoute('booking-tracking')}
                    className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold"
                  >
                    Track Status
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-navy-850 font-display">Invoice: {selectedInvoice.invoice_number}</h3>
                <p className="text-xs text-slate-400">RVK MOBILES — Official Order Receipt</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-slate-400">Customer Name:</p>
                  <p className="font-bold text-slate-800">{selectedInvoice.customer_name}</p>
                </div>
                <div>
                  <p className="text-slate-400">Order Number:</p>
                  <p className="font-mono font-bold text-brand-600">{selectedInvoice.order_number}</p>
                </div>
                <div>
                  <p className="text-slate-400">Contact Phone:</p>
                  <p className="font-bold text-slate-800">{selectedInvoice.customer_phone}</p>
                </div>
                <div>
                  <p className="text-slate-400">Order Status:</p>
                  <p className="font-bold text-slate-800">{selectedInvoice.order_status}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 mb-2">Itemized Products</h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {selectedInvoice.items?.map((item) => (
                    <div key={item.id} className="p-2.5 flex justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{item.product_name}</p>
                        <p className="text-slate-400">Qty {item.quantity} × ₹{item.unit_price}</p>
                      </div>
                      <span className="font-bold text-slate-900">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-brand-50 rounded-xl flex justify-between items-center">
                <span className="font-bold text-brand-900">Total Invoice Amount</span>
                <span className="text-xl font-black text-brand-600 font-display">₹{selectedInvoice.total_amount}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center space-y-1">
                <p>Proprietor: Krishna Moorthy • 8610903892 / 8608103543</p>
                <p>Vanapatrai Kovil, Teppakulam Bazaar, Trichy</p>
                <p className="text-slate-500 font-semibold">{selectedInvoice.store?.warranty}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-navy-850 hover:bg-navy-900 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}