import React from 'react';

export const AtmosphericBlobs: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top-Left Cobalt Blue Blob (#3F66C2) */}
      <div
        className="blob-pulse absolute -top-[15vw] -left-[10vw] w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-70"
        style={{
          backgroundColor: '#3F66C2',
          mixBlendMode: 'multiply',
        }}
      />
      {/* Top-Right Warm Orange Blob (#5C82E6) */}
      <div
        className="blob-pulse-delayed absolute -top-[10vw] -right-[15vw] w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-60"
        style={{
          backgroundColor: '#5C82E6',
          mixBlendMode: 'multiply',
        }}
      />
      {/* Bottom Center Soft Pink / Orange Blob */}
      <div
        className="blob-pulse absolute -bottom-[20vw] left-[25vw] w-[50vw] h-[50vw] rounded-full blur-[130px] opacity-40"
        style={{
          backgroundColor: '#FF89A9',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
};
