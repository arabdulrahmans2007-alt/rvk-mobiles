import React, { useState, useEffect } from 'react';
import {
  Smartphone, ShieldCheck, CheckCircle2, ArrowRight, Clock,
  MapPin, Phone, User, Info, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DisplayServicePage({ setCurrentRoute, onBookingSuccess }) {
  const { user } = useAuth();
  const [pricingInfo, setPricingInfo] = useState(null);
  const [selectedType, setSelectedType] = useState('lcd');
  const [deviceBrand, setDeviceBrand] = useState('Redmi / Xiaomi');
  const [deviceModel, setDeviceModel] = useState('');
  const [serviceType, setServiceType] = useState('In-Store');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    fetch('/api/services/display-pricing')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPricingInfo(data);
      })
      .catch(err => console.error('Error loading display pricing:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !deviceBrand || !deviceModel.trim()) {
      alert('Please enter your name, phone number, device brand and model.');
      return;
    }

    setLoading(true);
    try {
      const typeObj = pricingInfo?.displayTypes?.find(t => t.id === selectedType);
      const displayLabel = typeObj ? typeObj.name : 'LCD Display Replacement';

      const res = await fetch('/api/services/display-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('rvk_token')}` } : {})
        },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          device_brand: deviceBrand,
          device_model: deviceModel,
          display_type: displayLabel,
          service_type: serviceType,
          address: serviceType === 'Doorstep' ? address : 'In-Store Drop-off',
          notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setBookingResult(data);
        if (onBookingSuccess) onBookingSuccess(data.bookingCode);
      } else {
        alert(data.message || 'Failed to submit booking');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Network error submitting booking');
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
              Booking Confirmed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-850 mt-2 font-display">
              Display Replacement Booked!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your service request has been logged into the RVK Mobiles management system.
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
              <span className="text-slate-500">Device:</span>
              <span className="font-bold text-slate-800">{deviceBrand} {deviceModel}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Display Type:</span>
              <span className="font-bold text-slate-800">
                {selectedType === 'lcd' ? 'LCD (₹999 – ₹1,399)' : selectedType === 'led' ? 'LED (₹2,500 – ₹3,999)' : 'Curved Edge (Secret Offers)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Service Mode:</span>
              <span className="font-bold text-slate-800">{serviceType}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2 text-left">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Warranty details available at the time of service.</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setCurrentRoute('booking-tracking')}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              Track Status <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setBookingResult(null); setDeviceModel(''); }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all"
            >
              Book Another Device
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 antialiased">
      {/* Header */}
      <div className="bg-navy-900 text-white rounded-3xl p-6 sm:p-10 border border-navy-700 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-xs font-bold text-brand-300 border border-navy-600">
            <Smartphone className="w-3.5 h-3.5 text-brand-400" />
            Trichy Certified Screen Specialists
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
            Smartphone Display Replacement
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Get high-grade LCD, LED, and curved displays replaced with precision fitting. Drop off at Teppakulam Bazaar store or request certified doorstep technician.
          </p>
        </div>
      </div>

      {/* Pricing Cards Selection */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-850 font-display flex items-center gap-2">
          <span className="w-1.5 h-4 bg-brand-500 rounded-sm" />
          Step 1: Choose Display Grade
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* LCD */}
          <div
            onClick={() => setSelectedType('lcd')}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              selectedType === 'lcd'
                ? 'border-brand-600 bg-brand-50/50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-brand-100 text-brand-700">
                  BUDGET FRIENDLY
                </span>
                <input type="radio" checked={selectedType === 'lcd'} readOnly className="text-brand-600" />
              </div>
              <h3 className="text-lg font-bold text-navy-850 font-display mt-2">LCD Display</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Standard crystal replacement module with responsive touch response and clean color balance.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-2xl font-black text-navy-900 font-display">₹999 – ₹1,399</span>
            </div>
          </div>

          {/* LED */}
          <div
            onClick={() => setSelectedType('led')}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              selectedType === 'led'
                ? 'border-brand-600 bg-brand-50/50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  PREMIUM QUALITY
                </span>
                <input type="radio" checked={selectedType === 'led'} readOnly className="text-brand-600" />
              </div>
              <h3 className="text-lg font-bold text-navy-850 font-display mt-2">LED / OLED Display</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Vibrant deep contrast, rich color reproduction, and swift touch sensitivity.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-2xl font-black text-brand-600 font-display">₹2,500 – ₹3,999</span>
            </div>
          </div>

          {/* Curve */}
          <div
            onClick={() => setSelectedType('curve')}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              selectedType === 'curve'
                ? 'border-brand-600 bg-brand-50/50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  VIP EXCLUSIVE
                </span>
                <input type="radio" checked={selectedType === 'curve'} readOnly className="text-brand-600" />
              </div>
              <h3 className="text-lg font-bold text-navy-850 font-display mt-2">Curved Edge Display</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Curved display replacement with custom edge fitment. Private verified quote.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-xl font-black text-amber-600 font-display">Secret Offers</span>
              <p className="text-[10px] text-slate-400">Direct RVK quote</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <h2 className="text-lg font-bold text-navy-850 font-display flex items-center gap-2">
          <span className="w-1.5 h-4 bg-brand-500 rounded-sm" />
          Step 2: Enter Device & Customer Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Smartphone Brand</label>
            <select
              value={deviceBrand}
              onChange={(e) => setDeviceBrand(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option>Redmi / Xiaomi</option>
              <option>Samsung</option>
              <option>Realme</option>
              <option>Vivo</option>
              <option>Oppo</option>
              <option>OnePlus</option>
              <option>Poco</option>
              <option>iPhone / Apple</option>
              <option>Motorola</option>
              <option>Other Brand</option>
            </select>
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Device Model (e.g. Note 11 Pro, Galaxy M33)</label>
            <input
              type="text"
              placeholder="e.g. Redmi Note 11 Pro / Galaxy A53"
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              required
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Your Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Phone Number (For verification & updates)</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Service Mode */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Service Preference</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer ${serviceType === 'In-Store' ? 'border-brand-600 bg-brand-50/40' : 'border-slate-200'}`}>
                <input type="radio" name="serviceType" checked={serviceType === 'In-Store'} onChange={() => setServiceType('In-Store')} />
                <div>
                  <p className="font-bold text-xs text-slate-800">In-Store Drop-off</p>
                  <p className="text-[11px] text-slate-500">Vanapatrai Kovil, Teppakulam Bazaar, Trichy</p>
                </div>
              </label>

              <label className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer ${serviceType === 'Doorstep' ? 'border-brand-600 bg-brand-50/40' : 'border-slate-200'}`}>
                <input type="radio" name="serviceType" checked={serviceType === 'Doorstep'} onChange={() => setServiceType('Doorstep')} />
                <div>
                  <p className="font-bold text-xs text-slate-800">Doorstep Technician (20 KM)</p>
                  <p className="text-[11px] text-slate-500">₹0 travel fee within 20km radius</p>
                </div>
              </label>
            </div>
          </div>

          {/* Address if Doorstep */}
          {serviceType === 'Doorstep' && (
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Doorstep Address in Trichy</label>
              <textarea
                placeholder="Door number, street name, landmark, area in Trichy..."
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required={serviceType === 'Doorstep'}
                className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Issue Notes / Special Instructions (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Touch working but glass broken, or black spot on corner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Warranty details available at the time of service.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Registering Booking...' : 'Confirm Display Booking'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}