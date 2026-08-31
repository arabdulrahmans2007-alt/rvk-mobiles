import React, { useState } from 'react';
import DisplayServicePage from './DisplayServicePage';
import DoorstepServicePage from './DoorstepServicePage';
import { Smartphone, Truck } from 'lucide-react';

export default function BookingPage({ setCurrentRoute }) {
  const [activeTab, setActiveTab] = useState('display');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 antialiased">
      {/* Tab Switcher */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-2 max-w-md w-full">
          <button
            onClick={() => setActiveTab('display')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'display'
                ? 'bg-white text-navy-900 shadow-md'
                : 'text-slate-600 hover:text-navy-850'
            }`}
          >
            <Smartphone className="w-4 h-4 text-brand-600" />
            Display Replacement
          </button>

          <button
            onClick={() => setActiveTab('doorstep')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'doorstep'
                ? 'bg-white text-navy-900 shadow-md'
                : 'text-slate-600 hover:text-navy-850'
            }`}
          >
            <Truck className="w-4 h-4 text-brand-600" />
            Doorstep Service (20 KM)
          </button>
        </div>
      </div>

      {activeTab === 'display' ? (
        <DisplayServicePage setCurrentRoute={setCurrentRoute} />
      ) : (
        <DoorstepServicePage setCurrentRoute={setCurrentRoute} />
      )}
    </div>
  );
}