import React from 'react';
import { useMetroNav } from '../../context/MetroNavContext';
import { AlertCircle, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage, showToast } = useMetroNav();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-entrance">
      <div className="bg-[#1E1E1E] text-[#E4E2DD] border-2 border-[#3F66C2] shadow-2xl p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-[#3F66C2] text-white flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#3F66C2] font-bold">
              SYSTEM EVENT
            </div>
            <p className="text-xs font-satoshi text-white mt-0.5 leading-relaxed">
              {toastMessage}
            </p>
          </div>
        </div>
        <button
          onClick={() => showToast('')}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
