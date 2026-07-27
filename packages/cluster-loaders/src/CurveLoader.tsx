import React from 'react';
import { CurveConfig, useCurveAnimation } from './useCurveAnimation';

export interface CurveLoaderProps {
  config: CurveConfig;
  isActive?: boolean;
  className?: string;
}

export function CurveLoader({ config, isActive = true, className = "" }: CurveLoaderProps) {
  const { groupRef, pathRef, particlesRef } = useCurveAnimation(config, isActive);

  particlesRef.current = new Array(config.particleCount).fill(null);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        aria-hidden="true"
        className="w-full h-full overflow-visible"
      >
        <g ref={groupRef}>
          <path 
            ref={pathRef}
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.25"
          />
          {Array.from({ length: config.particleCount }).map((_, i) => (
            <circle
              key={i}
              ref={(el) => {
                particlesRef.current[i] = el;
              }}
              fill="currentColor"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
