import React, { useState, useEffect } from 'react';
import { useMetroNav } from '../../context/MetroNavContext';
import {
  Train,
  ArrowRight,
  Footprints,
  Clock,
  Compass,
  AlertCircle,
  Layers,
  ArrowRightLeft,
  CheckCircle,
  Zap,
  Play,
  RotateCcw,
  Volume2,
  Navigation,
} from 'lucide-react';
import { LivePassengerTrackingHUD } from './LivePassengerTrackingHUD';

interface PassengerResultsProps {
  onNavigateTab: (tab: string) => void;
}

export const PassengerResults: React.FC<PassengerResultsProps> = ({ onNavigateTab }) => {
  const {
    fromStation,
    toStation,
    routeOptions,
    selectedRoute,
    setSelectedRoute,
    isNavigatingLive,
    setIsNavigatingLive,
    activeJourneyStep,
    setActiveJourneyStep,
    showToast,
  } = useMetroNav();

  // Departure countdown timer simulation
  const [countdownSeconds, setCountdownSeconds] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 120));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartLiveNavigation = () => {
    setIsNavigatingLive(true);
    setActiveJourneyStep(0);
    showToast('Live Turn-by-Turn Navigation Started. Sensor telemetry locked.');
  };

  const handleNextStep = () => {
    if (activeJourneyStep < selectedRoute.steps.length - 1) {
      setActiveJourneyStep(activeJourneyStep + 1);
    } else {
      showToast('You have arrived at your destination!');
      setIsNavigatingLive(false);
      setActiveJourneyStep(0);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-12 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b-2 border-[#1E1E1E]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('home')}
            className="text-xs font-mono uppercase font-bold text-[#3F66C2] hover:text-[#1E1E1E] transition-colors flex items-center gap-1"
          >
            ← Modify Route
          </button>
          <span className="text-xs font-mono text-[#444444]">•</span>
          <span className="text-xs font-mono uppercase text-[#444444]">
            Trajectory Computed via Live Schedule
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#1E1E1E]">
            CMRL Live Feed: ON TIME
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid (Sidebar 25% + Main Content 75%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR (Col 1-4 / ~25-33%) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Journey Summary Card */}
          <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-lg relative overflow-hidden">
            <div className="border-b-2 border-[#1E1E1E] pb-3 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#3F66C2] font-bold block">
                Journey Matrix
              </span>
              <h2 className="clash text-2xl font-bold uppercase text-[#1E1E1E] leading-tight mt-1">
                {fromStation}
                <span className="text-[#3F66C2] block text-lg font-mono">↓</span>
                {toStation}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-b border-[#1E1E1E]/20 text-sm">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#444444] block">Duration</span>
                <span className="satoshi text-2xl font-bold text-[#1E1E1E]">
                  {selectedRoute.totalTimeMinutes} min
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#444444] block">Base Fare</span>
                <span className="satoshi text-2xl font-bold text-[#3F66C2]">
                  {selectedRoute.fare}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#444444] block">Transfers</span>
                <span className="satoshi text-base font-bold text-[#1E1E1E]">
                  {selectedRoute.transferCount === 0 ? 'Direct (0)' : `${selectedRoute.transferCount} Transfer`}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#444444] block">Walking Time</span>
                <span className="satoshi text-base font-bold text-[#1E1E1E]">
                  {selectedRoute.walkingMinutes} min
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-mono">
              <span className="text-[#444444]">Crowd Estimate:</span>
              <span
                className={`font-bold px-2 py-0.5 ${
                  selectedRoute.crowdLevel === 'Low'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {selectedRoute.crowdLevel} Density
              </span>
            </div>
          </div>

          {/* Alternative Routes Selector */}
          <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-[#1E1E1E] font-bold mb-4 flex items-center justify-between">
              <span>Alternative Paths</span>
              <span className="text-[#3F66C2]">{routeOptions.length} available</span>
            </h3>

            <div className="space-y-3">
              {routeOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setSelectedRoute(opt);
                    setActiveJourneyStep(0);
                  }}
                  className={`p-4 border-2 cursor-pointer transition-all ${
                    selectedRoute.id === opt.id
                      ? 'border-[#3F66C2] bg-[#5C82E6]/15 shadow-md'
                      : 'border-[#1E1E1E]/30 bg-transparent hover:border-[#1E1E1E] hover:bg-black/5'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3F66C2]">
                      {opt.tag}
                    </span>
                    <span className="clash text-lg font-bold text-[#1E1E1E]">
                      {opt.totalTimeMinutes}m
                    </span>
                  </div>
                  <div className="text-xs font-satoshi text-[#444444] font-medium truncate mb-2">
                    {opt.name}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#1E1E1E]/80 pt-2 border-t border-[#1E1E1E]/10">
                    <span>{opt.transferCount} Transfers</span>
                    <span className="font-bold text-[#3F66C2] uppercase flex items-center gap-1">
                      {selectedRoute.id === opt.id ? 'Active Route ✓' : 'Select →'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick QR Lookup Notice */}
          <div className="p-5 border-2 border-dashed border-[#3F66C2] bg-[#5C82E6]/10 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#3F66C2]">
              <Zap className="w-4 h-4" />
              <span>STATION TURNSTILE TIP</span>
            </div>
            <p className="text-[#444444] font-satoshi">
              Upon entering the mezzanine, scan the bronze MetroNav QR code mounted by the turnstile to confirm your real-time subway track.
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT AREA (Col 5-12 / ~75%) */}
        <main className="lg:col-span-8 space-y-8">
          {/* 1. PLATFORM INFORMATION CARD (Prominent Brutalist Focus) */}
          <div className="p-8 bg-[#1E1E1E] text-[#E4E2DD] border-4 border-[#3F66C2] shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/20 pb-6 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#3F66C2] font-bold">
                  Next Boarding Departure
                </span>
                <h3 className="clash text-3xl font-bold uppercase tracking-tight text-white mt-1">
                  {selectedRoute.platformInfo.trainNumber}
                </h3>
                <p className="text-sm font-satoshi text-white/70 mt-0.5">
                  Direction: <span className="text-white font-bold">{selectedRoute.platformInfo.direction}</span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-start sm:items-end">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold uppercase">
                  {selectedRoute.platformInfo.liveStatus}
                </span>
                <span className="text-xs font-mono text-white/50 mt-1">
                  Countdown: {formatCountdown(countdownSeconds)}
                </span>
              </div>
            </div>

            {/* Giant Platform Number (Clash Display 4xl) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-4 py-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#E4E2DD]/60 tracking-widest block mb-1">
                  Designated Track &amp; Level
                </span>
                <div className="clash text-5xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-[#3F66C2]">
                  {selectedRoute.platformInfo.platformNumber}
                </div>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-xs font-mono uppercase text-white/60 block">Est. Departure</span>
                <span className="text-3xl font-mono font-bold text-white">
                  {selectedRoute.platformInfo.countdownMin} min
                </span>
              </div>
            </div>

            {/* Live Navigation Active Bar */}
            {isNavigatingLive && (
              <div className="mt-6 pt-6 border-t border-white/20 bg-white/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#3F66C2] animate-ping"></span>
                  <span className="text-xs font-mono uppercase font-bold text-white">
                    LIVE TURN-BY-TURN ACTIVE: Step {activeJourneyStep + 1} of {selectedRoute.steps.length}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-[#3F66C2] text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#3F66C2] transition-colors"
                  >
                    {activeJourneyStep === selectedRoute.steps.length - 1 ? 'Finish Trip' : 'Next Step →'}
                  </button>
                  <button
                    onClick={() => setIsNavigatingLive(false)}
                    className="px-3 py-2 border border-white/30 text-white text-xs font-mono uppercase hover:bg-white/10"
                  >
                    Exit Nav
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. STEP-BY-STEP DIRECTIONS */}
          <div className="p-8 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl">
            <div className="flex items-center justify-between border-b-2 border-[#1E1E1E] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Footprints className="w-5 h-5 text-[#3F66C2]" />
                <h3 className="clash text-2xl font-bold uppercase tracking-tight text-[#1E1E1E]">
                  Tactical Step-By-Step Directions
                </h3>
              </div>
              <span className="text-xs font-mono text-[#444444] uppercase">
                {selectedRoute.steps.length} Route Segments
              </span>
            </div>

            <div className="space-y-6">
              {selectedRoute.steps.map((step, idx) => {
                const isActive = isNavigatingLive && activeJourneyStep === idx;
                return (
                  <div
                    key={step.stepNumber}
                    className={`p-6 border-2 transition-all ${
                      isActive
                        ? 'border-[#3F66C2] bg-[#5C82E6]/20 shadow-md ring-2 ring-[#3F66C2]'
                        : 'border-[#1E1E1E]/20 bg-transparent hover:border-[#1E1E1E]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step Number Badge */}
                      <div
                        className={`w-10 h-10 shrink-0 font-clash text-lg font-bold flex items-center justify-center border-2 border-[#1E1E1E] ${
                          isActive
                            ? 'bg-[#3F66C2] text-white'
                            : 'bg-[#1E1E1E] text-[#E4E2DD]'
                        }`}
                      >
                        {step.stepNumber}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono uppercase font-bold tracking-widest px-2 py-0.5 bg-[#1E1E1E] text-white">
                              {step.actionType}
                            </span>
                            {step.line && (
                              <span
                                className="w-6 h-6 rounded-full font-bold text-xs font-mono flex items-center justify-center shadow-sm"
                                style={{
                                  backgroundColor: step.lineColor || '#1E1E1E',
                                  color: step.lineTextColor || '#FFFFFF',
                                }}
                              >
                                {step.line}
                              </span>
                            )}
                            <span className="text-xs font-mono text-[#444444]">
                              {step.level}
                            </span>
                          </div>

                          <div className="text-xs font-mono font-bold text-[#3F66C2] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{step.durationMinutes} min</span>
                            {step.distanceMeters && <span>({step.distanceMeters}m)</span>}
                          </div>
                        </div>

                        {/* Instruction text */}
                        <p className="satoshi text-base font-bold text-[#1E1E1E] leading-relaxed">
                          {step.instruction}
                        </p>

                        {/* Additional Platform & Status details */}
                        {step.platform && (
                          <div className="pt-2 text-xs font-mono text-[#1E1E1E]/80 flex flex-wrap gap-4 border-t border-[#1E1E1E]/10">
                            <div>
                              <span className="opacity-60">Board at: </span>
                              <span className="font-bold text-[#3F66C2]">{step.platform}</span>
                            </div>
                            {step.trainDirection && (
                              <div>
                                <span className="opacity-60">Direction: </span>
                                <span className="font-bold">{step.trainDirection}</span>
                              </div>
                            )}
                            {step.liveStatus && (
                              <span className="text-emerald-700 font-bold">
                                • {step.liveStatus}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. INTERCHANGE VISUAL GUIDE (If Applicable) */}
          {selectedRoute.interchangeVisual && (
            <div className="p-8 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl">
              <div className="flex items-center justify-between border-b-2 border-[#1E1E1E] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-[#3F66C2]" />
                  <h3 className="clash text-2xl font-bold uppercase tracking-tight text-[#1E1E1E]">
                    Interchange Visual Corridor: Line {selectedRoute.interchangeVisual.fromLine} → Line {selectedRoute.interchangeVisual.toLine}
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateTab('interchange')}
                  className="text-xs font-mono uppercase text-[#3F66C2] font-bold hover:underline"
                >
                  Full Floor Blueprint →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-white/40 border border-[#1E1E1E]/20">
                  <span className="text-[10px] font-mono uppercase text-[#444444] block">Walk Corridor</span>
                  <span className="satoshi text-sm font-bold text-[#1E1E1E] block mt-1">
                    {selectedRoute.interchangeVisual.corridorName}
                  </span>
                </div>
                <div className="p-4 bg-white/40 border border-[#1E1E1E]/20">
                  <span className="text-[10px] font-mono uppercase text-[#444444] block">Average Dwell Time</span>
                  <span className="satoshi text-xl font-bold text-[#3F66C2] block mt-1">
                    {selectedRoute.interchangeVisual.dwellTimeMin} minutes
                  </span>
                </div>
                <div className="p-4 bg-white/40 border border-[#1E1E1E]/20">
                  <span className="text-[10px] font-mono uppercase text-[#444444] block">Accessibility</span>
                  <span className="satoshi text-xs font-bold text-emerald-800 block mt-1">
                    Elevator &amp; Escalator Operational
                  </span>
                </div>
              </div>

              <p className="satoshi text-sm text-[#444444] leading-relaxed border-l-4 border-[#3F66C2] pl-4 py-1">
                {selectedRoute.interchangeVisual.pathDescription}
              </p>
            </div>
          )}

          {/* 4. FLOATING CTA: "START NAVIGATION" */}
          <div className="sticky bottom-6 z-30 pt-4">
            <button
              onClick={handleStartLiveNavigation}
              className="cta-button w-full h-[64px] bg-[#1E1E1E] text-[#E4E2DD] border-2 border-[#1E1E1E] flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-sm shadow-2xl group hover:border-[#3F66C2]"
            >
              <Navigation className="w-5 h-5 text-[#3F66C2] group-hover:text-white transition-colors animate-pulse" />
              <span>{isNavigatingLive ? 'Open Live Tracking HUD' : 'Start Live Navigation Guidance'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>

      {/* Fullscreen Dynamic Live Tracking HUD */}
      {isNavigatingLive && (
        <LivePassengerTrackingHUD
          onClose={() => setIsNavigatingLive(false)}
          fromStationName={fromStation}
          toStationName={toStation}
        />
      )}
    </div>
  );
};
