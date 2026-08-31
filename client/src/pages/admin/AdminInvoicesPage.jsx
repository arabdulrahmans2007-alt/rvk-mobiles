import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Printer, Search, RefreshCw } from 'lucide-react';

export default function AdminInvoicesPage() {
  const { adminToken } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/invoices', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setInvoices(data.invoices || []);
        setLoading(false);
      });
  }, [adminToken]);

  return (
    <div className="space-y-6 antialiased">
      <div>
        <h2 className="text-xl font-bold font-display text-white">Order Invoices & Billing</h2>
        <p className="text-xs text-slate-400">View official order invoices generated for customers in Trichy.</p>
      </div>

      <div className="bg-navy-850 rounded-2xl border border-navy-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">No invoices generated yet.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-700">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/60 text-slate-300">
              {invoices.map(i => (
                <tr key={i.id} className="hover:bg-navy-800/50">
                  <td className="py-3 px-4 font-mono font-bold text-white">{i.invoice_number}</td>
                  <td className="py-3 px-4 font-mono text-brand-300">{i.order_number}</td>
                  <td className="py-3 px-4 font-bold text-white">{i.customer_name}</td>
                  <td className="py-3 px-4 font-black text-brand-400">₹{i.total_amount}</td>
                  <td className="py-3 px-4 text-slate-400">{i.payment_method}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      i.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}