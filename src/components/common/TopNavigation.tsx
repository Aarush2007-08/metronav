import React, { useState } from 'react';
import { useMetroNav } from '../../context/MetroNavContext';
import {
  Compass,
  Building2,
  ShieldCheck,
  Search,
  Menu,
  X,
  Bell,
  ChevronDown,
  QrCode,
  AlertTriangle,
  MapPin,
  Train,
} from 'lucide-react';

interface TopNavigationProps {
  onOpenSearch?: () => void;
  onOpenScanner?: () => void;
  onNavigateTab?: (tab: string) => void;
  currentTab?: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onOpenSearch,
  onOpenScanner,
  onNavigateTab,
  currentTab = 'home',
}) => {
  const {
    currentView,
    setCurrentView,
    activeOrg,
    setActiveOrgId,
    organizations,
    alerts,
  } = useMetroNav();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const activeAlertsCount = alerts.filter((a) => a.active).length;

  return (
    <>
      {/* Topmost Persona Switcher Strip */}
      <div className="w-full bg-[#1E1E1E] text-[#E4E2DD] border-b border-black/30 text-xs px-4 md:px-8 py-2 flex flex-wrap justify-between items-center gap-2 z-50">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="opacity-75 hidden sm:inline">Active Telemetry:</span>
          <span className="font-bold text-white tracking-widest">{activeOrg.name}</span>
          <span className="hidden md:inline px-1.5 py-0.5 bg-[#3F66C2] text-white text-[9px] font-bold">
            GTFS-RT SYNCED
          </span>
        </div>

        {/* Persona Switcher Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 mr-1 hidden lg:inline">
            Switch Persona:
          </span>
          <button
            onClick={() => setCurrentView('passenger')}
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              currentView === 'passenger'
                ? 'bg-[#3F66C2] text-white shadow-sm'
                : 'text-[#E4E2DD]/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Passenger App</span>
          </button>

          <button
            onClick={() => setCurrentView('org-admin')}
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              currentView === 'org-admin'
                ? 'bg-[#3F66C2] text-white shadow-sm'
                : 'text-[#E4E2DD]/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Org Admin</span>
          </button>

          <button
            onClick={() => setCurrentView('super-admin')}
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              currentView === 'super-admin'
                ? 'bg-[#3F66C2] text-white shadow-sm'
                : 'text-[#E4E2DD]/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </button>

          {/* Org Selector in Admin view */}
          {currentView === 'org-admin' && (
            <div className="relative ml-2">
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase border border-white/20"
              >
                <span>{activeOrg.logoText}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {orgDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[#1E1E1E] border border-white/20 shadow-2xl py-1 z-50 w-56">
                  <div className="px-3 py-1 text-[9px] font-mono text-white/50 uppercase tracking-widest border-b border-white/10">
                    Switch Metro Operator
                  </div>
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => {
                        setActiveOrgId(org.id);
                        setOrgDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#3F66C2] hover:text-white transition-colors ${
                        activeOrg.id === org.id ? 'text-[#3F66C2] font-bold bg-white/5' : 'text-[#E4E2DD]'
                      }`}
                    >
                      <span className="truncate">
                        {org.countryFlag} {org.name}
                      </span>
                      <span className="text-[10px] font-mono opacity-60 uppercase">{org.tier}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Raw Form Brutalism Navigation Bar */}
      <nav className="sticky top-0 w-full z-40 bg-[#E4E2DD] border-b-2 border-[#1E1E1E] px-4 md:px-8 py-3.5 flex justify-between items-center transition-colors">
        {/* Left: Brand Logo */}
        <div
          onClick={() => {
            if (currentView === 'passenger') onNavigateTab?.('home');
          }}
          className="cursor-pointer group flex items-center gap-3"
        >
          <div className="w-9 h-9 bg-[#1E1E1E] text-[#E4E2DD] flex items-center justify-center font-bold text-xl clash group-hover:bg-[#3F66C2] transition-colors">
            M
          </div>
          <div className="flex flex-col">
            <span className="clash text-2xl font-bold uppercase tracking-tight leading-none text-[#1E1E1E]">
              METRONAV
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#3F66C2] leading-tight">
              {currentView === 'passenger'
                ? 'Transit Wayfinding'
                : currentView === 'org-admin'
                ? 'Authority Console'
                : 'Super Admin Engine'}
            </span>
          </div>
        </div>

        {/* Center: Contextual Nav Links */}
        <div className="hidden md:flex gap-8 items-center text-xs font-bold uppercase tracking-[0.15em] text-[#1E1E1E]">
          {currentView === 'passenger' ? (
            <>
              <button
                onClick={() => onNavigateTab?.('home')}
                className={`py-1 hover:text-[#3F66C2] transition-colors border-b-2 ${
                  currentTab === 'home' ? 'border-[#3F66C2] text-[#3F66C2]' : 'border-transparent'
                }`}
              >
                Journey Planner
              </button>
              <button
                onClick={() => onNavigateTab?.('results')}
                className={`py-1 hover:text-[#3F66C2] transition-colors border-b-2 ${
                  currentTab === 'results' ? 'border-[#3F66C2] text-[#3F66C2]' : 'border-transparent'
                }`}
              >
                Route Results
              </button>
              <button
                onClick={() => onNavigateTab?.('scanner')}
                className={`py-1 hover:text-[#3F66C2] transition-colors border-b-2 ${
                  currentTab === 'scanner' ? 'border-[#3F66C2] text-[#3F66C2]' : 'border-transparent'
                }`}
              >
                Station QR
              </button>
              <button
                onClick={() => onNavigateTab?.('interchange')}
                className={`py-1 hover:text-[#3F66C2] transition-colors border-b-2 ${
                  currentTab === 'interchange' ? 'border-[#3F66C2] text-[#3F66C2]' : 'border-transparent'
                }`}
              >
                Interchange Guides
              </button>
              <button
                onClick={() => onNavigateTab?.('alerts')}
                className={`py-1 hover:text-[#3F66C2] transition-colors border-b-2 flex items-center gap-1.5 ${
                  currentTab === 'alerts' ? 'border-[#3F66C2] text-[#3F66C2]' : 'border-transparent'
                }`}
              >
                <span>Alerts</span>
                {activeAlertsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#3F66C2] text-white text-[10px] font-mono rounded-none">
                    {activeAlertsCount}
                  </span>
                )}
              </button>
            </>
          ) : currentView === 'org-admin' ? (
            <div className="flex items-center gap-2 text-xs font-mono text-[#444444]">
              <span className="font-bold text-[#1E1E1E]">{activeOrg.name}</span>
              <span>•</span>
              <span className="px-2 py-0.5 bg-black/5 text-[#3F66C2] font-bold">
                {activeOrg.tier} Tier
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-[#444444]">
              <span className="font-bold text-[#3F66C2]">PLATFORM ROOT</span>
              <span>•</span>
              <span>Global Multi-Tenant Hub</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {currentView === 'passenger' && (
            <>
              <button
                onClick={onOpenScanner}
                title="Scan Station QR"
                className="w-10 h-10 border-2 border-[#1E1E1E] flex items-center justify-center hover:bg-[#3F66C2] hover:border-[#3F66C2] hover:text-white transition-colors"
              >
                <QrCode className="w-5 h-5" />
              </button>
              <button
                onClick={onOpenSearch}
                title="Search Stations"
                className="w-10 h-10 border-2 border-[#1E1E1E] flex items-center justify-center hover:bg-[#3F66C2] hover:border-[#3F66C2] hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 border-2 border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-[#E4E2DD] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[102px] z-50 bg-[#1E1E1E] text-[#E4E2DD] p-6 flex flex-col justify-between animate-entrance">
          <div className="space-y-4">
            <div className="text-[11px] uppercase tracking-widest text-[#3F66C2] font-bold pb-2 border-b border-white/10">
              Navigation Menu
            </div>
            {currentView === 'passenger' ? (
              <div className="flex flex-col gap-3 font-clash text-2xl uppercase">
                <button
                  onClick={() => {
                    onNavigateTab?.('home');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 hover:text-[#3F66C2]"
                >
                  Journey Planner
                </button>
                <button
                  onClick={() => {
                    onNavigateTab?.('results');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 hover:text-[#3F66C2]"
                >
                  Route Results
                </button>
                <button
                  onClick={() => {
                    onNavigateTab?.('scanner');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 hover:text-[#3F66C2]"
                >
                  Scan Station QR
                </button>
                <button
                  onClick={() => {
                    onNavigateTab?.('interchange');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 hover:text-[#3F66C2]"
                >
                  Interchange Guides
                </button>
                <button
                  onClick={() => {
                    onNavigateTab?.('alerts');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 hover:text-[#3F66C2] flex items-center justify-between"
                >
                  <span>Service Alerts</span>
                  <span className="text-xs px-2 py-0.5 bg-[#3F66C2] font-mono">
                    {activeAlertsCount}
                  </span>
                </button>
              </div>
            ) : (
              <div className="text-sm font-mono opacity-80">
                Admin navigation available via main viewport tabs.
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-2">
            <div className="text-[10px] font-mono text-white/50 uppercase">Active Persona</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCurrentView('passenger');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase ${
                  currentView === 'passenger' ? 'bg-[#3F66C2] text-white' : 'bg-white/10'
                }`}
              >
                Passenger
              </button>
              <button
                onClick={() => {
                  setCurrentView('org-admin');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase ${
                  currentView === 'org-admin' ? 'bg-[#3F66C2] text-white' : 'bg-white/10'
                }`}
              >
                Org Admin
              </button>
              <button
                onClick={() => {
                  setCurrentView('super-admin');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase ${
                  currentView === 'super-admin' ? 'bg-[#3F66C2] text-white' : 'bg-white/10'
                }`}
              >
                Super
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
