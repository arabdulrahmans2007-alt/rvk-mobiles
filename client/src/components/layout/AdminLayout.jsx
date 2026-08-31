import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import RVKLogo from '../../assets/logo';
import {
  LayoutDashboard, ShoppingBag, Users, Smartphone, Truck, Shield,
  Tag, Bell, FileText, BarChart3, Settings, UserCheck, LogOut,
  ExternalLink, Menu, X, ChevronRight, Store
} from 'lucide-react';

export default function AdminLayout({ adminRoute, setAdminRoute, setCurrentRoute, children }) {
  const { admin, adminLogout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products & Stock', icon: Store },
    { id: 'display-services', label: 'Display Services', icon: Smartphone },
    { id: 'doorstep-bookings', label: 'Doorstep Bookings', icon: Truck },
    { id: 'membership', label: 'Membership', icon: Shield },
    { id: 'offers', label: 'Offers System', icon: Tag },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'reports', label: 'Sales Reports', icon: BarChart3 },
    { id: 'settings', label: 'Store Settings', icon: Settings },
    { id: 'admin-users', label: 'Admin Accounts', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 z-50 w-64 bg-navy-900 border-r border-navy-700/80 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-navy-700 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => setCurrentRoute('home')}>
            <RVKLogo dark={true} className="h-8 w-auto" />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Badge */}
        <div className="px-4 py-3 bg-navy-850 border-b border-navy-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center font-bold text-xs text-white">
              {admin?.full_name ? admin.full_name[0] : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{admin?.full_name || 'Admin'}</p>
              <p className="text-[10px] text-slate-400 truncate">{admin?.email}</p>
            </div>
          </div>
          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {admin?.role || 'Admin'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-medium">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setAdminRoute(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-navy-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-navy-700/80 space-y-2">
          <button
            onClick={() => setCurrentRoute('home')}
            className="w-full text-xs font-semibold text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-750 px-3 py-2 rounded-xl flex items-center justify-center gap-2 border border-navy-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
            Visit Customer Website
          </button>
          <button
            onClick={adminLogout}
            className="w-full text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 px-3 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out of Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-navy-900/90 backdrop-blur-md border-b border-navy-700/80 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-300 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-wider">
                {menuItems.find(m => m.id === adminRoute)?.label || 'Control Portal'}
              </h1>
              <p className="text-[11px] text-slate-400">RVK MOBILES Enterprise Management Suite</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 bg-navy-800 px-3 py-1.5 rounded-full border border-navy-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live System Active
            </span>
            <button
              onClick={() => setCurrentRoute('home')}
              className="text-xs bg-brand-600 hover:bg-brand-700 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Site
            </button>
          </div>
        </header>

        {/* Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}