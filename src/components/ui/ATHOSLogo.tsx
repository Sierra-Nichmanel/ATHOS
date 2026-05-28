'use client';

import React from 'react';

interface ATHOSLogoProps {
  size?: number;
  variant?: 'light' | 'dark';
  className?: string;
  showText?: boolean;
}

/**
 * ATHOS official logo – the stylised "A" triangle mark.
 * `variant="dark"` = white mark on navy bg (for dark panels).
 * `variant="light"` = navy mark on transparent bg (for light panels).
 */
export function ATHOSLogo({ size = 40, variant = 'light', className = '', showText = true }: ATHOSLogoProps) {
  const markColor = variant === 'dark' ? '#ffffff' : '#0F355C';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* The geometric "A" mark */}
      <div
        className={`flex items-center justify-center rounded-xl overflow-hidden ${
          variant === 'dark' ? '' : 'bg-[#0F355C]'
        }`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: size * 0.7, height: size * 0.7 }}
        >
          {/* Main triangle A shape */}
          <path
            d="M60 8L108 100H84L60 52L44 84H68L74 100H20L60 8Z"
            fill={variant === 'dark' ? '#ffffff' : '#ffffff'}
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`text-xl font-black tracking-tight leading-none ${
              variant === 'dark' ? 'text-white' : 'text-[#0F355C]'
            }`}
          >
            ATHOS
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-[0.25em] ${
              variant === 'dark' ? 'text-white/50' : 'text-[#475569]'
            }`}
          >
            Business OS
          </span>
        </div>
      )}
    </div>
  );
}
