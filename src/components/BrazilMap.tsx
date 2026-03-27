import React, { useState } from 'react';
import BrazilMapData from '@svg-maps/brazil';

interface BrazilMapProps {
  data: Record<string, number>;
}

export const BrazilMap: React.FC<BrazilMapProps> = ({ data }) => {
  const [hoveredState, setHoveredState] = useState<{ id: string, name: string, count: number, x: number, y: number } | null>(null);

  // maxDensity ensures dynamic color scaling even if absolute counts are low
  const maxDensity = Math.max(...(Object.values(data) as number[]), 1);

  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>, location: any) => {
    const id = location.id.toUpperCase();
    const count = data[id] || 0;
    setHoveredState({
      id,
      name: location.name,
      count,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => setHoveredState(null);

  // handle CJS exports vs ES exports cleanly
  const mapData = BrazilMapData.default || BrazilMapData;

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-4">
      <svg viewBox={mapData.viewBox} className="w-full max-w-[400px] h-auto drop-shadow-2xl">
        {mapData.locations.map((location: any) => {
          const id = location.id.toUpperCase();
          const count = data[id] || 0;
          const heat = count / maxDensity;
          
          let fillColor = '#27272a'; // zinc-800
          if (count > 0) {
              // Premium gold scale using HSL (hue 44, saturation 72)
              // Lighter (higher L) when density is higher. L range: 30% to 65%
              const l = 30 + (heat * 35);
              fillColor = `hsl(44, 72%, ${l}%)`;
          }

          return (
            <path
              key={location.id}
              id={location.id}
              name={location.name}
              d={location.path}
              fill={fillColor}
              stroke="#18181b"
              strokeWidth="2"
              className="transition-colors duration-300 hover:brightness-125 cursor-pointer"
              onMouseMove={(e) => handleMouseMove(e, location)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </svg>
      
      {/* Tooltip */}
      {hoveredState && (
        <div 
          className="fixed pointer-events-none z-50 bg-black/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md transform -translate-x-1/2 -translate-y-full"
          style={{ left: hoveredState.x, top: hoveredState.y - 15 }}
        >
          <p className="text-white font-bold text-sm tracking-wide">{hoveredState.name}</p>
          <div className="flex items-center gap-2 mt-1">
             <span className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span>
             <p className="text-zinc-300 text-xs font-mono">{hoveredState.count} lead{hoveredState.count !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}
    </div>
  );
};
