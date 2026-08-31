import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Users, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminMembershipPage() {
  const { adminToken } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/customers', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCustomers(data.customers?.filter(c => c.is_member === 1) || []);
        }
        setLoading(false);
      });
  }, [adminToken]);

  return (
    <div className="space-y-6 antialiased">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-white">RVK Elite Membership Roster</h2>
          <p className="text-xs text-slate-400">Manage VIP members entitled to ₹0 travel charges at any distance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-navy-850 p-5 rounded-2xl border border-navy-700 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Award className="w-4 h-4" /> Active VIP Members
          </div>
          <span className="text-3xl font-black text-white font-display">{customers.length}</span>
          <p className="text-[11px] text-slate-400">Customers with unlimited doorstep travel fee waiver.</p>
        </div>

        <div className="bg-navy-850 p-5 rounded-2xl border border-navy-700 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" /> Member Privilege Rule
          </div>
          <p className="text-xs text-slate-300">₹0 extra travel / petrol charge for doorstep technician across ANY distance in Trichy district.</p>
        </div>
      </div>

      <div className="bg-navy-850 rounded-2xl border border-navy-700 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading members...</div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">No active VIP members currently. Grant membership from Customers tab.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-700">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/60 text-slate-300">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-navy-800/50">
                  <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                  <td className="py-3 px-4">{c.phone}</td>
                  <td className="py-3 px-4">{c.email}</td>
                  <td className="py-3 px-4">{c.address || 'Trichy'}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                      ★ Active VIP
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