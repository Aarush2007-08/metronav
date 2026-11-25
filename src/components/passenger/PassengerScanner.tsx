import React, { useState } from 'react';
import { useMetroNav } from '../../context/MetroNavContext';
import {
  QrCode,
  Scan,
  MapPin,
  ArrowRight,
  Sparkles,
  Camera,
  CheckCircle2,
  Navigation,
  Layers,
} from 'lucide-react';

interface PassengerScannerProps {
  onNavigateTab: (tab: string) => void;
}

export const PassengerScanner: React.FC<PassengerScannerProps> = ({ onNavigateTab }) => {
  const {
    stations,
    setFromStation,
    setToStation,
    calculateRoute,
    qrCodes,
    showToast,
  } = useMetroNav();

  const [scannedStation, setScannedStation] = useState<string | null>(null);
  const [scannedPayload, setScannedPayload] = useState<any | null>(null);
  const [manualQuery, setManualQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateScan = (qrCodeId: string) => {
    setIsScanning(true);
    setTimeout(() => {
      const found = qrCodes.find((q) => q.code === qrCodeId) || qrCodes[0];
      setScannedStation(found.stationName);
      try {
        setScannedPayload(JSON.parse(found.payload));
      } catch {
        setScannedPayload({ zone: 'Mezzanine Gate', station: found.stationName });
      }
      setIsScanning(false);
      showToast(`QR Code Decoded: ${found.code} @ ${found.stationName}`);
    }, 600);
  };

  const handleDirectionsFromHere = () => {
    if (!scannedStation) return;
    setFromStation(scannedStation);
    setToStation('Chennai International Airport');
    calculateRoute(scannedStation, 'Chennai International Airport');
    onNavigateTab('results');
  };

  const handleDirectionsToHere = () => {
    if (!scannedStation) return;
    setToStation(scannedStation);
    setFromStation('Puratchi Thalaivar Dr. M.G.R. Central');
    calculateRoute('Puratchi Thalaivar Dr. M.G.R. Central', scannedStation);
    onNavigateTab('results');
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-12 max-w-5xl mx-auto space-y-12">
      {/* Header with 10vw Clash Display */}
      <div className="border-b-2 border-[#1E1E1E] pb-6">
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#3F66C2] font-bold mb-2">
          Optical Station Wayfinding v2.6
        </div>
        <h1 className="clash text-[10vw] sm:text-[8vw] uppercase leading-[0.8] tracking-[-0.05em] text-[#1E1E1E]">
          Scan Station <span className="text-[#3F66C2]">QR</span>
        </h1>
        <p className="satoshi text-base text-[#444444] max-w-xl mt-4 leading-relaxed">
          Position the camera over the physical bronze or high-contrast QR plate located at any station turnstile, elevator landing, or platform entrance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Viewfinder Column */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="relative w-[300px] h-[300px] border-2 border-dashed border-[#3F66C2] p-3 bg-black/5 shadow-xl flex items-center justify-center overflow-hidden">
            {/* Viewfinder Corner Accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#3F66C2]"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#3F66C2]"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#3F66C2]"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#3F66C2]"></div>

            {/* Laser Scanline */}
            <div className="absolute left-2 right-2 h-0.5 bg-[#3F66C2] shadow-[0_0_12px_#3F66C2] animate-scanline z-20 pointer-events-none"></div>

            {/* Inner View Area */}
            <div className="w-full h-full bg-[#1E1E1E] text-[#E4E2DD] flex flex-col items-center justify-center p-6 text-center space-y-3 relative">
              <Camera className="w-12 h-12 text-[#3F66C2] animate-pulse" />
              <div className="text-xs font-mono uppercase tracking-widest text-white/80">
                {isScanning ? 'Decoding Sensor Telemetry...' : 'Camera Viewfinder Active'}
              </div>
              <div className="text-[10px] font-mono text-white/40">
                ISO 400 • 60 FPS • High Dynamic Range
              </div>
            </div>
          </div>

          {/* Quick Simulation Buttons */}
          <div className="mt-6 w-full max-w-[340px] space-y-2">
            <div className="text-[11px] font-mono uppercase text-[#444444] text-center font-bold">
              Tap Sample Station QR Code Plaque to Test:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSimulateScan('QR-CMRL-CEN-01')}
                className="p-2 border-2 border-[#1E1E1E] text-[11px] font-mono uppercase font-bold hover:bg-[#3F66C2] hover:text-white transition-colors"
              >
                Central Gate 2
              </button>
              <button
                onClick={() => handleSimulateScan('QR-CMRL-ALN-01')}
                className="p-2 border-2 border-[#1E1E1E] text-[11px] font-mono uppercase font-bold hover:bg-[#3F66C2] hover:text-white transition-colors"
              >
                Alandur Concourse
              </button>
              <button
                onClick={() => handleSimulateScan('QR-CMRL-AIR-01')}
                className="p-2 border-2 border-[#1E1E1E] text-[11px] font-mono uppercase font-bold hover:bg-[#3F66C2] hover:text-white transition-colors"
              >
                Airport Link
              </button>
              <button
                onClick={() => handleSimulateScan('QR-CMRL-KYB-01')}
                className="p-2 border-2 border-[#1E1E1E] text-[11px] font-mono uppercase font-bold hover:bg-[#3F66C2] hover:text-white transition-colors"
              >
                Koyambedu CMBT
              </button>
            </div>
          </div>
        </div>

        {/* Result & Actions Column */}
        <div className="md:col-span-5 space-y-6">
          {scannedStation ? (
            <div className="p-6 bg-[#E4E2DD] border-2 border-[#3F66C2] shadow-2xl animate-entrance space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#3F66C2] font-bold uppercase tracking-widest border-b border-[#1E1E1E]/20 pb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Station Coordinates Acquired</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#444444] block">Locked Station</span>
                <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E]">
                  {scannedStation}
                </h3>
              </div>

              {scannedPayload && (
                <div className="p-3 bg-white/60 border border-[#1E1E1E]/20 text-xs font-mono space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#3F66C2]">QR Payload Telemetry:</div>
                  {scannedPayload.entrance && <div>Entrance: {scannedPayload.entrance}</div>}
                  {scannedPayload.hall && <div>Concourse: {scannedPayload.hall}</div>}
                  {scannedPayload.directPlatform && <div>Direct Platform: {scannedPayload.directPlatform}</div>}
                  {scannedPayload.zone && <div>Zone: {scannedPayload.zone}</div>}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleDirectionsFromHere}
                  className="w-full py-3.5 bg-[#1E1E1E] text-[#E4E2DD] font-bold uppercase text-xs tracking-widest hover:bg-[#3F66C2] transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions From Here</span>
                </button>
                <button
                  onClick={handleDirectionsToHere}
                  className="w-full py-3.5 border-2 border-[#1E1E1E] text-[#1E1E1E] font-bold uppercase text-xs tracking-widest hover:bg-[#1E1E1E] hover:text-[#E4E2DD] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Directions To Here</span>
                </button>
                <button
                  onClick={() => onNavigateTab('interchange')}
                  className="w-full py-2.5 text-[#3F66C2] font-mono text-xs uppercase font-bold hover:underline flex items-center justify-center gap-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View Station Indoor Map</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 border-2 border-[#1E1E1E] bg-[#E4E2DD] text-center space-y-3">
              <QrCode className="w-10 h-10 text-[#444444] mx-auto" />
              <div className="clash text-xl font-bold uppercase text-[#1E1E1E]">
                Awaiting Optical Input
              </div>
              <p className="satoshi text-xs text-[#444444] max-w-xs mx-auto">
                Select one of the sample QR stations on the left or type below for manual lookup.
              </p>
            </div>
          )}

          {/* Manual Station Search Fallback */}
          <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-sm space-y-4">
            <label className="block text-xs font-bold uppercase tracking-[0.15em] text-[#1E1E1E]/80">
              Manual Station Search Fallback
            </label>
            <div className="relative">
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                placeholder="Type station name..."
                className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-2 text-lg clash font-bold focus:outline-none focus:border-[#3F66C2] placeholder:text-[#1E1E1E]/30"
              />
            </div>
            {manualQuery && (
              <div className="max-h-40 overflow-y-auto space-y-1">
                {stations
                  .filter((s) => s.name.toLowerCase().includes(manualQuery.toLowerCase()))
                  .map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        setScannedStation(st.name);
                        setManualQuery('');
                      }}
                      className="w-full text-left p-2 hover:bg-[#5C82E6]/20 text-xs font-mono flex items-center justify-between border-b border-[#1E1E1E]/10"
                    >
                      <span className="font-bold">{st.name}</span>
                      <span className="text-[10px] text-[#3F66C2]">{st.code}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
