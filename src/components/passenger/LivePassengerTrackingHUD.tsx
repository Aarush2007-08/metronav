import React, { useState, useEffect, useRef } from 'react';
import { useMetroNav } from '../../context/MetroNavContext';
import { NavigationWaypoint } from '../../types';
import {
  CHENNAI_CENTRAL_TO_AIRPORT_WAYPOINTS,
  OFF_ROUTE_RECALCULATION,
} from '../../data/liveTrackingData';
import {
  Compass,
  Navigation,
  Volume2,
  VolumeX,
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Footprints,
  Train,
  Layers,
  Zap,
  MapPin,
  X,
  ShieldCheck,
  Radio,
  Clock,
} from 'lucide-react';

interface LivePassengerTrackingHUDProps {
  onClose: () => void;
  fromStationName?: string;
  toStationName?: string;
}

export const LivePassengerTrackingHUD: React.FC<LivePassengerTrackingHUDProps> = ({
  onClose,
  fromStationName = 'Puratchi Thalaivar Dr. M.G.R. Central',
  toStationName = 'Chennai International Airport',
}) => {
  const { showToast } = useMetroNav();

  const [waypoints, setWaypoints] = useState<NavigationWaypoint[]>(
    CHENNAI_CENTRAL_TO_AIRPORT_WAYPOINTS
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [distanceRemaining, setDistanceRemaining] = useState(
    CHENNAI_CENTRAL_TO_AIRPORT_WAYPOINTS[0].distanceMeters
  );
  const [secondsRemaining, setSecondsRemaining] = useState(
    CHENNAI_CENTRAL_TO_AIRPORT_WAYPOINTS[0].estimatedSeconds
  );
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState<1 | 3>(1);
  const [isOffRoute, setIsOffRoute] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [compassHeading, setCompassHeading] = useState(142); // degrees

  const activeWaypoint = waypoints[currentIdx];

  // Voice Speech Synthesis
  const speakInstruction = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Trigger voice whenever active waypoint changes
  useEffect(() => {
    if (activeWaypoint) {
      speakInstruction(`${activeWaypoint.instruction}. ${activeWaypoint.subInstruction}`);
    }
  }, [currentIdx, isOffRoute, voiceEnabled]);

  // Real-time position tracking simulation loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Rotate compass slightly for realistic sensor telemetry
      setCompassHeading((prev) => (prev + (Math.random() > 0.5 ? 1 : -1) + 360) % 360);

      // Decrement remaining seconds and meters
      setSecondsRemaining((sec) => {
        if (sec <= 1) {
          // Advance to next waypoint
          if (currentIdx < waypoints.length - 1) {
            const nextIdx = currentIdx + 1;
            setCurrentIdx(nextIdx);
            setDistanceRemaining(waypoints[nextIdx].distanceMeters);
            showToast(`Waypoint ${nextIdx + 1} Reached: ${waypoints[nextIdx].stageName}`);
            return waypoints[nextIdx].estimatedSeconds;
          } else {
            setIsSimulating(false);
            showToast('Destination Reached! You have arrived at Chennai Airport.');
            return 0;
          }
        }
        return sec - 1;
      });

      setDistanceRemaining((dist) => Math.max(0, dist - (simSpeed === 3 ? 3 : 1)));
    }, 1000 / simSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, currentIdx, waypoints, simSpeed]);

  // Simulate Off-Route Deviation
  const handleTriggerOffRoute = () => {
    setIsOffRoute(true);
    setWaypoints([OFF_ROUTE_RECALCULATION, ...CHENNAI_CENTRAL_TO_AIRPORT_WAYPOINTS.slice(2)]);
    setCurrentIdx(0);
    setDistanceRemaining(OFF_ROUTE_RECALCULATION.distanceMeters);
    setSecondsRemaining(OFF_ROUTE_RECALCULATION.estimatedSeconds);
    showToast('⚠️ DIVERGENCE: You entered the wrong concourse. Recalculating path dynamically!');
  };

  // Recover from Off-Route
  const handleRecoverRoute = () => {
    setIsOffRoute(false);
    setWaypoints(CHENNAI_CENTRAL_TO_AIRPORT_WAYPOINTS);
    setCurrentIdx(2); // back on track at Escalator Bank A
    setDistanceRemaining(CHENNAI_CENTRAL_TO_AIRPORT_WAYPOINTS[2].distanceMeters);
    setSecondsRemaining(CHENNAI_CENTRAL_TO_AIRPORT_WAYPOINTS[2].estimatedSeconds);
    showToast('Route re-locked: Proceed down to Basement 2 Platform 1B.');
  };

  // Manual waypoint step navigation
  const handleManualAdvance = () => {
    if (currentIdx < waypoints.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setDistanceRemaining(waypoints[nextIdx].distanceMeters);
      setSecondsRemaining(waypoints[nextIdx].estimatedSeconds);
    }
  };

  const handleManualPrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setDistanceRemaining(waypoints[prevIdx].distanceMeters);
      setSecondsRemaining(waypoints[prevIdx].estimatedSeconds);
    }
  };

  // Speed calculation (walking vs onboard train)
  const currentSpeed =
    activeWaypoint.actionType === 'Transit'
      ? activeWaypoint.trainSpeedKmh || 64
      : simSpeed === 3
      ? 12.5
      : 4.4;

  return (
    <div className="fixed inset-0 z-50 bg-[#1E1E1E] text-[#E4E2DD] overflow-y-auto flex flex-col justify-between">
      {/* Top Telemetry Sensor Bar */}
      <div className="bg-black/90 border-b-2 border-[#3F66C2] px-4 md:px-8 py-3 flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>CMRL BEACON MESH: LOCKED</span>
          </div>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-white/80 hidden sm:inline">
            Accuracy: <strong className="text-white">±0.6m</strong> (Ultra-Wideband)
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Compass
              className="w-4 h-4 text-[#3F66C2] transition-transform duration-500"
              style={{ transform: `rotate(${compassHeading}deg)` }}
            />
            <span className="font-bold text-white">{compassHeading}° SE</span>
          </div>

          <div className="px-2 py-0.5 bg-white/10 text-white font-bold">
            {currentSpeed} km/h
          </div>

          <button
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              showToast(voiceEnabled ? 'Voice Guidance Muted.' : 'Voice Guidance Activated.');
            }}
            className={`p-1.5 border transition-colors ${
              voiceEnabled
                ? 'border-[#3F66C2] bg-[#3F66C2] text-white'
                : 'border-white/30 text-white/60 hover:text-white'
            }`}
            title="Toggle Voice Guidance"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="w-7 h-7 border border-white/30 flex items-center justify-center hover:bg-[#3F66C2] hover:border-[#3F66C2] hover:text-white transition-colors"
            title="Exit Live Tracking HUD"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Dynamic Directive Display Area */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 py-8 flex flex-col justify-center space-y-8">
        {/* Dynamic Alert Banner (If Off-Route) */}
        {isOffRoute && (
          <div className="p-5 bg-amber-500/20 border-2 border-amber-500 text-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-bounce">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 shrink-0 text-amber-400" />
              <div>
                <span className="text-xs font-mono uppercase font-bold tracking-widest block">
                  Dynamic Recalculation Alert
                </span>
                <p className="satoshi text-sm font-bold text-white">
                  Divergence detected: You entered Green Line concourse. Route recalculated.
                </p>
              </div>
            </div>
            <button
              onClick={handleRecoverRoute}
              className="px-4 py-2 bg-amber-500 text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors shrink-0"
            >
              Confirm Course Correction
            </button>
          </div>
        )}

        {/* Dynamic Instruction Card */}
        <div
          className={`p-8 md:p-12 border-4 shadow-2xl transition-all relative overflow-hidden ${
            isOffRoute
              ? 'bg-[#1E1E1E] border-amber-500 ring-4 ring-amber-500/30'
              : 'bg-[#1E1E1E] border-[#3F66C2] ring-4 ring-[#3F66C2]/30'
          }`}
        >
          {/* Background Ambient Glow */}
          <div
            className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40"
            style={{ backgroundColor: isOffRoute ? '#F59E0B' : '#3F66C2' }}
          />

          <div className="relative z-10 space-y-6">
            {/* Stage & Level Metadata */}
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#5C82E6]">
                <MapPin className="w-4 h-4 text-[#3F66C2]" />
                <span>
                  WAYPOINT {activeWaypoint.stepNumber} OF {waypoints.length} //{' '}
                  {activeWaypoint.stageName}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2 py-0.5 bg-white/10 text-white font-bold">
                  {activeWaypoint.level}
                </span>
                <span className="text-white/60">{activeWaypoint.zone}</span>
              </div>
            </div>

            {/* Giant Dynamic Directive Headline */}
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#3F66C2] font-bold block mb-1">
                Active Dynamic Directive
              </span>
              <h2 className="clash text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
                {activeWaypoint.instruction}
              </h2>
              <p className="satoshi text-base sm:text-lg text-white/80 mt-3 max-w-3xl leading-relaxed">
                {activeWaypoint.subInstruction}
              </p>
            </div>

            {/* Metrics Countdown Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
              <div className="p-3 bg-white/5 border border-white/10">
                <span className="text-white/50 block">Distance to Point</span>
                <span className="clash text-3xl font-bold text-[#5C82E6] mt-1 block">
                  {activeWaypoint.actionType === 'Transit'
                    ? `${(distanceRemaining / 1000).toFixed(1)} km`
                    : `${distanceRemaining}m`}
                </span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10">
                <span className="text-white/50 block">ETA to Waypoint</span>
                <span className="clash text-3xl font-bold text-white mt-1 block">
                  {Math.floor(secondsRemaining / 60)}:
                  {secondsRemaining % 60 < 10 ? '0' : ''}
                  {secondsRemaining % 60}
                </span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10">
                <span className="text-white/50 block">Next Metro Line</span>
                <span className="clash text-2xl font-bold text-emerald-400 mt-1 block">
                  {activeWaypoint.line ? `Blue Line (B-104)` : 'Pedestrian Path'}
                </span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10">
                <span className="text-white/50 block">Target Platform</span>
                <span className="clash text-2xl font-bold text-[#3F66C2] mt-1 block">
                  {activeWaypoint.platform || 'Concourse Gate'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Station-by-Station En-Route Tracker (When In Transit) */}
        {activeWaypoint.enRouteStations && (
          <div className="p-6 bg-[#1E1E1E] border-2 border-white/20 shadow-lg space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-[#5C82E6] uppercase flex items-center gap-1.5">
                <Train className="w-4 h-4 text-[#3F66C2]" />
                <span>Onboard Blue Line Express: Live Stations Tracker</span>
              </span>
              <span className="text-white/60">Speed: 64 km/h</span>
            </div>

            <div className="flex gap-2 overflow-x-auto py-2">
              {activeWaypoint.enRouteStations.map((st, i) => (
                <div
                  key={st}
                  className={`px-3 py-1.5 border text-xs font-mono shrink-0 flex items-center gap-2 ${
                    i === 8
                      ? 'border-[#3F66C2] bg-[#3F66C2] text-white font-bold'
                      : i < 8
                      ? 'border-white/10 bg-white/5 text-white/50 line-through'
                      : 'border-white/20 bg-white/5 text-white'
                  }`}
                >
                  <span>{st}</span>
                  {i === 8 && <span className="text-[10px] animate-pulse">● PASSING</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Waypoints Sequence Ribbon */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-white/60 uppercase">
            <span>Navigation Path Sequence</span>
            <span>
              {fromStationName} ➔ {toStationName}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {waypoints.map((wp, i) => {
              const isPast = i < currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div
                  key={wp.id}
                  onClick={() => {
                    setCurrentIdx(i);
                    setDistanceRemaining(wp.distanceMeters);
                    setSecondsRemaining(wp.estimatedSeconds);
                  }}
                  className={`p-2 border text-center cursor-pointer transition-all ${
                    isCurrent
                      ? 'border-[#3F66C2] bg-[#3F66C2] text-white shadow-lg'
                      : isPast
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                      : 'border-white/20 bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold">
                    {isPast ? '✓ DONE' : isCurrent ? '● LIVE' : `STEP ${i + 1}`}
                  </div>
                  <div className="text-[11px] font-satoshi font-bold truncate mt-0.5">
                    {wp.stageName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Live Controls Strip */}
      <div className="bg-black/95 border-t-2 border-white/20 px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Play / Pause & Speed Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="px-4 py-2 bg-[#3F66C2] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Pause Tracking' : 'Resume Tracking'}</span>
          </button>

          <button
            onClick={() => setSimSpeed(simSpeed === 1 ? 3 : 1)}
            className="px-3 py-2 border border-white/30 text-xs font-mono uppercase font-bold hover:bg-white/10"
          >
            Speed: {simSpeed}x {simSpeed === 3 && '⚡ Fast'}
          </button>

          <button
            onClick={isOffRoute ? handleRecoverRoute : handleTriggerOffRoute}
            className={`px-3 py-2 border text-xs font-mono uppercase font-bold transition-colors ${
              isOffRoute
                ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                : 'border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black'
            }`}
          >
            {isOffRoute ? 'Fix Route' : 'Simulate Wrong Turn'}
          </button>
        </div>

        {/* Step Forward / Backward */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentIdx === 0}
            onClick={handleManualPrev}
            className="px-3 py-2 border border-white/30 text-xs font-mono uppercase font-bold hover:bg-white/10 disabled:opacity-30"
          >
            ← Prev Waypoint
          </button>
          <button
            disabled={currentIdx === waypoints.length - 1}
            onClick={handleManualAdvance}
            className="px-4 py-2 bg-white text-black text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] hover:text-white transition-colors disabled:opacity-30 flex items-center gap-1.5"
          >
            <span>Next Waypoint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
