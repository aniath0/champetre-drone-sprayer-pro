
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, MapPin, Navigation, Route, Map } from 'lucide-react';

interface MapViewProps {
  className?: string;
}

interface Cell {
  row: number;
  col: number;
  selected: boolean;
}

const MapView = ({ className }: MapViewProps) => {
  const [mode, setMode] = useState<'select' | 'view'>('view');
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [hoveredCell, setHoveredCell] = useState<{ row: number, col: number } | null>(null);
  
  const rows = 12;
  const cols = 12;
  
  const toggleCell = (row: number, col: number) => {
    const cellIndex = selectedCells.findIndex(cell => cell.row === row && cell.col === col);
    
    if (cellIndex >= 0) {
      // Remove cell if already selected
      setSelectedCells(prev => prev.filter((_, i) => i !== cellIndex));
    } else {
      // Add cell if not selected
      setSelectedCells(prev => [...prev, { row, col, selected: true }]);
    }
  };
  
  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };
  
  const handleMouseEnter = (row: number, col: number) => {
    setHoveredCell({ row, col });
  };
  
  const handleMouseLeave = () => {
    setHoveredCell(null);
  };
  
  const handleModeToggle = () => {
    setMode(prevMode => prevMode === 'select' ? 'view' : 'select');
  };
  
  const clearSelection = () => {
    setSelectedCells([]);
  };

  const getCellBackground = (row: number, col: number) => {
    if (isCellSelected(row, col)) {
      return 'bg-orange-400/80';
    }
    
    if (mode === 'select' && hoveredCell?.row === row && hoveredCell?.col === col) {
      return 'bg-orange-200/50';
    }
    
    if (
      // Créer une texture naturelle pour le terrain
      (row + col) % 7 === 0 || 
      (row * col) % 13 === 0 ||
      (row === 5 && col > 3 && col < 8)
    ) {
      return 'bg-green-200/50';
    }
    
    if ((row + col) % 5 === 0) {
      return 'bg-green-100/30';
    }
    
    return '';
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
          {mode === 'select' ? 'Sélectionnez les zones à pulvériser' : 'Vue aérienne'} 
          • {selectedCells.length > 0 ? `${selectedCells.length} cellules sélectionnées` : 'Aucune zone définie'}
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
                const row = Math.floor(index / cols);
                const col = index % cols;
                return (
                  <div 
                    key={index}
                    className={`border border-gray-300/40 transition-colors duration-100 ${getCellBackground(row, col)}`}
                    onClick={mode === 'select' ? () => toggleCell(row, col) : undefined}
                    onMouseEnter={() => handleMouseEnter(row, col)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {row === 3 && col === 6 && (
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
            
            {/* Map overlay elements */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-2">
              <Button size="sm" variant="outline" className="bg-white/90 h-8 w-8 p-0">
                <Navigation className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90 h-8 w-8 p-0">
                <MapPin className="h-4 w-4" />
              </Button>
              {mode === 'select' && (
                <Button size="sm" variant="outline" className="bg-white/90 h-8 w-8 p-0" onClick={clearSelection}>
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
                {selectedCells.length > 0 ? (
                  <span>Surface sélectionnée: {(selectedCells.length / (rows * cols) * 100).toFixed(1)}%</span>
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
