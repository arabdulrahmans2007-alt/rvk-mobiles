const fs = require('fs');
const path = require('path');

function save(rel, code) {
  const p = path.join(__dirname, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, code.trim() + '\n', 'utf8');
  console.log('Saved:', rel);
}

// 1. Navbar.jsx
save('client/src/components/layout/Navbar.jsx', `
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
`);

// 2. Footer.jsx
save('client/src/components/layout/Footer.jsx', `
import React from 'react';
import RVKLogo from '../../assets/logo';
import { Phone, MapPin, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

export default function Footer({ setCurrentRoute }) {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-14 pb-8 border-t border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-700/60">
          <div className="space-y-4">
            <RVKLogo dark={true} className="h-10 w-auto" />
            <p className="text-sm text-slate-400 leading-relaxed">
              Professional mobile display replacement, certified doorstep technician services within 20 KM, and verified daily smartphone accessories in Trichy.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Proprietor:</span>
                <span className="font-bold text-white">Krishna Moorthy</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                <span>Mon – Sun: 9:30 AM – 9:30 PM</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-display font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-brand-500 rounded-sm"></span> Core Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => setCurrentRoute('display-service')} className="hover:text-brand-400 flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5 text-slate-500" /> LCD Display (₹999 – ₹1,399)</button></li>
              <li><button onClick={() => setCurrentRoute('display-service')} className="hover:text-brand-400 flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5 text-slate-500" /> LED Display (₹2,500 – ₹3,999)</button></li>
              <li><button onClick={() => setCurrentRoute('display-service')} className="hover:text-brand-400 flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5 text-slate-500" /> Curved Display (Secret Offers)</button></li>
              <li><button onClick={() => setCurrentRoute('doorstep-service')} className="hover:text-brand-400 flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5 text-slate-500" /> Doorstep Service (20 KM Radius)</button></li>
              <li><button onClick={() => setCurrentRoute('membership')} className="hover:text-brand-400 flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5 text-slate-500" /> RVK Membership Benefits</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-brand-500 rounded-sm"></span> Customer Care
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => setCurrentRoute('products')} className="hover:text-brand-400">Mobile Accessories Store</button></li>
              <li><button onClick={() => setCurrentRoute('offers')} className="hover:text-brand-400">Today's Special Offers</button></li>
              <li><button onClick={() => setCurrentRoute('booking-tracking')} className="hover:text-brand-400">Track Order / Repair Status</button></li>
              <li><button onClick={() => setCurrentRoute('faq')} className="hover:text-brand-400">Service FAQs</button></li>
              <li><button onClick={() => setCurrentRoute('about')} className="hover:text-brand-400">About RVK Mobiles</button></li>
              <li><button onClick={() => setCurrentRoute('admin')} className="text-slate-400 hover:text-brand-300">Staff / Admin Login</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-brand-500 rounded-sm"></span> Store Location
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-1" />
                <p className="text-slate-300">Vanapatrai Kovil, Teppakulam Bazaar, Trichy, Tamil Nadu</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0 mt-1" />
                <div className="flex flex-col">
                  <a href="tel:8610903892" className="hover:text-brand-400 font-semibold text-white">+91 8610903892</a>
                  <a href="tel:8608103543" className="hover:text-brand-400 font-semibold text-white">+91 8608103543</a>
                </div>
              </div>
              <div className="pt-2">
                <div className="p-3 bg-navy-800 rounded-xl border border-navy-700 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4" /> Warranty Notice
                  </div>
                  Warranty details available at the time of service.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} RVK MOBILES. All rights reserved. Trichy, Tamil Nadu.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentRoute('faq')} className="hover:text-white">Terms & Policies</button>
            <span>•</span>
            <button onClick={() => setCurrentRoute('contact')} className="hover:text-white">Store Map</button>
            <span>•</span>
            <button onClick={() => setCurrentRoute('admin')} className="hover:text-white">Admin Dashboard</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
`);

// 3. MobileNav.jsx
save('client/src/components/layout/MobileNav.jsx', `
import React from 'react';
import { Home, ShoppingBag, Smartphone, Tag, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function MobileNav({ currentRoute, setCurrentRoute }) {
  const { totalCount, setIsCartOpen } = useCart();
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Shop', icon: ShoppingBag },
    { id: 'display-service', label: 'Repair', icon: Smartphone },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, isCart: true },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentRoute === item.id;
        if (item.isCart) {
          return (
            <button
              key={item.id}
              onClick={() => setIsCartOpen(true)}
              className="relative flex flex-col items-center justify-center p-1 text-slate-600 hover:text-brand-600"
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          );
        }
        return (
          <button
            key={item.id}
            onClick={() => setCurrentRoute(item.id)}
            className={`flex flex-col items-center justify-center p-1 ${isActive ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
`);

// 4. CartDrawer.jsx
save('client/src/components/common/CartDrawer.jsx', `
import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ setCurrentRoute }) {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal } = useCart();
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="font-display font-bold text-lg text-navy-850">Your Cart</h2>
              <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">{items.length} items</span>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-700 text-base">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 mt-1">Browse our verified mobile accessories and add items.</p>
                </div>
                <button onClick={() => { setIsCartOpen(false); setCurrentRoute('products'); }} className="text-xs font-bold bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
                  Shop Accessories Now
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 shadow-sm">
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200'} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 text-xs line-clamp-1">{item.name}</h4>
                    <p className="font-bold text-brand-600 text-sm mt-0.5">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-brand-600 text-slate-500"><Minus className="w-3 h-3" /></button>
                        <span className="px-2 text-xs font-bold text-slate-700">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-brand-600 text-slate-500"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 p-1" title="Remove item"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-sm">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-extrabold text-navy-850 text-base">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-600">
                <span>Doorstep Delivery in Trichy</span>
                <span className="font-bold">Available (COD / UPI)</span>
              </div>
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button onClick={() => { setIsCartOpen(false); setCurrentRoute('cart'); }} className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 py-2.5 rounded-xl hover:bg-slate-100">
                  View Full Cart
                </button>
                <button onClick={() => { setIsCartOpen(false); setCurrentRoute('checkout'); }} className="w-full text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-md">
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`);

// 5. NotificationPopover.jsx
save('client/src/components/common/NotificationPopover.jsx', `
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
`);

console.log('Chunk 1 completed.');