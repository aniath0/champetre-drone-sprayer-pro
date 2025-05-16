
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, MapPin, Navigation, Route, Map } from 'lucide-react';

interface MapViewProps {
  className?: string;
}

interface Zone {
  id: string;
  points: { x: number; y: number }[];
  selected: boolean;
}

const MapView = ({ className }: MapViewProps) => {
  const [mode, setMode] = useState<'select' | 'view'>('view');
  const [selectedZones, setSelectedZones] = useState<Zone[]>([]);
  const [currentZone, setCurrentZone] = useState<{points: {x: number; y: number}[]}>({points: []});
  const [hoveredArea, setHoveredArea] = useState<{x: number; y: number} | null>(null);
  
  const rows = 12;
  const cols = 12;
  
  const handleAreaClick = (x: number, y: number) => {
    if (mode !== 'select') return;
    
    // If starting a new zone selection
    if (currentZone.points.length === 0) {
      setCurrentZone({points: [{x, y}]});
      return;
    }
    
    // Add point to current zone
    const updatedPoints = [...currentZone.points, {x, y}];
    setCurrentZone({points: updatedPoints});
    
    // If we have at least 3 points, we can consider it a zone
    if (updatedPoints.length >= 3) {
      const newZone = {
        id: `zone-${Date.now()}`,
        points: updatedPoints,
        selected: true
      };
      setSelectedZones(prev => [...prev, newZone]);
    }
  };
  
  const completeZone = () => {
    if (currentZone.points.length >= 3) {
      const newZone = {
        id: `zone-${Date.now()}`,
        points: currentZone.points,
        selected: true
      };
      setSelectedZones(prev => [...prev, newZone]);
    }
    setCurrentZone({points: []});
  };
  
  const handleModeToggle = () => {
    if (mode === 'select') {
      completeZone();
    }
    setMode(prevMode => prevMode === 'select' ? 'view' : 'select');
  };
  
  const clearSelection = () => {
    setSelectedZones([]);
    setCurrentZone({points: []});
  };

  const getAreaBackground = (x: number, y: number) => {
    // Check if this point is part of a selected zone
    const isInSelectedZone = selectedZones.some(zone => 
      isPointInPolygon({x, y}, zone.points)
    );
    
    if (isInSelectedZone) {
      return 'bg-orange-400/80';
    }
    
    if (mode === 'select' && hoveredArea?.x === x && hoveredArea?.y === y) {
      return 'bg-orange-200/50';
    }
    
    // Natural terrain texture
    if (
      (x + y) % 7 === 0 || 
      (x * y) % 13 === 0 ||
      (x === 5 && y > 3 && y < 8)
    ) {
      return 'bg-green-200/50';
    }
    
    if ((x + y) % 5 === 0) {
      return 'bg-green-100/30';
    }
    
    return '';
  };

  // Function to check if a point is inside a polygon (zone)
  const isPointInPolygon = (point: {x: number; y: number}, polygon: {x: number; y: number}[]) => {
    // Simple implementation for demonstration
    // In a real app, you'd use a more sophisticated algorithm
    const distanceToSegments = polygon.map((p, index) => {
      const next = polygon[(index + 1) % polygon.length];
      return distanceToSegment(point, p, next);
    });
    
    return Math.min(...distanceToSegments) < 0.5;
  };
  
  // Helper function to calculate distance from a point to a line segment
  const distanceToSegment = (
    point: {x: number; y: number},
    lineStart: {x: number; y: number},
    lineEnd: {x: number; y: number}
  ) => {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const l2 = dx * dx + dy * dy;
    
    if (l2 === 0) {
      // Line segment is actually a point
      return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
    }
    
    // Calculate projection of point onto line
    const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / l2;
    
    if (t < 0) {
      // Beyond the lineStart end of the segment
      return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
    }
    if (t > 1) {
      // Beyond the lineEnd end of the segment
      return Math.sqrt((point.x - lineEnd.x) ** 2 + (point.y - lineEnd.y) ** 2);
    }
    
    // Projection falls on the segment
    const projection = {
      x: lineStart.x + t * dx,
      y: lineStart.y + t * dy
    };
    return Math.sqrt((point.x - projection.x) ** 2 + (point.y - projection.y) ** 2);
  };
  
  // Calculate coverage percentage
  const calculateCoverage = () => {
    // In a real implementation, this would calculate the actual area covered
    // Here we just use the number of zones as an approximation
    const totalArea = rows * cols;
    const selectedArea = selectedZones.length * 5; // Assume each zone covers ~5 grid cells
    return Math.min(100, Math.max(0, (selectedArea / totalArea) * 100));
  };
  
  // Render zones as SVG polygons
  const renderZones = () => {
    return selectedZones.map(zone => {
      // Convert grid coordinates to pixel coordinates
      const points = zone.points.map(p => `${p.x * (100/cols)}%,${p.y * (100/rows)}%`).join(' ');
      
      return (
        <polygon 
          key={zone.id}
          points={points}
          className="fill-orange-400/60 stroke-orange-600 stroke-[0.5]"
        />
      );
    });
  };
  
  // Render current zone being created
  const renderCurrentZone = () => {
    if (currentZone.points.length < 2) return null;
    
    const points = currentZone.points.map(p => `${p.x * (100/cols)}%,${p.y * (100/rows)}%`).join(' ');
    
    return (
      <polyline 
        points={points}
        className="fill-none stroke-orange-600 stroke-[0.5] stroke-dashed"
      />
    );
  };
  
  return (
    <Card className={`h-full border border-sidebar-border bg-card/80 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <Layers className="mr-2 h-5 w-5 text-[#03A9F4]" />
            Cartographie
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={mode === 'select' ? "default" : "outline"} 
              onClick={handleModeToggle}
              className="h-8"
            >
              {mode === 'select' ? 'Terminer' : 'Délimiter zone'}
            </Button>
            <Badge variant="outline" className="bg-spray-DEFAULT/10 text-xs">En direct</Badge>
          </div>
        </div>
        <CardDescription className="text-xs">
          {mode === 'select' 
            ? 'Cliquez pour créer des points et définir une zone' 
            : 'Vue aérienne'} 
          • {selectedZones.length > 0 
              ? `${selectedZones.length} zone(s) définie(s)` 
              : 'Aucune zone définie'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="map-visualization rounded-md overflow-hidden h-[300px] relative">
          {/* Interactive map visualization */}
          <div className="absolute inset-0 bg-[#F2FCE2] bg-opacity-80">
            <div 
              className={`grid grid-cols-${cols} grid-rows-${rows} h-full w-full ${mode === 'select' ? 'cursor-pointer' : ''}`}
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
            >
              {Array(rows * cols).fill(0).map((_, index) => {
                const x = index % cols;
                const y = Math.floor(index / cols);
                return (
                  <div 
                    key={index}
                    className={`border border-gray-300/40 transition-colors duration-100 ${getAreaBackground(x, y)}`}
                    onClick={() => handleAreaClick(x, y)}
                    onMouseEnter={() => setHoveredArea({x, y})}
                    onMouseLeave={() => setHoveredArea(null)}
                  >
                    {y === 3 && x === 6 && (
                      <div className="flex items-center justify-center h-full">
                        <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse relative">
                          <div className="absolute -inset-1 border-2 border-red-500 rounded-full animate-ping opacity-50"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* SVG overlay for zones */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {renderZones()}
              {renderCurrentZone()}
            </svg>
            
            {/* Map controls */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-2">
              <Button size="sm" variant="outline" className="bg-white/90 h-8 w-8 p-0">
                <Navigation className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90 h-8 w-8 p-0">
                <MapPin className="h-4 w-4" />
              </Button>
              {mode === 'select' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-white/90 h-8 w-8 p-0" 
                  onClick={clearSelection}
                >
                  <Map className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Map information */}
            <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm p-2 rounded text-xs shadow-sm">
              <div className="font-medium">Parcelle Nord</div>
              <div className="text-muted-foreground">48.8566° N, 2.3522° E</div>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                {selectedZones.length > 0 ? (
                  <span>Surface sélectionnée: {calculateCoverage().toFixed(1)}%</span>
                ) : (
                  <span>Couverture: 0%</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
