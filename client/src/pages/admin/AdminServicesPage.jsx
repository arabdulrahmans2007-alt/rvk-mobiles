import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Smartphone, Search, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminServicesPage() {
  const { adminToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    fetch('/api/services/admin/display', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching display services:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, [adminToken]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/services/admin/display/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="space-y-6 antialiased">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Display Replacement Bookings</h2>
          <p className="text-xs text-slate-400">Track and update customer mobile screen repair inquiries.</p>
        </div>
        <button onClick={fetchBookings} className="bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="bg-navy-850 rounded-2xl border border-navy-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">No display service bookings yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-700">
                <tr>
                  <th className="py-3 px-4">Booking Code</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Device & Display</th>
                  <th className="py-3 px-4">Estimated Rate</th>
                  <th className="py-3 px-4">Service Mode</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/60 text-slate-300">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-navy-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">{b.booking_code}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{b.customer_name}</p>
                      <p className="text-slate-400">{b.customer_phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{b.device_brand} {b.device_model}</p>
                      <p className="text-[10px] text-brand-400">{b.display_type}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-200">{b.estimated_price}</td>
                    <td className="py-3 px-4 font-medium">{b.service_type}</td>
                    <td className="py-3 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="bg-navy-800 text-white text-xs rounded-lg px-2 py-1 border border-navy-600 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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