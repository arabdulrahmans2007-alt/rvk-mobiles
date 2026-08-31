import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Award, ShieldCheck, RefreshCw } from 'lucide-react';

export default function AdminCustomersPage() {
  const { adminToken } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCustomers = () => {
    setLoading(true);
    let url = `/api/admin/customers`;
    if (search) url += `?search=${encodeURIComponent(search)}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setCustomers(data.customers || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading customers:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, [adminToken]);

  const toggleMembership = async (userId) => {
    try {
      const res = await fetch(`/api/admin/customers/${userId}/membership`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(prev => prev.map(c => c.id === userId ? { ...c, is_member: data.is_member } : c));
      }
    } catch (err) {
      console.error('Error toggling membership:', err);
    }
  };

  return (
    <div className="space-y-6 antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Registered Customer Roster</h2>
          <p className="text-xs text-slate-400">View customer database, order histories, and toggle RVK VIP Membership.</p>
        </div>

        <button
          onClick={fetchCustomers}
          className="self-start sm:self-auto bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Roster
        </button>
      </div>

      <div className="bg-navy-850 p-4 rounded-2xl border border-navy-700 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search customer name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchCustomers(); }}
            className="w-full bg-navy-800 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 border border-navy-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="bg-navy-850 rounded-2xl border border-navy-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading customer list...
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No registered customers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-700">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">RVK Membership</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/60 text-slate-300">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-navy-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-white text-sm">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.address || 'Trichy'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{c.phone}</p>
                      <p className="text-slate-400">{c.email}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {c.order_count || 0}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-brand-300">
                      ₹{c.total_spent || 0}
                    </td>
                    <td className="py-3 px-4">
                      {c.is_member === 1 ? (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 w-max">
                          <Award className="w-3 h-3" /> VIP Member
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 bg-navy-800 px-2 py-0.5 rounded">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleMembership(c.id)}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                          c.is_member === 1
                            ? 'bg-red-950/40 text-red-400 hover:bg-red-900/50 border border-red-800'
                            : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                        }`}
                      >
                        {c.is_member === 1 ? 'Revoke VIP' : 'Grant VIP'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}