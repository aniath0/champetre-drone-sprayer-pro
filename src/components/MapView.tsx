
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map as MapIcon, LassoSelect, MousePointerClick } from 'lucide-react';
import { fabric } from 'fabric';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icon setup for Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Setup default Leaflet icons
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  className?: string;
  mode: 'select' | 'draw';
  isSpraying: boolean;
  onAreasSelected: (areas: any[]) => void;
}

const MapView = ({ className, mode, isSpraying, onAreasSelected }: MapViewProps) => {
  const [mapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Paris by default
  const zoom = 14;
  const [selectedAreas, setSelectedAreas] = useState<any[]>([]);
  const [drawingMode, setDrawingMode] = useState<'select' | 'draw'>(mode);
  const [polygons, setPolygons] = useState<Array<{ id: string, positions: L.LatLngExpression[], color: string }>>([]);
  
  // Update drawing mode when prop changes
  useEffect(() => {
    setDrawingMode(mode);
  }, [mode]);
  
  // Calculate approximate area of a polygon in square meters
  const calculatePolygonArea = (positions: L.LatLngExpression[]): number => {
    if (positions.length < 3) return 0;
    
    const latLngs = positions.map(pos => Array.isArray(pos) ? L.latLng(pos[0], pos[1]) : pos);
    const polygon = L.polygon(latLngs);
    // Get approximate area in square meters
    return Math.round(L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]));
  };
  
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
      ] as L.LatLngExpression[],
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
  const handlePolygonClick = (polygon: any) => {
    if (drawingMode !== 'select') return;
    
    // Toggle selection
    const isSelected = selectedAreas.some(area => area.id === polygon.id);
    
    if (isSelected) {
      const filtered = selectedAreas.filter(area => area.id !== polygon.id);
      setSelectedAreas(filtered);
      onAreasSelected(filtered);
      
      // Update polygon color
      setPolygons(polygons.map(p => 
        p.id === polygon.id ? { ...p, color: '#3B82F6' } : p
      ));
    } else {
      const polygonArea = calculatePolygonArea(polygon.positions);
      const newSelectedArea = {
        id: polygon.id,
        type: 'polygon',
        area: polygonArea
      };
      
      const updated = [...selectedAreas, newSelectedArea];
      setSelectedAreas(updated);
      onAreasSelected(updated);
      
      // Update polygon color to indicate selection
      setPolygons(polygons.map(p => 
        p.id === polygon.id ? { ...p, color: '#1E40AF' } : p
      ));
    }
  };
  
  // Clear all selections
  const clearSelections = () => {
    setPolygons([]);
    setSelectedAreas([]);
    onAreasSelected([]);
  };

  // Calculate total selected area
  const totalSelectedArea = selectedAreas.reduce((sum, area) => sum + area.area, 0);
  
  return (
    <Card className={`${className || ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Zones à pulvériser</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={addRectangle}
            >
              <MapIcon className="h-4 w-4 mr-1" />
              Ajouter zone
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearSelections}
            >
              Effacer tout
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
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
          
          {selectedAreas.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedAreas.length} zone(s) sélectionnée(s)
            </div>
          )}
        </div>
        
        <div className="border border-dashed border-gray-300 rounded-md h-[300px] relative">
          <MapContainer 
            center={mapCenter}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Display all polygon zones */}
            {polygons.map(polygon => (
              <Polygon 
                key={polygon.id}
                positions={polygon.positions}
                pathOptions={{
                  color: polygon.color,
                  weight: 3,
                  fillOpacity: 0.3,
                  fillColor: polygon.color
                }}
                eventHandlers={{
                  click: () => handlePolygonClick(polygon)
                }}
              />
            ))}
          </MapContainer>
          
          {isSpraying && (
            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
              <div className="bg-white/90 p-4 rounded-md shadow-lg">
                <p className="font-semibold text-blue-600">Pulvérisation en cours</p>
                <p className="text-sm text-gray-500">Zones sélectionnées: {selectedAreas.length}</p>
              </div>
            </div>
          )}
        </div>
        
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
