import React from 'react';
import RVKLogo from '../assets/logo';
import { ShieldCheck, Award, Smartphone, MapPin, Users, Heart } from 'lucide-react';

export default function AboutPage({ setCurrentRoute }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 antialiased">
      {/* Header */}
      <div className="bg-navy-900 text-white rounded-3xl p-8 sm:p-12 border border-navy-700 text-center space-y-4">
        <RVKLogo dark={true} className="h-12 w-auto mx-auto" />
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
          About RVK MOBILES
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Founded and managed by Krishna Moorthy in Teppakulam Bazaar, Trichy — providing professional smartphone display replacement and verified mobile accessories.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base font-display text-navy-850">Screen Repair Care</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Specialized display replacement across LCD, LED/OLED, and curved modules with clean edge fitment.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base font-display text-navy-850">Verified Pricing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Honest, verified retail pricing on essential accessories (Earphones ₹89, AirPods ₹699, Neckbands ₹599).
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base font-display text-navy-850">Customer Trust</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Doorstep technician visits within 20 KM and dedicated customer care in Trichy.
          </p>
        </div>
      </div>

      {/* Store Location Detail */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-bold text-base text-navy-850">Visit Our Trichy Store</h3>
          <p className="text-xs text-slate-600 mt-1">
            Vanapatrai Kovil, Teppakulam Bazaar, Trichy, Tamil Nadu.
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Proprietor: Krishna Moorthy (8610903892 / 8608103543)</p>
        </div>

        <button
          onClick={() => setCurrentRoute('contact')}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl shadow-md transition-all flex-shrink-0"
        >
          Contact Store
        </button>
      </div>
    </div>
  );
}