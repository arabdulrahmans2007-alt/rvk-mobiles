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