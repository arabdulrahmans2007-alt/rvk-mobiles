import React, { useState } from 'react';
import RVKLogo from '../../assets/logo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Search, Bell, ShoppingCart, User, Menu, X, Phone, ShieldCheck,
  ChevronDown, Smartphone, Tag, Clock, LogOut, Package
} from 'lucide-react';

export default function Navbar({ currentRoute, setCurrentRoute, onSearch }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const { unreadCount, setIsOpen: setIsNotifOpen, isOpen: isNotifOpen } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) onSearch(searchTerm);
      setCurrentRoute('products');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Accessories' },
    { id: 'display-service', label: 'Display Replacement' },
    { id: 'doorstep-service', label: 'Doorstep (20 KM)' },
    { id: 'membership', label: 'RVK Membership', badge: 'VIP' },
    { id: 'offers', label: 'Offers', badge: 'Special' },
    { id: 'booking-tracking', label: 'Track Service' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="bg-navy-850 text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              Trichy Helpline: <a href="tel:8610903892" className="text-white hover:text-brand-300 font-semibold ml-1">8610903892</a> / <a href="tel:8608103543" className="text-white hover:text-brand-300 font-semibold">8608103543</a>
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">📍 Vanapatrai Kovil, Teppakulam Bazaar, Trichy</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Pricing & Certified Service
            </span>
            <button onClick={() => setCurrentRoute('admin')} className="text-xs bg-navy-700 hover:bg-brand-600 px-2 py-0.5 rounded text-slate-200 transition-colors">
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          <div onClick={() => setCurrentRoute('home')} className="cursor-pointer flex-shrink-0">
            <RVKLogo className="h-10 w-auto" />
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search earphones, AirPods, tempered glass..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100/90 text-slate-800 placeholder-slate-400 text-sm rounded-full pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-full transition-all"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white animate-pulse-subtle px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-full transition-all"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-brand-600 rounded-full ring-2 ring-white px-1">
                  {totalCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-700"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div onMouseLeave={() => setProfileDropdownOpen(false)} className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      {user?.is_member === 1 && (
                        <span className="inline-block mt-1 text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          ★ RVK Member
                        </span>
                      )}
                    </div>
                    <button onClick={() => { setCurrentRoute('profile'); setProfileDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> My Profile
                    </button>
                    <button onClick={() => { setCurrentRoute('orders'); setProfileDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400" /> My Orders
                    </button>
                    <button onClick={() => { setCurrentRoute('booking-tracking'); setProfileDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" /> Track Bookings
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button onClick={() => { logout(); setProfileDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <LogOut className="w-4 h-4 text-red-500" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentRoute('login')} className="text-sm font-semibold text-slate-700 hover:text-brand-600 px-3 py-1.5 rounded-lg">
                  Login
                </button>
                <button onClick={() => setCurrentRoute('register')} className="hidden sm:inline-flex text-sm font-semibold bg-brand-600 text-white px-4 py-1.5 rounded-lg hover:bg-brand-700 shadow-sm">
                  Register
                </button>
              </div>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <nav className="hidden lg:flex items-center justify-between py-2.5 border-t border-slate-100 text-sm font-medium">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentRoute(link.id)}
                  className={`relative py-1 flex items-center gap-1.5 transition-colors ${isActive ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-navy-850'}`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                      {link.badge}
                    </span>
                  )}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />}
                </button>
              );
            })}
          </div>
          <button onClick={() => setCurrentRoute('display-service')} className="text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-brand-600 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-brand-400" /> Book Screen Repair
          </button>
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Search accessories & services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 text-sm rounded-lg pl-10 pr-4 py-2 border border-slate-200 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { setCurrentRoute(link.id); setMobileMenuOpen(false); }}
                className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${currentRoute === link.id ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-700 bg-slate-50'}`}
              >
                <span>{link.label}</span>
                {link.badge && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-100 text-brand-700 rounded">{link.badge}</span>}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Owner: Krishna Moorthy</span>
            <button onClick={() => { setCurrentRoute('admin'); setMobileMenuOpen(false); }} className="text-brand-600 font-semibold">Admin Login →</button>
          </div>
        </div>
      )}
    </header>
  );
}