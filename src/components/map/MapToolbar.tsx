
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { LassoSelect, MousePointerClick, MapIcon } from 'lucide-react';

interface MapToolbarProps {
  drawingMode: 'select' | 'draw';
  selectedAreasCount: number;
  onAddRectangle: () => void;
  onClearSelections: () => void;
}

const MapToolbar: React.FC<MapToolbarProps> = ({
  drawingMode,
  selectedAreasCount,
  onAddRectangle,
  onClearSelections
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">Zones à pulvériser</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAddRectangle}
          >
            <MapIcon className="h-4 w-4 mr-1" />
            Ajouter zone
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearSelections}
          >
            Effacer tout
          </Button>
        </div>
      </div>
      
      <div className="mb-2 flex items-center justify-between">
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={drawingMode === 'draw' ? 'default' : 'outline'}
            className="h-8"
          >
            <LassoSelect className="h-4 w-4 mr-1" />
            Délimiter
          </Button>
          
          <Button 
            size="sm" 
            variant={drawingMode === 'select' ? 'default' : 'outline'}
            className="h-8"
          >
            <MousePointerClick className="h-4 w-4 mr-1" />
            Sélectionner
          </Button>
        </div>
        
        {selectedAreasCount > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedAreasCount} zone(s) sélectionnée(s)
          </div>
        )}
      </div>
    </>
  );
};

export default MapToolbar;
