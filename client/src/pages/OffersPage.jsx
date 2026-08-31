import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Clock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function OffersPage({ setCurrentRoute }) {
  const [offers, setOffers] = useState([]);
  const [todaysOffer, setTodaysOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOffers(data.offers || []);
          const today = data.offers?.find(o => o.is_todays_offer === 1);
          if (today) setTodaysOffer(today);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching offers:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 antialiased">
      {/* Header */}
      <div className="bg-navy-900 text-white rounded-3xl p-6 sm:p-10 border border-navy-700 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-xs font-bold text-brand-300 border border-navy-600">
            <Tag className="w-3.5 h-3.5 text-brand-400" />
            Active Promotional Offers
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
            Special Deals & Today's Offers
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Explore active limited-time promotions on display replacement, verified accessories, and doorstep service in Trichy.
          </p>
        </div>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading active offers...
        </div>
      ) : offers.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Tag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No active offers currently</h3>
          <p className="text-xs text-slate-400">Check back soon for new daily deals from RVK Mobiles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-5 ${
                offer.is_todays_offer === 1
                  ? 'bg-gradient-to-b from-white to-brand-50/50 border-2 border-brand-500 shadow-xl shadow-brand-500/10'
                  : 'bg-white border-slate-200 hover:shadow-lg'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                    offer.is_todays_offer === 1
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-brand-100 text-brand-700'
                  }`}>
                    {offer.badge || 'PROMO DEAL'}
                  </span>

                  {offer.is_todays_offer === 1 && (
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      ★ Today's Highlight
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-display text-navy-850 leading-snug">
                  {offer.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Offer Rate</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-navy-900 font-display">
                        {offer.offer_price !== null && offer.offer_price !== undefined
                          ? `₹${offer.offer_price}`
                          : 'Special Promo'}
                      </span>
                      {offer.original_price && (
                        <span className="text-xs line-through text-slate-400">
                          ₹{offer.original_price}
                        </span>
                      )}
                    </div>
                  </div>

                  {offer.discount_text && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      {offer.discount_text}
                    </span>
                  )}
                </div>

                {offer.end_date && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Valid until: {offer.end_date}</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (offer.target_service?.toLowerCase().includes('display')) {
                      setCurrentRoute('display-service');
                    } else if (offer.target_service?.toLowerCase().includes('doorstep')) {
                      setCurrentRoute('doorstep-service');
                    } else {
                      setCurrentRoute('products');
                    }
                  }}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  Avail Offer Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warranty Statement Notice */}
      <div className="p-4 bg-slate-100 rounded-2xl text-center text-xs text-slate-500">
        Warranty details available at the time of service. All offers subject to stock availability in Trichy.
      </div>
    </div>
  );
}