import React, { memo } from 'react';

const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0F] via-[#101020] to-[#0A0A0F]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#6B9FFF]/30 border-t-[#6B9FFF] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#6B9FFF] animate-pulse">Loading Campus Connect...</p>
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;