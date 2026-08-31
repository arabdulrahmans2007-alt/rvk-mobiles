import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import RVKLogo from '../../assets/logo';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function AdminLoginPage({ onLoginSuccess }) {
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState('admin@rvkmobiles.com');
  const [password, setPassword] = useState('Admin@RVK2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) {
        adminLogin(data.admin, data.token);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(data.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Network error during admin authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white flex items-center justify-center p-4 antialiased">
      <div className="max-w-md w-full bg-navy-850 rounded-3xl p-8 sm:p-10 border border-navy-700 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <RVKLogo dark={true} className="h-10 w-auto mx-auto" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-800 text-[11px] font-bold text-brand-300 border border-navy-700 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            PROTECTED CONTROL CENTER
          </div>
          <h2 className="text-xl font-bold font-display text-white pt-1">
            Admin Management Login
          </h2>
          <p className="text-xs text-slate-400">
            Sign in with administrative credentials to manage store operations.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Admin Email or Username</label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-navy-800 text-white text-sm rounded-xl pl-10 pr-4 py-3 border border-navy-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Admin Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-navy-800 text-white text-sm rounded-xl pl-10 pr-4 py-3 border border-navy-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase py-3.5 rounded-xl shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating Admin...' : 'Authorize Access'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-4 bg-navy-800/80 rounded-2xl border border-navy-700 text-left space-y-1.5">
          <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            Default Development Credentials:
          </p>
          <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
            <p>Username: <span className="text-white">admin@rvkmobiles.com</span></p>
            <p>Password: <span className="text-white">Admin@RVK2026</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}