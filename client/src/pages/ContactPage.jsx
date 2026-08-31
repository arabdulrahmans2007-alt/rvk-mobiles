import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail, ShieldCheck, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 antialiased">
      {/* Header */}
      <div className="bg-navy-900 text-white rounded-3xl p-6 sm:p-10 border border-navy-700 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-xs font-bold text-brand-300 border border-navy-600">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            Teppakulam Bazaar, Trichy
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
            Contact RVK MOBILES
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Visit our store for instant screen repair and mobile accessories, or contact Krishna Moorthy directly via phone and WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-navy-850 font-display">Store Address</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vanapatrai Kovil, Teppakulam Bazaar, Trichy, Tamil Nadu, India.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              Landmark: Near Vanapatrai Kovil entrance.
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-navy-850 font-display">Phone & WhatsApp</h3>
            <div className="space-y-1.5 text-sm font-bold text-navy-900">
              <div className="flex items-center justify-between">
                <span>Krishna Moorthy (Primary):</span>
                <a href="tel:8610903892" className="text-brand-600 hover:underline">8610903892</a>
              </div>
              <div className="flex items-center justify-between">
                <span>Secondary Helpline:</span>
                <a href="tel:8608103543" className="text-brand-600 hover:underline">8608103543</a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/918610903892"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Direct WhatsApp Chat
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-navy-850 font-display">Working Hours</h3>
            <p className="text-xs text-slate-600">
              Monday – Sunday: <strong className="text-slate-800">9:30 AM – 9:30 PM</strong>
            </p>
            <p className="text-[11px] text-emerald-600 font-bold">Open All 7 Days a Week</p>
          </div>

          <div className="p-4 bg-slate-100 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Warranty details available at the time of service.</span>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display text-navy-850">Send Inquiry / Service Request</h2>
            <p className="text-xs text-slate-500 mt-0.5">We respond promptly to customer queries across Trichy.</p>
          </div>

          {sent && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Thank you! Your message has been sent to RVK Mobiles.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name"
                className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="10-digit mobile number"
                className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Message / Inquiry Details</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Describe your screen issue, accessory requirement, or doorstep request..."
                className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase px-8 py-3.5 rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" /> Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}