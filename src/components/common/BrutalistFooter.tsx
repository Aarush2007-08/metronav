import React from 'react';
import { useMetroNav } from '../../context/MetroNavContext';
import { Compass, Train, ShieldCheck } from 'lucide-react';

export const BrutalistFooter: React.FC = () => {
  const { setCurrentView, activeOrg } = useMetroNav();

  return (
    <footer className="relative bg-[#1E1E1E] text-[#E4E2DD] pt-24 pb-12 px-6 md:px-12 overflow-hidden border-t-4 border-[#3F66C2]">
      {/* Huge Background Year Indicator (15vw, opacity 0.04) */}
      <div className="absolute right-0 bottom-0 select-none pointer-events-none clash text-[15vw] font-bold text-white/[0.04] leading-none tracking-tighter">
        2026
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="clash text-3xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-[#3F66C2] text-white flex items-center justify-center text-lg">
                M
              </span>
              METRONAV
            </div>
            <p className="text-sm text-[#E4E2DD]/70 leading-relaxed font-satoshi max-w-xs">
              Multi-tenant intelligent transit operating system. Delivering platform-level accuracy,
              tactical interchange wayfinding, and automated QR routing to modern metropolitan networks.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-xs font-mono uppercase tracking-widest text-[#E4E2DD]/80">
                Operating System v2.6.4 (Active)
              </span>
            </div>
          </div>

          {/* Col 2: Navigation & Portals */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#3F66C2]">
              Operating Portals
            </h4>
            <ul className="space-y-2.5 text-sm font-satoshi">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('passenger');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#3F66C2] transition-colors flex items-center gap-1.5 group text-left"
                >
                  <Compass className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  <span>Passenger Wayfinding Web</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('org-admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#3F66C2] transition-colors flex items-center gap-1.5 group text-left"
                >
                  <Train className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  <span>Organization Admin Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('super-admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#3F66C2] transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  <span>Super Admin Platform Governance</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Systems */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#3F66C2]">
              Telemetry Feeds
            </h4>
            <ul className="space-y-2 text-sm font-mono text-[#E4E2DD]/70">
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span>GTFS-RT Polling:</span>
                <span className="text-emerald-400 font-bold">1.2s avg</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span>Active Authority:</span>
                <span className="text-white font-bold">{activeOrg.name}</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span>Platform Uptime:</span>
                <span className="text-emerald-400 font-bold">{activeOrg.uptime}%</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span>Indoor Vector Mesh:</span>
                <span className="text-white font-bold">38 Stations</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Brutalist Specification Metadata */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#3F66C2]">
              Design Identity
            </h4>
            <div className="space-y-2 text-xs font-mono text-[#E4E2DD]/60">
              <p>SPEC: Raw Form Swiss Brutalism</p>
              <p>TYPOGRAPHY: Clash Display &amp; Satoshi</p>
              <p>ACCENT: #3F66C2 Cobalt Blue</p>
              <p>BASE: #E4E2DD Warm Cream</p>
              <div className="pt-2 flex gap-2">
                <div className="w-5 h-5 bg-[#E4E2DD] border border-black" title="#E4E2DD Base"></div>
                <div className="w-5 h-5 bg-[#1E1E1E] border border-white/30" title="#1E1E1E Primary"></div>
                <div className="w-5 h-5 bg-[#3F66C2]" title="#3F66C2 Accent"></div>
                <div className="w-5 h-5 bg-[#5C82E6]" title="#5C82E6 Warm Orange"></div>
                <div className="w-5 h-5 bg-[#FF89A9]" title="#FF89A9 Soft Pink"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase font-mono tracking-[0.15em] text-[#E4E2DD]/40">
          <div>
            © 2026 METRONAV SAAS INC. ALL RIGHTS RESERVED. PLATFORM ACCURACY CONFIRMED.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Transit Data License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
