import React from 'react';
import logo from '../assets/logo.png';

const BrandLogo = ({ label = true, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center justify-center rounded-3xl bg-white p-3 shadow-lg shadow-slate-900/10">
        <img src={logo} alt="Profile Hub logo" className="h-12 w-12 object-contain" />
      </div>
      {label && (
        <div>
          <p className="text-lg font-black tracking-tight text-slate-950">Profile Hub</p>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Your professional platform</p>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
