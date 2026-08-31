import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Send, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminNotificationsPage() {
  const { adminToken } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('general');
  const [targetUrl, setTargetUrl] = useState('/offers');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const fetchLogs = () => {
    setLoading(true);
    fetch('/api/notifications/admin/logs', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setLogs(data.notifications || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, [adminToken]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/notifications/admin/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          title,
          message,
          type,
          target_url: targetUrl,
          is_broadcast: 1
        })
      });

      const data = await res.json();
      if (data.success) {
        setTitle('');
        setMessage('');
        setSentSuccess(true);
        fetchLogs();
        setTimeout(() => setSentSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error sending broadcast:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 antialiased">
      <div>
        <h2 className="text-xl font-bold font-display text-white">In-App Notification Center</h2>
        <p className="text-xs text-slate-400">Broadcast notifications to active users and inspect delivery logs.</p>
      </div>

      {/* Broadcast Form */}
      <div className="bg-navy-850 p-6 rounded-3xl border border-navy-700 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-brand-400" />
          Send In-App Broadcast to All Customers
        </h3>

        {sentSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Notification delivered to all active customers.
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold">Notification Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="🔥 Hot Deal / Service Alert"
                className="w-full bg-navy-800 text-white rounded-xl px-3 py-2.5 border border-navy-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-bold">Target Route / Link</label>
              <select
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-navy-800 text-white rounded-xl px-3 py-2.5 border border-navy-700"
              >
                <option value="/offers">Offers Page (/offers)</option>
                <option value="/products">Products Page (/products)</option>
                <option value="/display-service">Display Service (/display-service)</option>
                <option value="/doorstep-service">Doorstep Service (/doorstep-service)</option>
                <option value="/membership">RVK Membership (/membership)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Notification Message</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Enter message visible in customer notification bell..."
              className="w-full bg-navy-800 text-white rounded-xl px-3 py-2.5 border border-navy-700"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            {sending ? 'Broadcasting...' : 'Send In-App Notification'}
          </button>
        </form>
      </div>

      {/* History Table */}
      <div className="bg-navy-850 rounded-2xl border border-navy-700 overflow-hidden">
        <div className="p-4 border-b border-navy-700 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Sent Notifications Log</h3>
          <button onClick={fetchLogs} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading logs...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-700">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Sent Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/60 text-slate-300">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-navy-800/50">
                  <td className="py-3 px-4 font-bold text-white">{l.title}</td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-400">{l.message}</td>
                  <td className="py-3 px-4">{l.type}</td>
                  <td className="py-3 px-4 text-brand-300 font-mono text-[11px]">{l.target_url}</td>
                  <td className="py-3 px-4 text-slate-400">{new Date(l.created_at).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}