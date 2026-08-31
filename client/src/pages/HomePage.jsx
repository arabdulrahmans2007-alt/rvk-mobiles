import React, { useState, useEffect } from 'react';
import {
  Smartphone, Headphones, ShieldCheck, Truck, ArrowRight,
  Sparkles, CheckCircle2, Phone, Star, Tag, ShoppingBag,
  Zap, Award, MapPin, Clock, ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import FallingRays from '../components/ui/falling-rays';

export default function HomePage({ setCurrentRoute }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [todaysOffer, setTodaysOffer] = useState(null);
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Today's Offer dynamically
    fetch('/api/offers/today')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.offer) {
          setTodaysOffer(data.offer);
          setCurrentDateStr(data.currentDate || new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
        }
      })
      .catch(err => console.error('Error loading today offer:', err));

    // Fetch verified featured products
    fetch('/api/products?featured=true')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeaturedProducts(data.products || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-16 pb-16 antialiased">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-850 to-navy-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-navy-700">
        {/* React Bits Pro Falling Rays Background */}
        <FallingRays rayCount={32} color1="#0066FF" color2="#38BDF8" rayWidth={2.4} pulseSpeed={1.1} />

        {/* Subtle Tech Glow Elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-750 border border-navy-600 text-xs font-semibold text-brand-300">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Trusted Mobile Care & Verified Accessories in Trichy
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
              Professional Mobile <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-blue-200 to-white">
                Display Replacement
              </span>
              <br />& Accessories
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Genuine crystal display repairs, verified smartphone accessories from ₹89, certified doorstep service within 20 KM, and VIP member privileges.
            </p>

            {/* Core Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-navy-800/80 border border-navy-700 p-3 rounded-xl">
                <Smartphone className="w-5 h-5 text-brand-400 mb-1" />
                <h4 className="font-bold text-xs text-white">Display Repair</h4>
                <p className="text-[11px] text-slate-400">LCD & LED Modules</p>
              </div>
              <div className="bg-navy-800/80 border border-navy-700 p-3 rounded-xl">
                <Headphones className="w-5 h-5 text-brand-400 mb-1" />
                <h4 className="font-bold text-xs text-white">Accessories</h4>
                <p className="text-[11px] text-slate-400">Earphones, AirPods</p>
              </div>
              <div className="bg-navy-800/80 border border-navy-700 p-3 rounded-xl">
                <Truck className="w-5 h-5 text-brand-400 mb-1" />
                <h4 className="font-bold text-xs text-white">Doorstep (20 KM)</h4>
                <p className="text-[11px] text-slate-400">₹0 Travel Fee</p>
              </div>
              <div className="bg-navy-800/80 border border-navy-700 p-3 rounded-xl">
                <Award className="w-5 h-5 text-amber-400 mb-1" />
                <h4 className="font-bold text-xs text-white">RVK Member</h4>
                <p className="text-[11px] text-slate-400">Any Distance ₹0</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => setCurrentRoute('display-service')}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
              >
                <Smartphone className="w-4 h-4" />
                Book Display Replacement
              </button>
              <button
                onClick={() => setCurrentRoute('products')}
                className="bg-white hover:bg-slate-100 text-navy-900 font-bold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-md"
              >
                <ShoppingBag className="w-4 h-4 text-brand-600" />
                Shop Accessories
              </button>
              <button
                onClick={() => setCurrentRoute('doorstep-service')}
                className="bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-600 font-bold text-sm px-5 py-3.5 rounded-xl flex items-center gap-2 transition-all"
              >
                <Truck className="w-4 h-4 text-brand-400" />
                Book Doorstep Service
              </button>
            </div>
          </div>

          {/* Dynamic Hero Today's Offer Card */}
          <div className="lg:col-span-5">
            {todaysOffer ? (
              <div className="bg-white text-navy-850 rounded-3xl p-6 shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-red-500 to-amber-500 text-white text-[11px] font-extrabold px-4 py-1 rounded-bl-xl shadow-sm uppercase tracking-wider">
                  🔥 TODAY'S SPECIAL OFFER
                </div>

                <div className="pt-3 space-y-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span>Active Today: {currentDateStr}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                      {todaysOffer.badge || "LIMITED-TIME OFFER"}
                    </span>
                    <h3 className="text-xl font-bold font-display text-navy-900 mt-2 leading-snug">
                      {todaysOffer.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {todaysOffer.description}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-bold">Special Offer Price</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-black text-brand-600 font-display">
                          ₹{todaysOffer.offer_price || '999'}
                        </span>
                        {todaysOffer.original_price && (
                          <span className="text-sm line-through text-slate-400">
                            ₹{todaysOffer.original_price}
                          </span>
                        )}
                      </div>
                    </div>
                    {todaysOffer.discount_text && (
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">
                        {todaysOffer.discount_text}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => setCurrentRoute('offers')}
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      Claim Today's Offer <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[11px] text-center text-slate-400">
                      * Warranty details available at the time of service.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center space-y-4">
                <Sparkles className="w-12 h-12 text-brand-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Daily Special Offers</h3>
                <p className="text-sm text-slate-300">
                  RVK Mobiles offers special display replacement packages and daily accessory discounts in Trichy.
                </p>
                <button
                  onClick={() => setCurrentRoute('offers')}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase"
                >
                  View All Offers
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. CONFIRMED VERIFIED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-600 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Tag className="w-4 h-4" />
              Verified Pricing Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-850 font-display">
              Popular Mobile Accessories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Confirmed pricing on everyday essentials with doorstep delivery in Trichy.
            </p>
          </div>

          <button
            onClick={() => setCurrentRoute('products')}
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start md:self-auto"
          >
            Explore Complete Catalog ({featuredProducts.length}+ items) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 5).map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col group"
            >
              <div className="relative aspect-square bg-slate-50 p-4 overflow-hidden">
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                />
                {prod.original_price && (
                  <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Save ₹{prod.original_price - prod.price}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {prod.category_name}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1 mt-0.5">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-extrabold text-navy-850 font-display">
                      ₹{prod.price}
                    </span>
                    {prod.original_price && (
                      <span className="text-xs line-through text-slate-400">
                        ₹{prod.original_price}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => { addToCart(prod); setIsCartOpen(true); }}
                    className="w-full bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DISPLAY REPLACEMENT TIERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl text-white p-6 sm:p-10 border border-slate-800 relative overflow-hidden">
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
              Expert Screen Repair
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
              Smartphone Display Replacement Tiers
            </h2>
            <p className="text-sm text-slate-300">
              Select the right display module for your phone. In-store replacement or doorstep technician visit across Trichy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1: LCD */}
            <div className="bg-navy-800/90 border border-navy-700 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-brand-300 bg-brand-900/60 px-2.5 py-1 rounded-full border border-brand-700">
                  BUDGET VALUE
                </span>
                <h3 className="text-xl font-bold font-display text-white">LCD Display</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Responsive touch and crisp color balance suitable for standard budget smartphones.
                </p>
                <div className="pt-2">
                  <span className="text-2xl font-black text-white font-display">₹999 – ₹1,399</span>
                </div>
              </div>
              <button
                onClick={() => setCurrentRoute('display-service')}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                Book LCD Repair
              </button>
            </div>

            {/* Tier 2: LED */}
            <div className="bg-navy-800/90 border-2 border-brand-500 rounded-2xl p-6 space-y-4 flex flex-col justify-between relative shadow-lg shadow-brand-500/10">
              <span className="absolute -top-3 right-4 bg-brand-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
                MOST POPULAR
              </span>
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-700">
                  PREMIUM VIBRANCE
                </span>
                <h3 className="text-xl font-bold font-display text-white">LED / OLED Display</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Vibrant deep blacks, rich contrast, fluid touch response for mid & high-tier devices.
                </p>
                <div className="pt-2">
                  <span className="text-2xl font-black text-brand-300 font-display">₹2,500 – ₹3,999</span>
                </div>
              </div>
              <button
                onClick={() => setCurrentRoute('display-service')}
                className="w-full bg-white hover:bg-slate-100 text-navy-900 font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                Book LED Repair
              </button>
            </div>

            {/* Tier 3: Curve */}
            <div className="bg-navy-800/90 border border-navy-700 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-700">
                  VIP EXCLUSIVE
                </span>
                <h3 className="text-xl font-bold font-display text-white">Curved Edge Display</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Custom edge curved panel fitment with seamless border alignment. Special custom pricing.
                </p>
                <div className="pt-2">
                  <span className="text-2xl font-black text-amber-400 font-display">Secret Offers</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Call for private verified quote</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentRoute('display-service')}
                className="w-full bg-navy-700 hover:bg-navy-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all border border-navy-600"
              >
                Inquire Secret Offer
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-navy-700 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Official Policy: Warranty details available at the time of service.
            </span>
            <div className="flex items-center gap-4">
              <span>Redmi • Samsung • Vivo • Oppo • Realme • OnePlus • iPhone</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DOORSTEP SERVICE HIGHLIGHT (20 KM RADIUS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-50 to-blue-50/50 rounded-3xl p-6 sm:p-10 border border-brand-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-brand-700 text-xs font-extrabold uppercase bg-brand-100 px-3 py-1 rounded-full">
              <Truck className="w-4 h-4" /> Doorstep Technician Service
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 font-display">
              Certified Mobile Repair at Your Doorstep
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              Get your smartphone screen replaced or checked without stepping out. Our trained technician visits your location across Trichy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">Regular Customer</h4>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    ₹0 Travel Fee
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  ₹0 travel charge within 20 KM radius in Trichy. Additional travel charge applies beyond 20 KM.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border-2 border-brand-500 shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-navy-900 text-sm">RVK Member</h4>
                  <span className="text-xs font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    VIP ₹0 Any Distance
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  ₹0 extra travel / petrol charge for doorstep service across ANY distance in Trichy district.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-navy-850 text-base">
              Book Doorstep Technician
            </h3>
            <p className="text-xs text-slate-500">
              Enter your address & phone number for fast technician scheduling.
            </p>
            <button
              onClick={() => setCurrentRoute('doorstep-service')}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Schedule Doorstep Visit
            </button>
            <div className="text-center text-[11px] text-slate-400">
              Trichy Hub: Teppakulam Bazaar, Trichy
            </div>
          </div>
        </div>
      </section>

      {/* 5. RVK MEMBERSHIP HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 text-white rounded-3xl p-6 sm:p-10 border border-navy-700 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Exclusive RVK Elite Club
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              RVK Membership Privileges
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unlock ₹0 travel charges for doorstep service at any distance, exclusive member deals, priority repair slots, and personalized service updates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setCurrentRoute('membership')}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs uppercase px-6 py-3.5 rounded-xl shadow-lg transition-all"
            >
              View Membership Benefits
            </button>
            <button
              onClick={() => setCurrentRoute('contact')}
              className="w-full sm:w-auto bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-600 font-bold text-xs px-5 py-3.5 rounded-xl transition-all"
            >
              Contact for Plans
            </button>
          </div>
        </div>
      </section>

      {/* 6. STORE CONTACT & TRUST FOOTPRINT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">Store Location</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vanapatrai Kovil, Teppakulam Bazaar, Trichy, Tamil Nadu.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">Direct Helpline</h4>
            <p className="text-xs text-slate-600">
              Call Krishna Moorthy at <span className="font-bold text-navy-900">8610903892</span> or <span className="font-bold text-navy-900">8608103543</span>.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">Store Hours</h4>
            <p className="text-xs text-slate-600">
              Monday to Sunday: 9:30 AM to 9:30 PM (All 7 Days Open).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}