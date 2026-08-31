import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { Bell, CheckCheck, Tag, Smartphone, Sparkles, ArrowRight, Clock } from 'lucide-react';

export default function NotificationsPage({ setCurrentRoute }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-navy-850">Notifications & Alerts</h1>
            <p className="text-xs text-slate-500">Live in-app updates for offers, service requests, and orders.</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="self-start sm:self-auto text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Bell className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">No notifications yet</h3>
            <p className="text-xs text-slate-400">You will receive alerts here when new offers or status updates are published.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.is_read) markAsRead(n.id);
                if (n.target_url) {
                  const r = n.target_url.replace('/', '').split('?')[0] || 'offers';
                  setCurrentRoute(r);
                }
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                n.is_read
                  ? 'bg-white border-slate-200 opacity-85 hover:border-slate-300'
                  : 'bg-brand-50/60 border-brand-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {n.type === 'offer' ? <Tag className="w-5 h-5" /> : n.type === 'booking' ? <Smartphone className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{n.title}</h3>
                    {!n.is_read && (
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-600 text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{n.message}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.created_at || Date.now()).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>
              </div>

              <button className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-end sm:self-center">
                View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}