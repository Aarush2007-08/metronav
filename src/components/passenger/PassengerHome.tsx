import React, { useState, useRef, useEffect } from 'react';
import { useMetroNav } from '../../context/MetroNavContext';
import {
  Train,
  ArrowRight,
  ArrowRightLeft,
  Compass,
  MapPin,
  QrCode,
  AlertTriangle,
  Layers,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  X,
  Search,
} from 'lucide-react';

interface PassengerHomeProps {
  onNavigateTab: (tab: string) => void;
  onOpenSystemMap?: () => void;
}

const PROMINENT_HUBS = [
  'Puratchi Thalaivar Dr. M.G.R. Central',
  'Alandur Multi-Level Junction',
  'Chennai International Airport',
  'Guindy',
  'Koyambedu',
  'CMBT (Chennai Mofussil Bus Terminus)',
  'Vadapalani',
  'Egmore',
  'St. Thomas Mount',
];

export const PassengerHome: React.FC<PassengerHomeProps> = ({
  onNavigateTab,
  onOpenSystemMap,
}) => {
  const {
    fromStation,
    setFromStation,
    toStation,
    setToStation,
    calculateRoute,
    stations,
    lines,
    setSelectedInterchange,
    interchangeGuides,
  } = useMetroNav();

  const [fromQuery, setFromQuery] = useState(fromStation);
  const [toQuery, setToQuery] = useState(toStation);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromLineFilter, setFromLineFilter] = useState<'All' | 'Blue' | 'Green' | 'Interchange'>('All');
  const [toLineFilter, setToLineFilter] = useState<'All' | 'Blue' | 'Green' | 'Interchange'>('All');
  const [stationModalTarget, setStationModalTarget] = useState<'from' | 'to' | null>(null);
  const [modalSearch, setModalSearch] = useState('');
  const [modalLineFilter, setModalLineFilter] = useState<'All' | 'Blue' | 'Green' | 'Interchange'>('All');
  const [isCalculating, setIsCalculating] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  // Sync state if context changes externally
  useEffect(() => {
    setFromQuery(fromStation);
  }, [fromStation]);

  useEffect(() => {
    setToQuery(toStation);
  }, [toStation]);

  // Intelligent station filtering
  const filterStationList = (
    query: string,
    filter: 'All' | 'Blue' | 'Green' | 'Interchange'
  ) => {
    let list = stations;
    if (filter === 'Blue') list = list.filter((s) => s.lines.includes('Blue'));
    else if (filter === 'Green') list = list.filter((s) => s.lines.includes('Green'));
    else if (filter === 'Interchange') list = list.filter((s) => s.type === 'Interchange');

    const trimmed = query.trim().toLowerCase();
    const isExactMatch = list.some((s) => s.name.toLowerCase() === trimmed);
    if (isExactMatch || !trimmed) {
      return list;
    }
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(trimmed) ||
        s.code.toLowerCase().includes(trimmed)
    );
  };

  const fromSuggestions = filterStationList(fromQuery, fromLineFilter);
  const toSuggestions = filterStationList(toQuery, toLineFilter);

  // Modal suggestions
  const modalStations = filterStationList(modalSearch, modalLineFilter);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setShowToSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwapStations = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
    setFromStation(toQuery);
    setToStation(temp);
  };

  const handleGetDirections = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromQuery || !toQuery) return;
    setIsCalculating(true);
    setTimeout(() => {
      calculateRoute(fromQuery, toQuery);
      setIsCalculating(false);
      onNavigateTab('results');
    }, 600);
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. HERO SECTION (100vh) */}
      <section className="relative min-h-[92vh] flex flex-col justify-end px-6 md:px-12 pb-16 md:pb-24 overflow-hidden border-b-2 border-[#1E1E1E]">
        <div className="relative z-10 animate-entrance max-w-7xl mx-auto w-full">
          {/* Metadata Tag */}
          <div className="flex items-center gap-3 mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#1E1E1E] font-bold">
            <span className="w-3 h-3 bg-[#3F66C2] inline-block"></span>
            <span>Intelligent Multi-Tenant Transit Operating System</span>
            <span className="hidden sm:inline text-[#3F66C2]">• Platform Precision v2.6</span>
          </div>

          {/* Hero Headline: 18vw Clash Display */}
          <h1 className="clash text-[18vw] sm:text-[16vw] lg:text-[14vw] uppercase leading-[0.78] tracking-[-0.05em] text-[#1E1E1E] select-none">
            Find Your
            <br />
            <span className="pl-[8vw] sm:pl-[12vw] text-[#3F66C2]">Route</span>
          </h1>

          {/* Subheading + Quick Link */}
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-t-2 border-[#1E1E1E] pt-6">
            <p className="satoshi text-lg sm:text-xl font-medium max-w-md text-[#1E1E1E] leading-snug">
              Real-time Chennai Metro (CMRL) navigation with platform-level accuracy, live transfers, and indoor floor maps.
            </p>
            <div className="font-mono text-xs uppercase tracking-widest text-[#444444] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>CMRL Network Status: Normal Operation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FORM SECTION: ROUTE PLANNER (Post-Hero) */}
      <section className="relative z-20 py-16 px-6 md:px-12 max-w-5xl mx-auto -mt-6 sm:-mt-10 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-2xl">
        <div className="flex items-center justify-between border-b-2 border-[#1E1E1E] pb-4 mb-8">
          <div className="flex items-center gap-2">
            <Train className="w-5 h-5 text-[#3F66C2]" />
            <span className="clash text-xl font-bold uppercase tracking-wide text-[#1E1E1E]">
              Station-to-Station Departure Gate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStationModalTarget('to')}
              className="text-[11px] font-mono uppercase tracking-widest text-[#3F66C2] hover:underline font-bold hidden sm:inline"
            >
              Browse All {stations.length} Stations ↗
            </button>
            <span className="text-[11px] font-mono uppercase tracking-widest bg-[#1E1E1E] text-[#E4E2DD] px-2 py-1">
              Real-Time Engine
            </span>
          </div>
        </div>

        <form onSubmit={handleGetDirections} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
            {/* From Station Input */}
            <div className="relative group" ref={fromRef}>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-[#1E1E1E]/70">
                  Departure Station (From)
                </label>
                {fromQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setFromQuery('');
                      setShowFromSuggestions(true);
                    }}
                    className="text-[10px] font-mono uppercase text-[#3F66C2] hover:underline font-bold"
                  >
                    Clear ✕
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={fromQuery}
                  onChange={(e) => {
                    setFromQuery(e.target.value);
                    setShowFromSuggestions(true);
                  }}
                  onFocus={(e) => {
                    setShowFromSuggestions(true);
                    e.target.select();
                  }}
                  onClick={() => setShowFromSuggestions(true)}
                  placeholder="Select or type station..."
                  className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-3 pr-16 text-xl clash font-bold focus:outline-none focus:border-[#3F66C2] transition-colors placeholder:text-[#1E1E1E]/30 cursor-pointer"
                />
                <div className="absolute right-0 top-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowFromSuggestions(!showFromSuggestions)}
                    className="p-1 text-[#1E1E1E]/60 hover:text-[#3F66C2] transition-colors"
                    title="Toggle Stations List"
                  >
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        showFromSuggestions ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <MapPin className="w-5 h-5 text-[#1E1E1E]/40" />
                </div>
              </div>

              {/* Autocomplete Dropdown */}
              {showFromSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-2xl z-50 max-h-72 overflow-y-auto">
                  <div className="p-2.5 bg-[#E4E2DD] border-b border-[#1E1E1E]/20 text-[10px] font-mono uppercase sticky top-0 z-10 shadow-sm space-y-2">
                    <div className="flex justify-between items-center font-bold text-[#444444]">
                      <span>{fromSuggestions.length} Stations Available</span>
                      <button
                        type="button"
                        onClick={() => setStationModalTarget('from')}
                        className="text-[#3F66C2] hover:underline flex items-center gap-1 font-bold"
                      >
                        Browse All Modal ↗
                      </button>
                    </div>
                    {/* Line Filter Tabs */}
                    <div className="flex gap-1 flex-wrap">
                      {(['All', 'Blue', 'Green', 'Interchange'] as const).map((flt) => (
                        <button
                          key={flt}
                          type="button"
                          onClick={() => setFromLineFilter(flt)}
                          className={`px-2 py-0.5 text-[9px] uppercase font-bold border transition-colors ${
                            fromLineFilter === flt
                              ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                              : 'bg-white/60 text-[#1E1E1E] border-[#1E1E1E]/20 hover:border-[#3F66C2]'
                          }`}
                        >
                          {flt === 'All' ? 'All Lines' : flt}
                        </button>
                      ))}
                    </div>
                  </div>
                  {fromSuggestions.map((st) => (
                    <button
                      type="button"
                      key={st.id}
                      onClick={() => {
                        setFromQuery(st.name);
                        setFromStation(st.name);
                        setShowFromSuggestions(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-[#5C82E6]/20 border-b border-[#1E1E1E]/10 flex items-center justify-between text-sm group ${
                        fromQuery.toLowerCase() === st.name.toLowerCase()
                          ? 'bg-[#3F66C2]/15 font-bold'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1E1E1E]">{st.name}</span>
                        <span className="text-xs font-mono px-1.5 py-0.5 bg-black/10">
                          {st.code}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {st.lines.map((ln) => (
                          <span
                            key={ln}
                            className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-none text-white"
                            style={{
                              backgroundColor: ln === 'Blue' ? '#0066B3' : '#2E7D32',
                            }}
                          >
                            {ln}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Station Swap Button */}
            <div className="flex justify-center md:pt-6">
              <button
                type="button"
                onClick={handleSwapStations}
                title="Swap Departure and Destination"
                className="w-12 h-12 border-2 border-[#1E1E1E] flex items-center justify-center hover:bg-[#3F66C2] hover:border-[#3F66C2] hover:text-white transition-all transform hover:rotate-180"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* To Station Input */}
            <div className="relative group" ref={toRef}>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-[#1E1E1E]/70">
                  Destination Station (To)
                </label>
                {toQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setToQuery('');
                      setShowToSuggestions(true);
                    }}
                    className="text-[10px] font-mono uppercase text-[#3F66C2] hover:underline font-bold"
                  >
                    Clear ✕
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={toQuery}
                  onChange={(e) => {
                    setToQuery(e.target.value);
                    setShowToSuggestions(true);
                  }}
                  onFocus={(e) => {
                    setShowToSuggestions(true);
                    e.target.select();
                  }}
                  onClick={() => setShowToSuggestions(true)}
                  placeholder="Select or type station..."
                  className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-3 pr-16 text-xl clash font-bold focus:outline-none focus:border-[#3F66C2] transition-colors placeholder:text-[#1E1E1E]/30 cursor-pointer"
                />
                <div className="absolute right-0 top-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowToSuggestions(!showToSuggestions)}
                    className="p-1 text-[#1E1E1E]/60 hover:text-[#3F66C2] transition-colors"
                    title="Toggle Stations List"
                  >
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        showToSuggestions ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <MapPin className="w-5 h-5 text-[#1E1E1E]/40" />
                </div>
              </div>

              {/* Autocomplete Dropdown */}
              {showToSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-2xl z-50 max-h-72 overflow-y-auto">
                  <div className="p-2.5 bg-[#E4E2DD] border-b border-[#1E1E1E]/20 text-[10px] font-mono uppercase sticky top-0 z-10 shadow-sm space-y-2">
                    <div className="flex justify-between items-center font-bold text-[#444444]">
                      <span>{toSuggestions.length} Stations Available</span>
                      <button
                        type="button"
                        onClick={() => setStationModalTarget('to')}
                        className="text-[#3F66C2] hover:underline flex items-center gap-1 font-bold"
                      >
                        Browse All Modal ↗
                      </button>
                    </div>
                    {/* Line Filter Tabs */}
                    <div className="flex gap-1 flex-wrap">
                      {(['All', 'Blue', 'Green', 'Interchange'] as const).map((flt) => (
                        <button
                          key={flt}
                          type="button"
                          onClick={() => setToLineFilter(flt)}
                          className={`px-2 py-0.5 text-[9px] uppercase font-bold border transition-colors ${
                            toLineFilter === flt
                              ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                              : 'bg-white/60 text-[#1E1E1E] border-[#1E1E1E]/20 hover:border-[#3F66C2]'
                          }`}
                        >
                          {flt === 'All' ? 'All Lines' : flt}
                        </button>
                      ))}
                    </div>
                  </div>
                  {toSuggestions.map((st) => (
                    <button
                      type="button"
                      key={st.id}
                      onClick={() => {
                        setToQuery(st.name);
                        setToStation(st.name);
                        setShowToSuggestions(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-[#5C82E6]/20 border-b border-[#1E1E1E]/10 flex items-center justify-between text-sm group ${
                        toQuery.toLowerCase() === st.name.toLowerCase()
                          ? 'bg-[#3F66C2]/15 font-bold'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1E1E1E]">{st.name}</span>
                        <span className="text-xs font-mono px-1.5 py-0.5 bg-black/10">
                          {st.code}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {st.lines.map((ln) => (
                          <span
                            key={ln}
                            className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-none text-white"
                            style={{
                              backgroundColor: ln === 'Blue' ? '#0066B3' : '#2E7D32',
                            }}
                          >
                            {ln}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Pick Station Chips */}
          <div className="pt-4 border-t border-[#1E1E1E]/10 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase font-bold text-[#444444]">
                One-Click Major Hub Switcher:
              </span>
              <button
                type="button"
                onClick={() => setStationModalTarget('to')}
                className="text-[10px] font-mono uppercase font-bold text-[#3F66C2] hover:underline"
              >
                + View All {stations.length} Stations
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PROMINENT_HUBS.map((hubName) => {
                const st = stations.find((s) => s.name === hubName);
                if (!st) return null;
                const isSelected = fromQuery === st.name || toQuery === st.name;
                return (
                  <button
                    type="button"
                    key={st.id}
                    onClick={() => {
                      if (fromQuery !== st.name) {
                        setToQuery(st.name);
                        setToStation(st.name);
                      } else {
                        setFromQuery(st.name);
                        setFromStation(st.name);
                      }
                    }}
                    className={`px-2.5 py-1 border text-xs font-mono transition-colors ${
                      isSelected
                        ? 'border-[#3F66C2] bg-[#3F66C2] text-white font-bold'
                        : 'border-[#1E1E1E]/30 bg-white/40 hover:bg-[#3F66C2] hover:text-white hover:border-[#3F66C2]'
                    }`}
                  >
                    {st.name
                      .replace('Puratchi Thalaivar Dr. M.G.R. ', '')
                      .replace(' (Chennai Mofussil Bus Terminus)', '')
                      .replace(' Multi-Level Junction', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-[#1E1E1E]/20">
            <button
              type="button"
              onClick={() => onNavigateTab('scanner')}
              className="text-xs font-bold uppercase tracking-[0.15em] text-[#3F66C2] hover:text-[#1E1E1E] flex items-center gap-2 group transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Or Scan Station QR Code</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="submit"
              disabled={isCalculating}
              className="cta-button w-full sm:w-auto px-10 h-[64px] bg-[#1E1E1E] text-[#E4E2DD] flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-sm shadow-xl cursor-pointer disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Calculating Trajectory...</span>
                </>
              ) : (
                <>
                  <span>Get Directions</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* 3. CATEGORY DIVIDER: "INTERCHANGE GUIDES" (12vw, Clash Display) */}
      <section className="relative py-28 md:py-36 overflow-hidden border-y-2 border-[#1E1E1E] my-20">
        <div
          className="absolute inset-0 pointer-events-none opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle at 60% 50%, #5C82E6 0%, transparent 70%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#3F66C2] font-bold mb-3">
              Section 02 // Precision Transfers
            </div>
            <h2 className="clash text-[12vw] sm:text-[10vw] uppercase tracking-[-0.05em] leading-[0.8] text-[#1E1E1E] opacity-90">
              Interchange
              <br />
              <span className="text-[#3F66C2]">Guides</span>
            </h2>
          </div>
          <div className="max-w-md space-y-4">
            <p className="satoshi text-base text-[#444444] leading-relaxed">
              Never get trapped in convoluted pedestrian mezzanines. Our indoor vectors pinpoint
              the exact stairs, escalators, and track platforms down to the car door number.
            </p>
            <button
              onClick={() => {
                setSelectedInterchange(interchangeGuides[0]);
                onNavigateTab('interchange');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3F66C2] hover:text-[#1E1E1E] transition-colors border-b-2 border-[#3F66C2] pb-1"
            >
              <span>Explore Alandur Multi-Level Junction Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION (Brutalist Card Grid: 1 col mobile, 3 col desktop) */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-16 pb-4 border-b-2 border-[#1E1E1E]">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#3F66C2] font-bold mb-1">
              Architecture &amp; Capabilities
            </div>
            <h3 className="clash text-4xl sm:text-5xl font-bold uppercase tracking-tight text-[#1E1E1E]">
              Engineered For Zero Transit Confusion
            </h3>
          </div>
          <span className="text-xs font-mono text-[#444444] uppercase">
            Platform Standard Specification
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Card 1 */}
          <div className="p-8 bg-[#E4E2DD] border-t-4 border-[#3F66C2] border-x border-b border-[#1E1E1E]/20 hover:border-[#1E1E1E] transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-[#1E1E1E] text-[#3F66C2] flex items-center justify-center mb-6 group-hover:bg-[#3F66C2] group-hover:text-white transition-colors">
              <Train className="w-6 h-6" />
            </div>
            <h4 className="clash text-xl font-bold uppercase tracking-tight text-[#1E1E1E] mb-3">
              Platform-Level Accuracy
            </h4>
            <p className="satoshi text-sm text-[#444444] leading-relaxed mb-6">
              Unlike generic mapping apps, MetroNav tells you which exact platform (e.g. 1A, 2B, Track 7)
              and car position eliminates walking lag at your transfer point.
            </p>
            <div className="text-xs font-mono text-[#3F66C2] uppercase tracking-wider font-bold">
              Sub-Meter Station Precision
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-[#E4E2DD] border-t-4 border-[#3F66C2] border-x border-b border-[#1E1E1E]/20 hover:border-[#1E1E1E] transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-[#1E1E1E] text-[#3F66C2] flex items-center justify-center mb-6 group-hover:bg-[#3F66C2] group-hover:text-white transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="clash text-xl font-bold uppercase tracking-tight text-[#1E1E1E] mb-3">
              Multi-Level Indoor Maps
            </h4>
            <p className="satoshi text-sm text-[#444444] leading-relaxed mb-6">
              Interactive vector blueprints show Mezzanine, Ground, and Sub-surface levels with
              accessible elevators, escalators, and emergency exit corridors.
            </p>
            <div className="text-xs font-mono text-[#3F66C2] uppercase tracking-wider font-bold">
              Vector SVG Floor Mesh
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 bg-[#E4E2DD] border-t-4 border-[#3F66C2] border-x border-b border-[#1E1E1E]/20 hover:border-[#1E1E1E] transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-[#1E1E1E] text-[#3F66C2] flex items-center justify-center mb-6 group-hover:bg-[#3F66C2] group-hover:text-white transition-colors">
              <QrCode className="w-6 h-6" />
            </div>
            <h4 className="clash text-xl font-bold uppercase tracking-tight text-[#1E1E1E] mb-3">
              Station QR Wayfinding
            </h4>
            <p className="satoshi text-sm text-[#444444] leading-relaxed mb-6">
              Scan physical QR plaques located at station entrance gates to instantly lock your indoor
              position and receive step-by-step guidance to your connecting train.
            </p>
            <div className="text-xs font-mono text-[#3F66C2] uppercase tracking-wider font-bold">
              Instant Geolocation Sync
            </div>
          </div>
        </div>
      </section>

      {/* 5. ACTIVE LINES TICKER / STRIP */}
      <section className="bg-[#1E1E1E] text-[#E4E2DD] py-8 px-6 md:px-12 border-t-2 border-[#3F66C2]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="clash text-lg font-bold uppercase tracking-wider text-white">
              Covered Transit Lines:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center">
            {lines.map((line) => (
              <div
                key={line.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors border border-white/15"
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono"
                  style={{ backgroundColor: line.color, color: line.textColor }}
                >
                  {line.code}
                </span>
                <span className="text-xs font-satoshi font-bold text-white hidden sm:inline">
                  {line.name}
                </span>
                <span className="text-[10px] font-mono text-[#E4E2DD]/60">
                  {line.frequencyMin}m hdwy
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. COMPLETE STATION DIRECTORY MODAL */}
      {stationModalTarget && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#E4E2DD] border-4 border-[#1E1E1E] shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col animate-entrance">
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-[#1E1E1E] flex items-center justify-between bg-[#E4E2DD]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#3F66C2] font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>
                    Select {stationModalTarget === 'from' ? 'Departure (From)' : 'Destination (To)'} Station
                  </span>
                </div>
                <h3 className="clash text-2xl font-bold uppercase tracking-wide text-[#1E1E1E] mt-1">
                  Chennai Metro Station Directory ({stations.length} Stations)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStationModalTarget(null)}
                className="p-2 border-2 border-[#1E1E1E] hover:bg-[#3F66C2] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search & Filters */}
            <div className="p-4 bg-white/40 border-b border-[#1E1E1E]/20 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3.5 text-[#1E1E1E]/50" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Search by station name or code (e.g. Alandur, Airport, CEN-01)..."
                  className="w-full bg-[#E4E2DD] border-2 border-[#1E1E1E] pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#3F66C2]"
                />
                {modalSearch && (
                  <button
                    type="button"
                    onClick={() => setModalSearch('')}
                    className="absolute right-3 top-3 text-xs font-mono text-[#3F66C2] font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-[10px] font-mono uppercase font-bold text-[#444444]">
                  Filter by Line:
                </span>
                {(['All', 'Blue', 'Green', 'Interchange'] as const).map((flt) => (
                  <button
                    key={flt}
                    type="button"
                    onClick={() => setModalLineFilter(flt)}
                    className={`px-3 py-1 text-xs font-mono uppercase font-bold border transition-colors ${
                      modalLineFilter === flt
                        ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                        : 'bg-[#E4E2DD] text-[#1E1E1E] border-[#1E1E1E]/30 hover:border-[#3F66C2]'
                    }`}
                  >
                    {flt === 'All' ? `All (${stations.length})` : flt}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Stations Grid */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              {modalStations.map((st) => {
                const isCurrent =
                  stationModalTarget === 'from'
                    ? fromStation === st.name
                    : toStation === st.name;
                return (
                  <div
                    key={st.id}
                    onClick={() => {
                      if (stationModalTarget === 'from') {
                        setFromQuery(st.name);
                        setFromStation(st.name);
                      } else {
                        setToQuery(st.name);
                        setToStation(st.name);
                      }
                      setStationModalTarget(null);
                    }}
                    className={`p-4 border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                      isCurrent
                        ? 'border-[#3F66C2] bg-[#3F66C2]/10 shadow-md'
                        : 'border-[#1E1E1E]/30 bg-[#E4E2DD] hover:border-[#3F66C2] hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-base text-[#1E1E1E] group-hover:text-[#3F66C2] transition-colors clash">
                          {st.name}
                        </div>
                        <div className="text-xs text-[#444444] satoshi mt-0.5 line-clamp-1">
                          {st.address}
                        </div>
                      </div>
                      <span className="font-mono text-xs px-2 py-0.5 bg-black/10 font-bold">
                        {st.code}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#1E1E1E]/10 flex items-center justify-between text-xs">
                      <div className="flex gap-1.5 items-center">
                        {st.lines.map((ln) => (
                          <span
                            key={ln}
                            className="px-2 py-0.5 text-[10px] font-mono font-bold text-white"
                            style={{
                              backgroundColor: ln === 'Blue' ? '#0066B3' : '#2E7D32',
                            }}
                          >
                            {ln} Line
                          </span>
                        ))}
                        {st.type === 'Interchange' && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#1E1E1E] text-[#E4E2DD]">
                            Transfer Hub
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="text-xs font-mono uppercase font-bold text-[#3F66C2] group-hover:translate-x-1 transition-transform flex items-center gap-1"
                      >
                        {isCurrent ? 'Selected ✓' : 'Select →'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-[#1E1E1E] bg-[#E4E2DD] flex justify-between items-center text-xs font-mono">
              <span className="text-[#444444]">
                Showing {modalStations.length} of {stations.length} stations
              </span>
              <button
                type="button"
                onClick={() => setStationModalTarget(null)}
                className="px-4 py-2 border-2 border-[#1E1E1E] bg-[#1E1E1E] text-white uppercase font-bold hover:bg-[#3F66C2] transition-colors"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
