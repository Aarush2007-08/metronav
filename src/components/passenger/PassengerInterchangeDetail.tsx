import React, { useState } from 'react';
import { useMetroNav } from '../../context/MetroNavContext';
import {
  Layers,
  ArrowRight,
  Clock,
  Compass,
  Play,
  X,
  Footprints,
  ChevronRight,
  Info,
  Maximize2,
  Video,
  CheckCircle2,
} from 'lucide-react';

export const PassengerInterchangeDetail: React.FC = () => {
  const {
    interchangeGuides,
    selectedInterchange,
    setSelectedInterchange,
    indoorMaps,
  } = useMetroNav();

  const [activeLevel, setActiveLevel] = useState<'Mezzanine' | 'Platform' | 'Track2'>('Mezzanine');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  const guide = selectedInterchange || interchangeGuides[0];

  return (
    <div className="min-h-screen py-12 px-4 md:px-12 max-w-6xl mx-auto space-y-12">
      {/* Header with 8vw Clash Display */}
      <div className="border-b-2 border-[#1E1E1E] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#3F66C2] font-bold mb-2">
            Interchange Architecture // Sector Guide
          </div>
          <h1 className="clash text-[8vw] sm:text-[6vw] uppercase leading-[0.85] tracking-[-0.05em] text-[#1E1E1E]">
            {guide.name}
          </h1>
        </div>

        {/* Interchange Switcher */}
        <div className="flex gap-2">
          {interchangeGuides.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedInterchange(g)}
              className={`px-3 py-2 text-xs font-mono uppercase font-bold border-2 transition-colors ${
                guide.id === g.id
                  ? 'border-[#3F66C2] bg-[#3F66C2] text-white'
                  : 'border-[#1E1E1E] bg-[#E4E2DD] text-[#1E1E1E] hover:bg-black/5'
              }`}
            >
              {g.name.split(' ')[0]} Hub
            </button>
          ))}
        </div>
      </div>

      {/* Overview Card */}
      <div className="p-8 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#444444] block">Connected Lines</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {guide.connectedLines.map((ln) => (
              <span
                key={ln}
                className="w-7 h-7 rounded-full bg-[#1E1E1E] text-white text-xs font-bold font-mono flex items-center justify-center shadow-sm"
              >
                {ln}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-[#444444] block">Average Dwell Time</span>
          <div className="satoshi text-3xl font-bold text-[#3F66C2] mt-1">
            {guide.dwellTimeMinutes} mins
          </div>
          <span className="text-xs font-mono text-[#444444]">Door-to-door transfer</span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-[#444444] block">Complexity Rating</span>
          <div className="satoshi text-xl font-bold text-[#1E1E1E] mt-1 flex items-center gap-1">
            <span>{guide.complexity}</span>
            <span className="text-xs font-mono text-[#3F66C2] font-bold">
              {guide.complexity === 'High' ? '(4/5 Stars)' : '(2/5 Stars)'}
            </span>
          </div>
          <span className="text-xs font-mono text-[#444444]">Multi-tier mezzanine</span>
        </div>

        <div className="flex flex-col justify-center">
          <button
            onClick={() => setVideoModalOpen(true)}
            className="w-full py-3 bg-[#1E1E1E] text-[#E4E2DD] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#3F66C2] transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch Walk Video</span>
          </button>
        </div>
      </div>

      {/* Visual Floor Map SVG (Interactive Multi-Level Map) */}
      <div className="p-8 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#1E1E1E] pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#3F66C2]" />
            <h3 className="clash text-2xl font-bold uppercase tracking-tight text-[#1E1E1E]">
              Interactive Vector Floor Blueprint
            </h3>
          </div>

          {/* Level Switcher */}
          <div className="flex gap-2">
            {(['Mezzanine', 'Platform', 'Track2'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`px-3 py-1.5 text-xs font-mono uppercase font-bold border ${
                  activeLevel === lvl
                    ? 'bg-[#1E1E1E] text-[#E4E2DD] border-[#1E1E1E]'
                    : 'bg-white/40 border-[#1E1E1E]/30 text-[#1E1E1E] hover:bg-white'
                }`}
              >
                Level: {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Blueprint Canvas */}
        <div className="relative w-full h-[400px] bg-[#1E1E1E] border-2 border-[#1E1E1E] overflow-hidden flex items-center justify-center">
          {/* Subtle Gridlines */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <svg
            viewBox="0 0 800 400"
            className="w-full h-full max-w-4xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Station Outer Hall */}
            <rect
              x="50"
              y="40"
              width="700"
              height="320"
              fill="#262626"
              stroke="#3F66C2"
              strokeWidth="2"
              strokeDasharray="6 3"
            />

            {/* Platform Track 1 (Green Line Level 1) */}
            <rect x="80" y="70" width="640" height="40" fill="#2E7D32" opacity="0.9" rx="4" />
            <text x="95" y="95" fill="white" fontFamily="Clash Display" fontSize="14" fontWeight="bold">
              LEVEL 1: GREEN LINE (CHENNAI CENTRAL ↔ ST. THOMAS MOUNT)
            </text>

            {/* Walking Corridor / Concourse */}
            <path
              d="M 120 110 L 120 280 L 400 280 L 400 310"
              stroke="#5C82E6"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="16 8"
              fill="none"
              opacity="0.9"
            />
            <text x="140" y="200" fill="#5C82E6" fontFamily="JetBrains Mono" fontSize="12" fontWeight="bold">
              ALANDUR CENTRAL INTERCHANGE MEZZANINE (2.5 MIN DWELL)
            </text>

            {/* Platform Track 2 (Blue Line Level 2) */}
            <rect x="80" y="300" width="640" height="40" fill="#0066B3" opacity="0.95" rx="4" />
            <text x="95" y="325" fill="white" fontFamily="Clash Display" fontSize="14" fontWeight="bold">
              LEVEL 2: BLUE LINE (WIMCO NAGAR ↔ CHENNAI AIRPORT)
            </text>

            {/* Escalator Tower */}
            <g
              transform="translate(420, 160)"
              className="cursor-pointer"
              onClick={() => setSelectedHotspot('Central Escalator Bank (Level 1 → Level 2)')}
            >
              <rect x="0" y="0" width="130" height="80" fill="#3F66C2" opacity="0.9" rx="2" />
              <text x="12" y="35" fill="white" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold">
                ESCALATOR BANK
              </text>
              <text x="12" y="55" fill="white" opacity="0.8" fontFamily="Satoshi" fontSize="10">
                Level 1 to Level 2
              </text>
            </g>

            {/* Elevator Tower */}
            <g
              transform="translate(600, 160)"
              className="cursor-pointer"
              onClick={() => setSelectedHotspot('ADA Lift Tower EL-1 (All Levels)')}
            >
              <rect x="0" y="0" width="90" height="80" fill="#3B82F6" opacity="0.9" rx="2" />
              <text x="12" y="35" fill="white" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold">
                LIFT TOWER
              </text>
              <text x="12" y="55" fill="white" opacity="0.8" fontFamily="Satoshi" fontSize="10">
                EL-1 (Luggage/ADA)
              </text>
            </g>

            {/* Pulsing Active User Marker */}
            <circle cx="120" cy="110" r="10" fill="#3F66C2">
              <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="120" cy="110" r="5" fill="#FFFFFF" />
          </svg>

          {/* Map Overlay Badge */}
          <div className="absolute top-4 left-4 bg-[#1E1E1E]/90 border border-white/20 p-2 text-[10px] font-mono text-white">
            ACTIVE LEVEL: {activeLevel.toUpperCase()} • 1:250 SCALE
          </div>

          {selectedHotspot && (
            <div className="absolute bottom-4 left-4 right-4 bg-[#3F66C2] text-white p-3 flex justify-between items-center text-xs font-mono font-bold">
              <span>SELECTED HOTSPOT: {selectedHotspot}</span>
              <button onClick={() => setSelectedHotspot(null)} className="underline text-white">
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="p-8 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl space-y-6">
        <h3 className="clash text-2xl font-bold uppercase tracking-tight text-[#1E1E1E] border-b-2 border-[#1E1E1E] pb-3">
          Step-by-Step Transfer Walkthrough
        </h3>

        <div className="space-y-4">
          {guide.steps.map((st) => (
            <div
              key={st.stepNumber}
              className="p-5 border-2 border-[#1E1E1E]/20 bg-white/40 flex items-start gap-4 hover:border-[#1E1E1E] transition-colors"
            >
              <div className="w-8 h-8 rounded-none bg-[#3F66C2] text-white flex items-center justify-center font-clash font-bold shrink-0">
                {st.stepNumber}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="satoshi text-base font-bold text-[#1E1E1E]">{st.title}</h4>
                  <span className="text-xs font-mono text-[#3F66C2] font-bold">
                    {st.segmentTimeMinutes} min
                  </span>
                </div>
                <p className="satoshi text-sm text-[#444444] leading-relaxed">
                  {st.instruction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Walkthrough Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#E4E2DD] border-4 border-[#3F66C2] max-w-2xl w-full p-6 shadow-2xl relative animate-entrance">
            <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#3F66C2]" />
                <span className="clash text-xl font-bold uppercase text-[#1E1E1E]">
                  Interchange Video Walkthrough
                </span>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Canvas Mock */}
            <div className="relative aspect-video bg-[#1E1E1E] flex flex-col items-center justify-center text-[#E4E2DD] p-6 text-center border-2 border-[#1E1E1E]">
              <div className="w-16 h-16 rounded-full bg-[#3F66C2] text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <div className="mt-4 clash text-lg font-bold uppercase text-white">
                {guide.videoTitle || 'Alandur Multi-Level Junction Transfer Walkthrough (4K)'}
              </div>
              <div className="text-xs font-mono text-white/50 mt-1">
                Duration: 2:40 • 60 FPS • Point of View Wayfinding
              </div>
            </div>

            <p className="text-xs font-satoshi text-[#444444] mt-4 leading-relaxed">
              Camera traces pedestrian route from Green Line Platform 1 (Level 1) up the central illuminated escalator onto Level 2 directly facing the Airport-bound Blue Line coach doors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
