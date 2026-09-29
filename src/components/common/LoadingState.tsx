import React from 'react';

interface LoadingStateProps {
  message?: string;
  minHeight?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading details...',
  minHeight = 'min-h-[280px]',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${minHeight} p-8 text-center`}>
      <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mb-3" />
      <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium">{message}</p>
    </div>
  );
};
