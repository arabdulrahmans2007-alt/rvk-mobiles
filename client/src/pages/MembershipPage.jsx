import React from 'react';
import { Award, ShieldCheck, Truck, Sparkles, Phone, CheckCircle2, ArrowRight } from 'lucide-react';

export default function MembershipPage({ setCurrentRoute }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 antialiased">
      {/* Hero */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-navy-700 shadow-2xl relative overflow-hidden text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <Award className="w-4 h-4 text-amber-400" />
          RVK ELITE CLUB MEMBERSHIP
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
          RVK VIP Membership
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Experience priority doorstep mobile care and exclusive customer perks across Trichy.
        </p>
      </div>

      {/* Verified Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-navy-850">
            ₹0 Extra Travel / Petrol Charge
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            RVK Members pay <strong className="text-navy-900 font-extrabold">₹0 extra travel fee for doorstep service at ANY distance</strong> across Trichy district, bypassing distance surcharges.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Doorstep service beyond 20 KM with zero petrol surcharge</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Doorstep mobile checkup & screen fitment</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-navy-850">
            Exclusive Member Benefits & Deals
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Gain early access to special accessory combos, reserved technician dispatch windows, and personalized notifications.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Priority scheduling for rush screen replacements</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>VIP member notification alerts on new arrivals</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Membership Pricing Status */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 text-center space-y-6">
        <div className="max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Membership Plans
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Membership Plans — Coming Soon
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Contact RVK Mobiles directly for early enrollment details, business membership, or instant verification in Trichy.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentRoute('contact')}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs uppercase px-8 py-3.5 rounded-xl shadow-lg transition-all"
          >
            Contact RVK Mobiles for Details
          </button>
          <a
            href="tel:8610903892"
            className="w-full sm:w-auto bg-navy-800 hover:bg-navy-750 text-white font-bold text-xs px-6 py-3.5 rounded-xl border border-navy-700 flex items-center justify-center gap-2 transition-all"
          >
            <Phone className="w-4 h-4 text-brand-400" />
            Call 8610903892
          </a>
        </div>

        <p className="text-[11px] text-slate-500">
          * Warranty details available at the time of service.
        </p>
      </div>
    </div>
  );
}