import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Check, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const { adminToken } = useAuth();
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setSettings(data.settings || {});
      });
  }, [adminToken]);

  const handleChange = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(settings)
      });

      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 antialiased">
      <div>
        <h2 className="text-xl font-bold font-display text-white">Store Configuration & Service Parameters</h2>
        <p className="text-xs text-slate-400">Configure verified business details, contact helplines, and travel charge rules.</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" /> Store settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-navy-850 p-6 sm:p-8 rounded-3xl border border-navy-700 space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Store Brand Name</label>
            <input
              type="text"
              value={settings.store_name || 'RVK MOBILES'}
              onChange={(e) => handleChange('store_name', e.target.value)}
              className="w-full bg-navy-800 text-white rounded-xl px-3 py-2.5 border border-navy-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Business Proprietor</label>
            <input
              type="text"
              value={settings.owner_name || 'Krishna Moorthy'}
              onChange={(e) => handleChange('owner_name', e.target.value)}
              className="w-full bg-navy-800 text-white rounded-xl px-3 py-2.5 border border-navy-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Primary Phone Helpline</label>
            <input
              type="text"
              value={settings.store_phone_1 || '8610903892'}
              onChange={(e) => handleChange('store_phone_1', e.target.value)}
              className="w-full bg-navy-800 text-white rounded-xl px-3 py-2.5 border border-navy-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Secondary Phone Helpline</label>
            <input
              type="text"
              value={settings.store_phone_2 || '8608103543'}
              onChange={(e) => handleChange('store_phone_2', e.target.value)}
              className="w-full bg-navy-800 text-white rounded-xl px-3 py-2.5 border border-navy-700"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-300 font-bold">Store Address</label>
            <input
              type="text"
              value={settings.store_address || 'Vanapatrai Kovil, Teppakulam Bazaar, Trichy'}
              onChange={(e) => handleChange('store_address', e.target.value)}
              className="w-full bg-navy-800 text-white rounded-xl px-3 py-2.5 border border-navy-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Doorstep Free Travel Radius (KM)</label>
            <input
              type="number"
              value={settings.doorstep_radius_km || 20}
              onChange={(e) => handleChange('doorstep_radius_km', e.target.value)}
              className="w-full bg-navy-800 text-white rounded-xl px-3 py-2.5 border border-navy-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Rate Per Extra KM Beyond 20KM (₹)</label>
            <input
              type="number"
              value={settings.doorstep_extra_km_rate || 10}
              onChange={(e) => handleChange('doorstep_extra_km_rate', e.target.value)}
              className="w-full bg-navy-800 text-white rounded-xl px-3 py-2.5 border border-navy-700"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-300 font-bold">Official Warranty Policy Statement</label>
            <input
              type="text"
              value={settings.warranty_policy || 'Warranty details available at the time of service.'}
              onChange={(e) => handleChange('warranty_policy', e.target.value)}
              className="w-full bg-navy-800 text-white rounded-xl px-3 py-2.5 border border-navy-700"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-navy-700 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}