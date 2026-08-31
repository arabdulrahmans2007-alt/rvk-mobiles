import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Award, Phone, Mail, MapPin, Package, Clock, ShieldCheck, Check } from 'lucide-react';

export default function ProfilePage({ setCurrentRoute }) {
  const { user, token, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone, address })
      });

      const data = await res.json();
      if (data.success) {
        setSaved(true);
        refreshProfile();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 antialiased">
      {/* Profile Header */}
      <div className="bg-navy-900 text-white rounded-3xl p-6 sm:p-8 border border-navy-700 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center font-black text-2xl text-white shadow-lg">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl font-bold font-display">{user?.name}</h1>
              {user?.is_member === 1 ? (
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ★ RVK Member
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 bg-navy-800 px-2 py-0.5 rounded-full">
                  Customer
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentRoute('orders')}
            className="bg-navy-800 hover:bg-navy-750 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-navy-700 flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5 text-brand-400" />
            My Orders
          </button>
          <button
            onClick={() => setCurrentRoute('booking-tracking')}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            Track Services
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold font-display text-navy-850 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-600" />
          Account Details & Address
        </h2>

        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Mobile Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Primary Delivery Address in Trichy</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Door No, Street Name, Area, Landmark, Trichy"
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}