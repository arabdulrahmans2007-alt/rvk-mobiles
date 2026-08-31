import React, { useState, useEffect } from 'react';
import { Search, Smartphone, Truck, Package, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function BookingTrackingPage() {
  const [queryCode, setQueryCode] = useState('');
  const [queryPhone, setQueryPhone] = useState('');
  const [orderResults, setOrderResults] = useState([]);
  const [serviceResults, setServiceResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Check URL query parameters e.g. ?code=RVK-DSP-...
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam) {
      setQueryCode(codeParam);
      handleSearch(null, codeParam);
    }
  }, []);

  const handleSearch = async (e, directCode) => {
    if (e) e.preventDefault();
    const codeToSearch = directCode || queryCode;

    if (!codeToSearch.trim() && !queryPhone.trim()) {
      alert('Please enter a booking/order tracking code or phone number.');
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrderResults([]);
    setServiceResults([]);

    try {
      // 1. Search services (Display & Doorstep)
      let serviceUrl = `/api/services/track?`;
      if (codeToSearch) serviceUrl += `code=${encodeURIComponent(codeToSearch.trim())}`;
      if (queryPhone) serviceUrl += `&phone=${encodeURIComponent(queryPhone.trim())}`;

      const sRes = await fetch(serviceUrl);
      const sData = await sRes.json();
      if (sData.success) {
        setServiceResults(sData.bookings || []);
      }

      // 2. Search orders
      let orderUrl = `/api/orders/track?`;
      if (codeToSearch) orderUrl += `order_number=${encodeURIComponent(codeToSearch.trim())}`;
      if (queryPhone) orderUrl += `&phone=${encodeURIComponent(queryPhone.trim())}`;

      const oRes = await fetch(orderUrl);
      const oData = await oRes.json();
      if (oData.success) {
        setOrderResults(oData.orders || []);
      }
    } catch (err) {
      console.error('Tracking search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = (status) => {
    const steps = ['Pending', 'Confirmed', 'Processing', 'Ready', 'Completed'];
    const lower = status?.toLowerCase() || '';
    if (lower.includes('cancel')) return -1;
    if (lower.includes('complete') || lower.includes('delivered')) return 4;
    if (lower.includes('ready') || lower.includes('in route')) return 3;
    if (lower.includes('progress') || lower.includes('assigned') || lower.includes('process')) return 2;
    if (lower.includes('confirm')) return 1;
    return 0;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 antialiased">
      {/* Header */}
      <div className="bg-navy-900 text-white rounded-3xl p-6 sm:p-10 border border-navy-700 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-xs font-bold text-brand-300 border border-navy-600">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            Live Status Center
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
            Track Orders & Service Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Enter your booking code (e.g. RVK-DSP-..., RVK-DST-..., RVK-ORD-...) or mobile phone number to check live status.
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <form onSubmit={(e) => handleSearch(e)} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tracking / Booking Code</label>
            <input
              type="text"
              placeholder="e.g. RVK-DSP-2026 or RVK-ORD-1001"
              value={queryCode}
              onChange={(e) => setQueryCode(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Or Phone Number</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={queryPhone}
              onChange={(e) => setQueryPhone(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase px-8 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Searching Records...' : 'Check Status'} <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Results Section */}
      {searched && !loading && (
        <div className="space-y-6">
          {serviceResults.length === 0 && orderResults.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No matching bookings found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Please verify the code or phone number entered, or call our Trichy store at 8610903892 for direct assistance.
              </p>
            </div>
          ) : (
            <>
              {/* Service Bookings Results */}
              {serviceResults.map((s) => {
                const currentStep = getStepProgress(s.status);
                const isCancelled = currentStep === -1;

                return (
                  <div key={s.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                          {s.service_category || 'Service Request'}
                        </span>
                        <h3 className="text-lg font-bold font-display text-navy-900 mt-1">
                          Code: {s.booking_code}
                        </h3>
                      </div>
                      <div className="text-xs text-slate-500">
                        Status: <strong className="text-navy-850 font-bold text-sm ml-1">{s.status}</strong>
                      </div>
                    </div>

                    {/* Progress Stepper */}
                    {!isCancelled ? (
                      <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                        {['Pending', 'Confirmed', 'In Progress', 'Completed'].map((step, idx) => (
                          <div key={step} className="space-y-2">
                            <div className={`h-2 rounded-full transition-all ${idx <= currentStep ? 'bg-brand-600' : 'bg-slate-200'}`} />
                            <span className={`text-[11px] block ${idx <= currentStep ? 'font-bold text-slate-800' : 'text-slate-400'}`}>
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold">
                        Service Booking Cancelled
                      </div>
                    )}

                    {/* Details Box */}
                    <div className="p-4 bg-slate-50 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block">Customer:</span>
                        <span className="font-bold text-slate-800">{s.customer_name} ({s.customer_phone})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Device / Problem:</span>
                        <span className="font-bold text-slate-800">
                          {s.device_brand ? `${s.device_brand} ${s.device_model}` : s.problem_description}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Location / Address:</span>
                        <span className="font-bold text-slate-800 line-clamp-1">{s.address || 'In-Store Drop-off'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Order Results */}
              {orderResults.map((ord) => {
                const currentStep = getStepProgress(ord.order_status);
                const isCancelled = currentStep === -1;

                return (
                  <div key={ord.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Product Order
                        </span>
                        <h3 className="text-lg font-bold font-display text-navy-900 mt-1">
                          Order Number: {ord.order_number}
                        </h3>
                      </div>
                      <div className="text-xs text-slate-500">
                        Status: <strong className="text-navy-850 font-bold text-sm ml-1">{ord.order_status}</strong>
                      </div>
                    </div>

                    {!isCancelled ? (
                      <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                        {['Pending', 'Confirmed', 'Processing', 'Delivered'].map((step, idx) => (
                          <div key={step} className="space-y-2">
                            <div className={`h-2 rounded-full transition-all ${idx <= currentStep ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                            <span className={`text-[11px] block ${idx <= currentStep ? 'font-bold text-slate-800' : 'text-slate-400'}`}>
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold">
                        Order Cancelled
                      </div>
                    )}

                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block">Total Payable:</span>
                        <span className="font-extrabold text-navy-900 text-sm">₹{ord.total_amount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Payment:</span>
                        <span className="font-bold text-slate-800">{ord.payment_method}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Delivery:</span>
                        <span className="font-bold text-slate-800 line-clamp-1">{ord.delivery_address}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}