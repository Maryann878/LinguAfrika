import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  status?: 'not-started' | 'in-progress' | 'completed';
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const getBarColor = (status: ProgressBarProps['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
      return 'bg-primary';
    default:
      return 'bg-red-500';
  }
};

const getSizeClasses = (size: ProgressBarProps['size']) => {
  switch (size) {
    case 'sm':
      return 'h-1.5';
    case 'lg':
      return 'h-3';
    default:
      return 'h-2.5';
  }
};

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  status = 'in-progress', 
  showLabel = true, 
  className,
  size = 'md'
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div
      className={cn(
        "w-full max-w-xs mx-auto bg-gray-200 rounded-full relative overflow-hidden",
        getSizeClasses(size),
        className
      )}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${clampedProgress}% (${status.replace('-', ' ')})`}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          getBarColor(status)
        )}
        style={{ width: `${clampedProgress}%` }}
      />
      {showLabel && (
        <span
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold select-none",
            clampedProgress > 40 ? "text-white" : "text-gray-700"
          )}
        >
          {clampedProgress}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;


