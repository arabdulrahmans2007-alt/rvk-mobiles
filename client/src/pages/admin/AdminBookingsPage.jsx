import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Truck, Search, RefreshCw, Award } from 'lucide-react';

export default function AdminBookingsPage() {
  const { adminToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    fetch('/api/services/admin/doorstep', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching doorstep bookings:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, [adminToken]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/services/admin/doorstep/${id}`, {
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
      console.error('Error updating doorstep booking:', err);
    }
  };

  return (
    <div className="space-y-6 antialiased">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Doorstep Technician Bookings</h2>
          <p className="text-xs text-slate-400">Manage doorstep technician dispatch across 20 KM radius in Trichy.</p>
        </div>
        <button onClick={fetchBookings} className="bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="bg-navy-850 rounded-2xl border border-navy-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading doorstep requests...</div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">No doorstep service requests yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-700">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Address / Distance</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Travel Charge</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/60 text-slate-300">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-navy-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {b.booking_code}
                      {b.is_rvk_member === 1 && (
                        <span className="block text-[9px] font-extrabold text-amber-400">★ RVK Member</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{b.customer_name}</p>
                      <p className="text-slate-400">{b.customer_phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-white line-clamp-1">{b.address}</p>
                      <p className="text-[10px] text-brand-400 font-bold">{b.distance_km} KM from Teppakulam</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-200">{b.preferred_date}</p>
                      <p className="text-[10px] text-slate-400">{b.preferred_time}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${b.travel_charge === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {b.travel_charge === 0 ? '₹0 (FREE)' : `₹${b.travel_charge}`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="bg-navy-800 text-white text-xs rounded-lg px-2 py-1 border border-navy-600 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Technician Assigned">Technician Assigned</option>
                        <option value="In Route">In Route</option>
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