
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { setupDefaultLeafletIcon, calculatePolygonArea } from '@/utils/mapUtils';
import SprayMap from './components/map/SprayMap';
import MapToolbar from './components/map/MapToolbar';
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
  const addRectangle = () => {
    // Create a rectangle around the center point
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
    
    setPolygons([...polygons, newRectangle]);
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
  };
  
  // Handle polygon selection
  const handlePolygonClick = (polygonId: string, positions: LatLngExpression[]) => {
    if (drawingMode !== 'select') return;
    
    // Toggle selection
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
  };
  
  // Clear all selections
  const clearSelections = () => {
    setPolygons([]);
    setSelectedAreas([]);
    onAreasSelected([]);
  };
  
  // Handle mode change
  const handleModeChange = (newMode: 'select' | 'draw') => {
    setDrawingMode(newMode);
  };

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
