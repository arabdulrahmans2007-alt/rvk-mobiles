import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';

export default function AdminReportsPage() {
  const { adminToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/reports', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reports:', err);
        setLoading(false);
      });
  }, [adminToken]);

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-xs">Loading sales reports...</div>;
  }

  return (
    <div className="space-y-8 antialiased">
      <div>
        <h2 className="text-xl font-bold font-display text-white">Sales & Analytics Reports</h2>
        <p className="text-xs text-slate-400">Monthly gross sales, category breakdown, and order completion metrics.</p>
      </div>

      {/* Category Sales Breakdown */}
      <div className="bg-navy-850 p-6 rounded-3xl border border-navy-700 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-400" />
          Revenue by Accessory Category
        </h3>

        <div className="space-y-3">
          {data?.categoryBreakdown?.map((cat) => (
            <div key={cat.category_name} className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="font-bold text-white">{cat.category_name}</span>
                <span className="font-black text-brand-400">₹{cat.total_sales} ({cat.units_sold} units)</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: `${Math.min(100, (cat.total_sales / 2000) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data?.statusCounts?.map((s) => (
          <div key={s.order_status} className="bg-navy-850 p-5 rounded-2xl border border-navy-700 space-y-1">
            <span className="text-slate-400 text-xs">{s.order_status} Orders</span>
            <p className="text-2xl font-black text-white font-display">{s.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}