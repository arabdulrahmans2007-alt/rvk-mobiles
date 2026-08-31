import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is the official warranty policy on display replacement?',
      a: 'Warranty details are available at the time of service based on the selected display module (LCD, LED, or Curved) and smartphone model.'
    },
    {
      q: 'How does the Doorstep Service radius work?',
      a: 'Our doorstep technician travels within a 20 KM radius in Trichy with ₹0 travel fee for regular customers. Beyond 20 KM, a standard distance travel surcharge applies. RVK Members enjoy ₹0 travel charges for ANY distance in Trichy.'
    },
    {
      q: 'What are the verified accessory prices at RVK Mobiles?',
      a: 'Our confirmed catalog prices include: Wired Earphones at ₹89, Wireless AirPods at ₹699, Bluetooth Neckbands at ₹599, Bluetooth Speakers from ₹300 to ₹3,000, and Tempered Screen Guards at ₹89.'
    },
    {
      q: 'What are the display replacement pricing tiers?',
      a: 'Standard LCD Display Replacement is ₹999 – ₹1,399. Premium LED / OLED Display is ₹2,500 – ₹3,999. Curved Edge displays are available under special customized Secret Offers upon consultation.'
    },
    {
      q: 'Where is the RVK Mobiles store located?',
      a: 'We are located at Vanapatrai Kovil, Teppakulam Bazaar, Trichy, Tamil Nadu. Store hours are Monday through Sunday, 9:30 AM to 9:30 PM.'
    },
    {
      q: 'How do I track my order or service booking status?',
      a: 'You can enter your booking code (e.g. RVK-DSP-..., RVK-DST-..., or RVK-ORD-...) or phone number in our live Tracking page to view real-time updates.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 antialiased">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
          Frequently Asked Questions
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-navy-850">
          Service Information & Policies
        </h1>
        <p className="text-xs text-slate-500">
          Clear, verified answers to common customer questions about our screen repair and accessories.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-navy-850 hover:bg-slate-50"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
              </button>

              {isOpen && (
                <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-slate-100 rounded-2xl text-center text-xs text-slate-500">
        Have additional questions? Call Krishna Moorthy at <strong className="text-navy-900">8610903892</strong> / <strong className="text-navy-900">8608103543</strong>.
      </div>
    </div>
  );
}