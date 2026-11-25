import React, { useState } from 'react';
import { MetroNavProvider, useMetroNav } from './context/MetroNavContext';
import { AtmosphericBlobs } from './components/common/AtmosphericBlobs';
import { TopNavigation } from './components/common/TopNavigation';
import { BrutalistFooter } from './components/common/BrutalistFooter';
import { ToastNotification } from './components/common/ToastNotification';
import { PassengerHome } from './components/passenger/PassengerHome';
import { PassengerResults } from './components/passenger/PassengerResults';
import { PassengerScanner } from './components/passenger/PassengerScanner';
import { PassengerInterchangeDetail } from './components/passenger/PassengerInterchangeDetail';
import { PassengerAlerts } from './components/passenger/PassengerAlerts';
import { OrgAdminDashboard } from './components/admin/OrgAdminDashboard';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { Search, X, MapPin, Train, ArrowRight } from 'lucide-react';

const MetroNavApp: React.FC = () => {
  const {
    currentView,
    stations,
    lines,
    setFromStation,
    setToStation,
    calculateRoute,
  } = useMetroNav();

  const [passengerTab, setPassengerTab] = useState<string>('home');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const handleSelectStationFromSearch = (stationName: string) => {
    setFromStation(stationName);
    setToStation('Chennai International Airport');
    calculateRoute(stationName, 'Chennai International Airport');
    setIsSearchModalOpen(false);
    setPassengerTab('results');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#3F66C2] selection:text-white overflow-x-hidden">
      {/* Background Atmospheric Blobs (Section 2.6) */}
      <AtmosphericBlobs />

      {/* Global Toast System */}
      <ToastNotification />

      {/* Top Fixed Navigation & Persona Switcher */}
      <TopNavigation
        currentTab={passengerTab}
        onNavigateTab={(tab) => {
          setPassengerTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenScanner={() => {
          setPassengerTab('scanner');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area Based on Current Persona View */}
      <main className="flex-1 relative z-10">
        {currentView === 'passenger' && (
          <>
            {passengerTab === 'home' && (
              <PassengerHome
                onNavigateTab={(tab) => {
                  setPassengerTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
            {passengerTab === 'results' && (
              <PassengerResults
                onNavigateTab={(tab) => {
                  setPassengerTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
            {passengerTab === 'scanner' && (
              <PassengerScanner
                onNavigateTab={(tab) => {
                  setPassengerTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
            {passengerTab === 'interchange' && <PassengerInterchangeDetail />}
            {passengerTab === 'alerts' && (
              <PassengerAlerts
                onNavigateTab={(tab) => {
                  setPassengerTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}

        {currentView === 'org-admin' && <OrgAdminDashboard />}

        {currentView === 'super-admin' && <SuperAdminDashboard />}
      </main>

      {/* Global Quick Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#E4E2DD] border-4 border-[#1E1E1E] max-w-xl w-full p-6 shadow-2xl space-y-4 animate-entrance">
            <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-[#3F66C2]" />
                <span className="clash text-xl font-bold uppercase text-[#1E1E1E]">
                  Global Station Directory Lookup
                </span>
              </div>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search stations, platform codes, or lines..."
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-2 clash text-xl font-bold focus:outline-none focus:border-[#3F66C2]"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1">
              {stations
                .filter(
                  (s) =>
                    s.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
                    s.code.toLowerCase().includes(globalSearchTerm.toLowerCase())
                )
                .map((st) => (
                  <div
                    key={st.id}
                    onClick={() => handleSelectStationFromSearch(st.name)}
                    className="p-3 border border-[#1E1E1E]/20 hover:bg-[#5C82E6]/20 cursor-pointer flex items-center justify-between text-xs font-mono group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#3F66C2]" />
                      <span className="font-bold text-sm text-[#1E1E1E]">{st.name}</span>
                      <span className="text-[10px] bg-black/10 px-1 py-0.5">{st.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {st.lines.slice(0, 3).map((ln) => (
                          <span
                            key={ln}
                            className="w-4 h-4 rounded-full bg-[#1E1E1E] text-white text-[9px] flex items-center justify-center font-bold"
                          >
                            {ln}
                          </span>
                        ))}
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#3F66C2] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Brutalist Footer */}
      <BrutalistFooter />
    </div>
  );
};

export default function App() {
  return (
    <MetroNavProvider>
      <MetroNavApp />
    </MetroNavProvider>
  );
}
