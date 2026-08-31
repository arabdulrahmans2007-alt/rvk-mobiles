import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingBag, Clock, CheckCircle2, Users, Truck, Tag, Bell,
  DollarSign, ArrowUpRight, TrendingUp, Smartphone, ArrowRight, ShieldCheck
} from 'lucide-react';

export default function AdminDashboardPage({ setAdminRoute }) {
  const { adminToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard stats:', err);
        setLoading(false);
      });
  }, [adminToken]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading Admin Dashboard...
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-8 antialiased">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-850 to-navy-800 p-6 rounded-3xl border border-navy-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Operations & Sales Overview</h2>
          <p className="text-xs text-slate-400 mt-1">Live customer orders, technician bookings, and store metrics in Trichy.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdminRoute('offers')}
            className="text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <Tag className="w-3.5 h-3.5" />
            Publish Today's Offer
          </button>
          <button
            onClick={() => setAdminRoute('notifications')}
            className="text-xs font-bold bg-navy-700 hover:bg-navy-650 text-slate-200 border border-navy-600 px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Bell className="w-3.5 h-3.5 text-brand-400" />
            Send In-App Broadcast
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div onClick={() => setAdminRoute('orders')} className="bg-navy-850 p-5 rounded-2xl border border-navy-700 hover:border-brand-500 transition-all cursor-pointer space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-brand-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-display">{stats.totalOrders}</span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
              {stats.pendingOrders} Pending
            </span>
          </div>
        </div>

        {/* Revenue */}
        <div onClick={() => setAdminRoute('reports')} className="bg-navy-850 p-5 rounded-2xl border border-navy-700 hover:border-brand-500 transition-all cursor-pointer space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Revenue Recorded</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-display">₹{stats.totalRevenue || 0}</span>
            <span className="text-[10px] text-emerald-400 font-bold">Gross Sales</span>
          </div>
        </div>

        {/* Customers */}
        <div onClick={() => setAdminRoute('customers')} className="bg-navy-850 p-5 rounded-2xl border border-navy-700 hover:border-brand-500 transition-all cursor-pointer space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Customers</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-display">{stats.totalCustomers}</span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
              {stats.totalMembers} Members
            </span>
          </div>
        </div>

        {/* Today's Bookings */}
        <div onClick={() => setAdminRoute('doorstep-bookings')} className="bg-navy-850 p-5 rounded-2xl border border-navy-700 hover:border-brand-500 transition-all cursor-pointer space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today's Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-display">{stats.todayBookings}</span>
            <span className="text-[10px] text-brand-300 font-bold">Screen & Doorstep</span>
          </div>
        </div>
      </div>

      {/* Active Today's Offer Live Status */}
      <div className="bg-navy-850 p-6 rounded-3xl border border-navy-700 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-brand-400" />
            Active Today's Offer on Homepage
          </h3>
          <button
            onClick={() => setAdminRoute('offers')}
            className="text-xs text-brand-400 hover:underline font-bold"
          >
            Manage Offers →
          </button>
        </div>

        {data?.todaysOffer ? (
          <div className="p-4 bg-navy-800 rounded-2xl border border-navy-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase bg-brand-500 text-white px-2 py-0.5 rounded">
                {data.todaysOffer.badge || "TODAY'S SPECIAL"}
              </span>
              <h4 className="font-bold text-sm text-white mt-1">{data.todaysOffer.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{data.todaysOffer.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xl font-black text-brand-400 font-display">₹{data.todaysOffer.offer_price}</span>
              <p className="text-[10px] text-slate-400">Live on customer homepage</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">No active Today's Offer is set. Publish one from the Offers module.</p>
        )}
      </div>

      {/* Recent Orders & Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-navy-850 p-6 rounded-3xl border border-navy-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-400" />
              Recent Orders
            </h3>
            <button onClick={() => setAdminRoute('orders')} className="text-xs text-brand-400 hover:underline">
              View All
            </button>
          </div>

          <div className="divide-y divide-navy-700/60">
            {data?.recentOrders?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No recent orders</p>
            ) : (
              data?.recentOrders?.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-white block">{ord.order_number}</span>
                    <span className="text-slate-400">{ord.customer_name} ({ord.customer_phone})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-brand-300 block">₹{ord.total_amount}</span>
                    <span className="text-[10px] font-semibold text-amber-400">{ord.order_status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Doorstep Bookings */}
        <div className="bg-navy-850 p-6 rounded-3xl border border-navy-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-400" />
              Recent Doorstep Requests
            </h3>
            <button onClick={() => setAdminRoute('doorstep-bookings')} className="text-xs text-brand-400 hover:underline">
              View All
            </button>
          </div>

          <div className="divide-y divide-navy-700/60">
            {data?.recentDoorstep?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No doorstep bookings</p>
            ) : (
              data?.recentDoorstep?.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-white block">{b.booking_code}</span>
                    <span className="text-slate-400">{b.customer_name} • {b.distance_km} KM</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 block">{b.status}</span>
                    <span className="text-[10px] text-slate-400">{b.preferred_date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}