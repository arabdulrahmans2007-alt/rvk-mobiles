import React, { useState } from 'react';
import {
  Truck, ShieldCheck, CheckCircle2, ArrowRight, Clock,
  MapPin, Phone, User, Calendar, Award, Sparkles, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DoorstepServicePage({ setCurrentRoute, onBookingSuccess }) {
  const { user } = useAuth();
  const [distanceKm, setDistanceKm] = useState(5);
  const [isMember, setIsMember] = useState(user?.is_member === 1);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [problemDescription, setProblemDescription] = useState('Display Replacement / Screen Check');
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Compute live travel charge
  // RVK Member: ₹0 any distance
  // Regular Customer: <=20km => ₹0, >20km => (distance - 20) * 10
  const travelFee = isMember ? 0 : (distanceKm <= 20 ? 0 : Math.round((distanceKm - 20) * 10));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in your name, phone number, and doorstep address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/services/doorstep-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('rvk_token')}` } : {})
        },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          address,
          distance_km: distanceKm,
          is_rvk_member: isMember,
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          problem_description: problemDescription
        })
      });

      const data = await res.json();
      if (data.success) {
        setBookingResult(data);
        if (onBookingSuccess) onBookingSuccess(data.bookingCode);
      } else {
        alert(data.message || 'Failed to submit doorstep booking');
      }
    } catch (err) {
      console.error('Doorstep booking error:', err);
      alert('Network error submitting doorstep booking');
    } finally {
      setLoading(false);
    }
  };

  if (bookingResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center antialiased">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Technician Scheduled
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-850 mt-2 font-display">
              Doorstep Service Registered!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Our technician has received your doorstep booking request for Trichy.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs text-slate-500 font-medium">Tracking Code:</span>
              <span className="font-mono font-extrabold text-brand-600 text-base">
                {bookingResult.bookingCode}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Service Date & Time:</span>
              <span className="font-bold text-slate-800">{preferredDate} at {preferredTime}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Distance from Teppakulam Bazaar:</span>
              <span className="font-bold text-slate-800">{distanceKm} KM</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Travel Charge:</span>
              <span className="font-extrabold text-emerald-600 text-sm">
                {bookingResult.travelCharge === 0 ? '₹0 (FREE TRAVEL)' : `₹${bookingResult.travelCharge}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Address:</span>
              <span className="font-bold text-slate-800 line-clamp-1">{address}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 text-left">
            Warranty details available at the time of service.
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setCurrentRoute('booking-tracking')}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              Track Technician <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBookingResult(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all"
            >
              New Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 antialiased">
      {/* Banner */}
      <div className="bg-navy-900 text-white rounded-3xl p-6 sm:p-10 border border-navy-700 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-xs font-bold text-brand-300 border border-navy-600">
            <Truck className="w-3.5 h-3.5 text-brand-400" />
            Doorstep Service Hub — Trichy
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
            Certified Doorstep Mobile Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Convenient on-site mobile screen repair and accessory delivery at your home or office. ₹0 travel charge within 20 KM radius for all regular customers, and ₹0 at ANY distance for RVK Members.
          </p>
        </div>
      </div>

      {/* Rules & Distance Calculator Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-navy-850 font-display flex items-center gap-2">
          <span className="w-1.5 h-4 bg-brand-500 rounded-sm" />
          Distance & Travel Fee Estimator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Slider */}
          <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Estimated Distance from Teppakulam Bazaar:</label>
              <span className="text-base font-extrabold text-brand-600 font-display">{distanceKm} KM</span>
            </div>

            <input
              type="range"
              min="1"
              max="40"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>1 KM (Teppakulam)</span>
              <span>20 KM (Zero Fee Boundary)</span>
              <span>40 KM (Trichy Outer)</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={isMember}
                  onChange={(e) => setIsMember(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>I am an RVK Member (VIP)</span>
              </label>
            </div>
          </div>

          {/* Result Box */}
          <div className={`p-6 rounded-2xl border-2 space-y-3 ${isMember || distanceKm <= 20 ? 'border-emerald-500 bg-emerald-50/40' : 'border-amber-400 bg-amber-50/40'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Calculated Travel Charge</span>
              {isMember ? (
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  ★ MEMBER BENEFIT
                </span>
              ) : distanceKm <= 20 ? (
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  WITHIN 20 KM
                </span>
              ) : (
                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  BEYOND 20 KM
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-display text-navy-900">
                ₹{travelFee}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {travelFee === 0 ? '(Free doorstep travel)' : '(Standard distance surcharge)'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isMember
                ? 'As an RVK Member, you enjoy ₹0 travel / petrol charges for doorstep service across ANY distance in Trichy district.'
                : distanceKm <= 20
                ? 'Within our 20 KM service radius in Trichy, regular customers pay ₹0 travel fee.'
                : `Beyond 20 KM (${distanceKm - 20} extra KM), standard travel surcharge of ₹${travelFee} applies for regular customers.`}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-navy-850 font-display flex items-center gap-2">
          <span className="w-1.5 h-4 bg-brand-500 rounded-sm" />
          Schedule Doorstep Technician Visit
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Customer Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Phone Number (For technician call)</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Full Doorstep Address in Trichy</label>
            <textarea
              placeholder="House/Door No, Street Name, Landmark, Area/Colony in Trichy..."
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Preferred Date</label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Preferred Time Slot</label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option>10:00 AM – 01:00 PM (Morning Slot)</option>
              <option>02:00 PM – 05:00 PM (Afternoon Slot)</option>
              <option>05:30 PM – 08:30 PM (Evening Slot)</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Mobile Service / Problem Description</label>
            <input
              type="text"
              placeholder="e.g. Broken screen replacement for Samsung M33 / Battery check"
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Warranty details available at the time of service.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Confirm Doorstep Booking'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}