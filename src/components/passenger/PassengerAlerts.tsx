import React, { useState } from 'react';
import { useMetroNav } from '../../context/MetroNavContext';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  Clock,
  ShieldAlert,
  Train,
  Volume2,
} from 'lucide-react';

interface PassengerAlertsProps {
  onNavigateTab: (tab: string) => void;
}

export const PassengerAlerts: React.FC<PassengerAlertsProps> = ({ onNavigateTab }) => {
  const {
    alerts,
    lines,
    setFromStation,
    setToStation,
    calculateRoute,
    showToast,
  } = useMetroNav();

  const [subscribedLines, setSubscribedLines] = useState<string[]>(['L', '1']);

  const toggleSubscription = (lineCode: string) => {
    setSubscribedLines((prev) => {
      const exists = prev.includes(lineCode);
      const updated = exists ? prev.filter((c) => c !== lineCode) : [...prev, lineCode];
      showToast(
        exists
          ? `Unsubscribed from Line ${lineCode} push notifications.`
          : `Subscribed to real-time SMS & Push updates for Line ${lineCode}.`
      );
      return updated;
    });
  };

  const handleAlternateRoute = (alert: any) => {
    setFromStation('Times Square - 42nd St');
    setToStation('Atlantic Ave - Barclays Ctr');
    calculateRoute('Times Square - 42nd St', 'Atlantic Ave - Barclays Ctr');
    onNavigateTab('results');
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-12 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="border-b-2 border-[#1E1E1E] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#3F66C2] font-bold mb-2">
            Real-Time Network Telemetry
          </div>
          <h1 className="clash text-[8vw] sm:text-[6vw] uppercase leading-[0.8] tracking-[-0.05em] text-[#1E1E1E]">
            Service <span className="text-[#3F66C2]">Updates</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-[#1E1E1E] text-[#E4E2DD] px-4 py-2 border-2 border-[#1E1E1E]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono uppercase font-bold">
            Live Feed: {alerts.filter((a) => a.active).length} Active Disruptions
          </span>
        </div>
      </div>

      {/* Line Subscription Strip */}
      <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E1E1E]/20 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#3F66C2]" />
            <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#1E1E1E]">
              Get Instant Alerts For Favorite Lines
            </span>
          </div>
          <span className="text-xs font-mono text-[#444444]">
            {subscribedLines.length} Lines Monitored
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {lines.map((line) => {
            const isSubscribed = subscribedLines.includes(line.code);
            return (
              <button
                key={line.id}
                onClick={() => toggleSubscription(line.code)}
                className={`px-3 py-1.5 border-2 text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                  isSubscribed
                    ? 'border-[#3F66C2] bg-[#3F66C2] text-white shadow-sm'
                    : 'border-[#1E1E1E]/40 bg-white/40 text-[#1E1E1E] hover:border-[#1E1E1E]'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                  style={{
                    backgroundColor: isSubscribed ? '#FFFFFF' : line.color,
                    color: isSubscribed ? '#3F66C2' : line.textColor,
                  }}
                >
                  {line.code}
                </span>
                <span>Line {line.code}</span>
                {isSubscribed && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert Cards Stack */}
      <div className="space-y-6">
        {alerts.map((alert) => {
          const isSevere = alert.severity === 'Severe';
          const isMajor = alert.severity === 'Major';

          const borderColor = isSevere
            ? 'border-[#3F66C2]'
            : isMajor
            ? 'border-[#5C82E6]'
            : 'border-[#444444]';

          const badgeBg = isSevere
            ? 'bg-[#3F66C2] text-white'
            : isMajor
            ? 'bg-[#5C82E6] text-[#1E1E1E]'
            : 'bg-black/10 text-[#444444]';

          return (
            <div
              key={alert.id}
              className={`p-6 sm:p-8 bg-[#E4E2DD] border-2 ${borderColor} border-l-8 shadow-lg space-y-4`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#1E1E1E]/20 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-widest ${badgeBg}`}>
                    {alert.severity} Disruption
                  </span>
                  <div className="flex gap-1.5">
                    {alert.affectedLines.map((ln) => (
                      <span
                        key={ln}
                        className="w-6 h-6 rounded-full bg-[#1E1E1E] text-white text-xs font-mono font-bold flex items-center justify-center"
                      >
                        {ln}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs font-mono text-[#444444] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{alert.duration}</span>
                </div>
              </div>

              <div>
                <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E] mb-2">
                  {alert.title}
                </h3>
                <p className="satoshi text-base text-[#444444] leading-relaxed">
                  {alert.description}
                </p>
              </div>

              {alert.alternateRouteSuggestion && (
                <div className="p-4 bg-white/60 border border-[#1E1E1E]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div className="text-[#1E1E1E]">
                    <span className="font-bold text-[#3F66C2]">TACTICAL ALTERNATIVE: </span>
                    {alert.alternateRouteSuggestion}
                  </div>
                  <button
                    onClick={() => handleAlternateRoute(alert)}
                    className="font-bold text-[#3F66C2] hover:text-[#1E1E1E] uppercase tracking-wider shrink-0 flex items-center gap-1"
                  >
                    <span>View Alternate Route</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
