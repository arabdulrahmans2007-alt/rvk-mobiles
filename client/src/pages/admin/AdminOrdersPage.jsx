import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Search, Filter, CheckCircle2, Eye, Printer, X, RefreshCw } from 'lucide-react';

export default function AdminOrdersPage() {
  const { adminToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    let url = `/api/orders/admin/all?status=${statusFilter}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching admin orders:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [adminToken, statusFilter]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/admin/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ order_status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, order_status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  return (
    <div className="space-y-6 antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Customer Order Management</h2>
          <p className="text-xs text-slate-400">Review incoming product orders and update delivery lifecycle.</p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-navy-850 p-4 rounded-2xl border border-navy-700 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by Order #, Name, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchOrders(); }}
            className="w-full bg-navy-800 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 border border-navy-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {['all', 'Pending', 'Confirmed', 'Processing', 'Ready', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-navy-800 text-slate-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-navy-850 rounded-2xl border border-navy-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-700">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items / Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/60 text-slate-300">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-navy-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {ord.order_number}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {new Date(ord.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{ord.customer_name}</p>
                      <p className="text-slate-400">{ord.customer_phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-extrabold text-brand-400">₹{ord.total_amount}</p>
                      <p className="text-[10px] text-slate-400">{ord.items?.length || 1} item(s)</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-300 block">{ord.payment_method}</span>
                      <span className={`text-[10px] ${ord.payment_status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.order_status}
                        onChange={(e) => updateStatus(ord.id, e.target.value)}
                        className="bg-navy-800 text-white text-xs rounded-lg px-2 py-1 border border-navy-600 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-brand-400 hover:text-brand-300"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-navy-850 rounded-3xl border border-navy-700 max-w-lg w-full p-6 space-y-5 text-white animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <div>
                <h3 className="font-bold text-base font-display">Order Details: {selectedOrder.order_number}</h3>
                <p className="text-[11px] text-slate-400">Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-navy-800 rounded-xl space-y-1">
                <p><span className="text-slate-400">Customer:</span> <strong className="text-white">{selectedOrder.customer_name}</strong></p>
                <p><span className="text-slate-400">Phone:</span> <strong className="text-white">{selectedOrder.customer_phone}</strong></p>
                <p><span className="text-slate-400">Email:</span> {selectedOrder.customer_email}</p>
                <p><span className="text-slate-400">Delivery Address:</span> {selectedOrder.delivery_address}</p>
                {selectedOrder.notes && <p><span className="text-slate-400">Customer Notes:</span> {selectedOrder.notes}</p>}
              </div>

              <div>
                <h4 className="font-bold text-slate-300 mb-2">Order Items:</h4>
                <div className="divide-y divide-navy-700 border border-navy-700 rounded-xl overflow-hidden bg-navy-800">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="p-2.5 flex justify-between">
                      <div>
                        <p className="font-bold text-white">{item.product_name}</p>
                        <p className="text-slate-400">Qty: {item.quantity} × ₹{item.unit_price}</p>
                      </div>
                      <span className="font-bold text-brand-300">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-brand-950/60 border border-brand-800/80 rounded-xl flex justify-between items-center">
                <span className="font-bold text-slate-300">Total Order Amount</span>
                <span className="text-xl font-black text-brand-400 font-display">₹{selectedOrder.total_amount}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs py-2.5 rounded-xl"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}