import { useEffect, useState } from 'react';

interface CountUpNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export function CountUpNumber({ value, duration = 1000, className = '' }: CountUpNumberProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation when component mounts
    setIsVisible(true);
    
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className={className}>{isVisible ? count : 0}</span>;
}

