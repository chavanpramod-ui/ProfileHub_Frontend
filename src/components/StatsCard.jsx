import React from 'react';
import { ExternalLink } from 'lucide-react';

const StatsCard = ({ title, icon: Icon, value, label, color, link }) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noreferrer"
      className="group relative block bg-gradient-to-br from-white via-slate-50 to-sky-50 border border-sky-200 p-5 rounded-[1.75rem] hover:shadow-[0_24px_60px_-24px_rgba(56,189,248,0.18)] transition-all duration-300 overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          {/* Brand-Colored Icon Block */}
          {/* Uses the 'color' prop (e.g., bg-slate-900) for high visibility on white cards */}
          <div className={`p-3 rounded-2xl ${color} text-white shadow-md transition-transform group-hover:scale-105 duration-300`}>
            <Icon size={24} />
          </div>
          
          {/* Professional Source Tag */}
          <div className="flex items-center gap-1 px-2 py-1 bg-cool-gray rounded border border-softgray">
            <span className="text-slate-muted text-[9px] font-bold uppercase tracking-wider">Source</span>
            <ExternalLink size={10} className="text-slate-muted group-hover:text-sky-600" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-slate-muted text-[10px] font-bold uppercase tracking-widest mb-1">
            {title}
          </h3>
          
          <div className="flex items-baseline gap-2">
            {/* High-Contrast Typography */}
            <p className="text-xl font-bold text-charcoal group-hover:text-sky-700 transition-colors duration-300">
              {value || "View Profile"}
            </p>
          </div>
          
          <p className="text-slate-muted text-xs mt-0.5 font-medium italic">
            {label}
          </p>
        </div>
      </div>

      {/* Subtle Sidebar Accent (LinkedIn Blue) */}
      <div className="absolute left-0 top-0 h-full w-1 bg-sky-600 opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </a>
  );
};

export default StatsCard;
