import React from 'react';

export default function RVKLogo({ className = "h-9 w-auto", dark = false, compact = false }) {
  const textColor = dark ? "#FFFFFF" : "#0B132B";
  const subTextColor = dark ? "#94A3B8" : "#475569";
  const accentColor = "#0066FF";
  const cyanAccent = "#38BDF8";

  return (
    <div className={`flex items-center gap-2.5 select-none font-display ${className}`}>
      {/* SVG Icon Emblem */}
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full aspect-square flex-shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="rvkGrad" x1="2" y1="2" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0066FF" />
            <stop offset="1" stopColor="#0B132B" />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0052CC" />
          </linearGradient>
        </defs>

        {/* Outer Hexagon/Rounded Tech Shield */}
        <rect x="2" y="2" width="40" height="40" rx="10" fill="url(#rvkGrad)" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Subtle Circuit / Mobile screen outline */}
        <rect x="8" y="7" width="28" height="30" rx="5" stroke="white" strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="3 2" />

        {/* Dynamic Stylized R-V-K monogram line */}
        <path
          d="M 12 14 L 12 30 M 12 14 L 19 14 C 21.5 14 21.5 20 19 20 L 12 20 M 16.5 20 L 21 30"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* V & K tech connection */}
        <path
          d="M 23 20 L 26.5 29 L 30 20"
          stroke="#38BDF8"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 33 16 L 33 28 M 38 18 L 33 23 L 38 28"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glowing micro-dot */}
        <circle cx="22" cy="10" r="1.5" fill="#38BDF8" />
      </svg>

      {!compact && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span style={{ color: textColor }} className="text-xl font-black tracking-tight font-display">
              RVK
            </span>
            <span style={{ color: accentColor }} className="text-xl font-bold tracking-tight font-display">
              MOBILES
            </span>
          </div>
          <span style={{ color: subTextColor }} className="text-[9.5px] font-semibold tracking-wider uppercase mt-0.5">
            Display & Accessories
          </span>
        </div>
      )}
    </div>
  );
}