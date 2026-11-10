import React from 'react';

interface FamasoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  unencapsulated?: boolean;
}

export const FamasoLogo: React.FC<FamasoLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  unencapsulated = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Emblem */}
      <svg
        className={`${sizeMap[size]} shrink-0 transition-transform duration-300 hover:scale-105`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="truckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {!unencapsulated && (
          <rect x="4" y="4" width="92" height="92" rx="22" fill="#0F172A" />
        )}

        {/* Speed tracks / Road lines */}
        <path
          d="M 14 74 L 86 74"
          stroke={unencapsulated ? '#94A3B8' : '#334155'}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 28 80 L 72 80"
          stroke="#EA580C"
          strokeWidth="3"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />

        {/* Fast Food Road Fleet Vehicle */}
        {/* Cab and Cargo box */}
        <path
          d="M 18 58 L 18 36 C 18 33 20 31 23 31 L 62 31 C 64 31 65 32 66 33 L 76 43 C 77 44 78 46 78 48 L 78 58 C 78 60 76 61 74 61 L 22 61 C 20 61 18 60 18 58 Z"
          fill={unencapsulated ? '#0F172A' : '#FFFFFF'}
        />

        {/* Windshield */}
        <path
          d="M 63 35 L 73 45 L 63 45 Z"
          fill="#0284C7"
        />

        {/* Food box division */}
        <line
          x1="58"
          y1="31"
          x2="58"
          y2="61"
          stroke={unencapsulated ? '#FFFFFF' : '#E2E8F0'}
          strokeWidth="1.5"
        />

        {/* Inocuous Wash Droplet + Food Safety Star */}
        <circle cx="38" cy="45" r="9" fill="url(#dropGrad)" />
        <path
          d="M 38 39 C 38 39 42 44.5 42 47 C 42 49.2 40.2 51 38 51 C 35.8 51 34 49.2 34 47 C 34 44.5 38 39 38 39 Z"
          fill="#FFFFFF"
        />

        {/* Sparkle cleanliness star */}
        <path
          d="M 52 25 L 53.5 28.5 L 57 30 L 53.5 31.5 L 52 35 L 50.5 31.5 L 47 30 L 50.5 28.5 Z"
          fill="url(#glowGrad)"
        />

        {/* Fleet wheels */}
        <circle cx="30" cy="61" r="7.5" fill="#1E293B" stroke="#F8FAFC" strokeWidth="2" />
        <circle cx="30" cy="61" r="3" fill="#EA580C" />

        <circle cx="68" cy="61" r="7.5" fill="#1E293B" stroke="#F8FAFC" strokeWidth="2" />
        <circle cx="68" cy="61" r="3" fill="#EA580C" />
      </svg>

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-wider text-slate-900 text-lg uppercase font-mono">
              FAMASO
            </span>
            <span className="bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
              PRO
            </span>
          </div>
          <span className="text-[11px] font-bold text-orange-600 tracking-widest uppercase">
            Fast Food Road
          </span>
        </div>
      )}
    </div>
  );
};
