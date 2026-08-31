import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Bell, CheckCheck, X, Sparkles, Tag, Smartphone, ArrowRight } from 'lucide-react';

export default function NotificationPopover({ setCurrentRoute }) {
  const { notifications, unreadCount, isOpen, setIsOpen, markAsRead, markAllAsRead } = useNotification();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-4 sm:p-6 pointer-events-none">
      <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-transparent pointer-events-auto" />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col pointer-events-auto z-10 max-h-[85vh] animate-in fade-in slide-in-from-top-4">
        <div className="p-4 bg-navy-850 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-400" />
            <h3 className="font-display font-bold text-sm">Notifications</h3>
            {unreadCount > 0 && <span className="text-[10px] font-extrabold bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadCount} new</span>}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 hover:underline">
                <CheckCheck className="w-3.5 h-3.5 text-brand-400" /> Read all
              </button>
            )}
            <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.is_read) markAsRead(n.id);
                  if (n.target_url) {
                    const route = n.target_url.replace('/', '').split('?')[0] || 'offers';
                    setCurrentRoute(route);
                    setIsOpen(false);
                  }
                }}
                className={`p-3 rounded-xl transition-all cursor-pointer flex gap-3 ${n.is_read ? 'bg-white hover:bg-slate-50 opacity-80' : 'bg-brand-50/70 hover:bg-brand-50 border border-brand-100'}`}
              >
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {n.type === 'offer' ? <Tag className="w-4 h-4" /> : n.type === 'booking' ? <Smartphone className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{n.title}</h4>
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                  <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-400">
                    <span>{new Date(n.created_at || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    <span className="text-brand-600 font-semibold flex items-center gap-0.5">View details <ArrowRight className="w-2.5 h-2.5" /></span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button onClick={() => { setIsOpen(false); setCurrentRoute('offers'); }} className="text-xs font-bold text-brand-600 hover:text-brand-700">
            Browse All Active Offers →
          </button>
        </div>
      </div>
    </div>
  );
}