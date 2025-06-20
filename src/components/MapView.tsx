
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { calculatePolygonArea } from '@/utils/mapUtils';
import SprayMap from './map/SprayMap';
import MapToolbar from './map/MapToolbar';
import { LatLngExpression } from 'leaflet';

interface MapViewProps {
  className?: string;
  mode: 'select' | 'draw';
  isSpraying: boolean;
  onAreasSelected: (areas: any[]) => void;
}

interface AreaData {
  id: string;
  type: string;
  area: number;
}

interface PolygonData {
  id: string;
  positions: LatLngExpression[];
  color: string;
}

const MapView: React.FC<MapViewProps> = ({ className, mode, isSpraying, onAreasSelected }) => {
  const [mapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Paris by default
  const zoom = 14;
  const [selectedAreas, setSelectedAreas] = useState<AreaData[]>([]);
  const [drawingMode, setDrawingMode] = useState<'select' | 'draw'>(mode);
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  
  // Update drawing mode when prop changes
  useEffect(() => {
    setDrawingMode(mode);
  }, [mode]);
  
  // Add a rectangular selection zone
  const addRectangle = useCallback(() => {
    const centerLat = mapCenter[0];
    const centerLng = mapCenter[1];
    const offset = 0.005; // Approximately 500m depending on latitude
    
    const newRectangle = {
      id: Math.random().toString(36).substring(2, 15),
      positions: [
        [centerLat - offset, centerLng - offset],
        [centerLat - offset, centerLng + offset],
        [centerLat + offset, centerLng + offset],
        [centerLat + offset, centerLng - offset]
      ] as LatLngExpression[],
      color: '#3B82F6'
    };
    
    setPolygons(prev => [...prev, newRectangle]);
    const polygonArea = calculatePolygonArea(newRectangle.positions);
    
    // Update selected areas
    const newSelectedArea = {
      id: newRectangle.id,
      type: 'polygon',
      area: polygonArea
    };
    
    const updatedSelectedAreas = [...selectedAreas, newSelectedArea];
    setSelectedAreas(updatedSelectedAreas);
    onAreasSelected(updatedSelectedAreas);
  }, [mapCenter, selectedAreas, onAreasSelected]);
  
  // Handle polygon selection or creation
  const handlePolygonClick = useCallback((polygonId: string, positions: LatLngExpression[]) => {
    console.log('Polygon clicked or created:', polygonId);
    
    // Check if this is a new polygon (from drawing) or an existing one
    const isExistingPolygon = polygons.some(p => p.id === polygonId);
    
    if (isExistingPolygon && drawingMode === 'select') {
      // Toggle selection for existing polygon
      const isSelected = selectedAreas.some(area => area.id === polygonId);
      
      if (isSelected) {
        const filtered = selectedAreas.filter(area => area.id !== polygonId);
        setSelectedAreas(filtered);
        onAreasSelected(filtered);
        
        // Update polygon color
        setPolygons(polygons.map(p => 
          p.id === polygonId ? { ...p, color: '#3B82F6' } : p
        ));
      } else {
        const polygonArea = calculatePolygonArea(positions);
        const newSelectedArea = {
          id: polygonId,
          type: 'polygon',
          area: polygonArea
        };
        
        const updated = [...selectedAreas, newSelectedArea];
        setSelectedAreas(updated);
        onAreasSelected(updated);
        
        // Update polygon color to indicate selection
        setPolygons(polygons.map(p => 
          p.id === polygonId ? { ...p, color: '#1E40AF' } : p
        ));
      }
    } else if (!isExistingPolygon) {
      // This is a new drawn polygon, add it
      const newPolygon = {
        id: polygonId,
        positions: positions,
        color: '#3B82F6'
      };
      
      setPolygons(prev => [...prev, newPolygon]);
      
      // Calculate area and add to selected areas
      const polygonArea = calculatePolygonArea(positions);
      const newSelectedArea = {
        id: polygonId,
        type: 'polygon',
        area: polygonArea
      };
      
      const updated = [...selectedAreas, newSelectedArea];
      setSelectedAreas(updated);
      onAreasSelected(updated);
    }
  }, [drawingMode, selectedAreas, polygons, onAreasSelected]);
  
  // Clear all selections
  const clearSelections = useCallback(() => {
    setPolygons([]);
    setSelectedAreas([]);
    onAreasSelected([]);
  }, [onAreasSelected]);
  
  // Handle mode change
  const handleModeChange = useCallback((newMode: 'select' | 'draw') => {
    setDrawingMode(newMode);
  }, []);

  // Calculate total selected area
  const totalSelectedArea = selectedAreas.reduce((sum, area) => sum + area.area, 0);
  
  return (
    <Card className={`${className || ''}`}>
      <CardHeader className="pb-2">
        <MapToolbar
          drawingMode={drawingMode}
          selectedAreasCount={selectedAreas.length}
          onAddRectangle={addRectangle}
          onClearSelections={clearSelections}
          onModeChange={handleModeChange}
        />
      </CardHeader>
      <CardContent className="pt-0">
        <SprayMap
          center={mapCenter}
          zoom={zoom}
          polygons={polygons}
          isSpraying={isSpraying}
          onPolygonClick={handlePolygonClick}
        />
        
        {selectedAreas.length > 0 && (
          <div className="mt-4 text-sm">
            <span className="font-medium">Surface totale:</span> {totalSelectedArea} m²
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapView;
