import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RVKLogo from '../assets/logo';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage({ setCurrentRoute }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) {
        login(data.user, data.token);
        setCurrentRoute('home');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Network error during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 antialiased">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <RVKLogo className="h-10 w-auto mx-auto" />
          <h2 className="text-xl font-bold font-display text-navy-850 pt-2">
            Sign In to Customer Account
          </h2>
          <p className="text-xs text-slate-500">
            Access your orders, doorstep bookings, and member privileges.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              placeholder="customer@rvk.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-slate-50 rounded-xl text-center text-[11px] text-slate-500">
          Demo Customer: <strong className="text-slate-700">customer@rvk.com</strong> / Password: <strong className="text-slate-700">Customer@123</strong>
        </div>

        <div className="pt-2 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <button
            onClick={() => setCurrentRoute('register')}
            className="text-brand-600 font-bold hover:underline"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}