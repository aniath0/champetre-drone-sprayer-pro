
import React, { useEffect, useRef } from 'react';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface PolygonData {
  id: string;
  positions: LatLngExpression[];
  color: string;
}

interface SprayMapProps {
  center: [number, number];
  zoom: number;
  polygons: PolygonData[];
  isSpraying: boolean;
  onPolygonClick: (id: string, positions: LatLngExpression[]) => void;
}

const SprayMap: React.FC<SprayMapProps> = ({ 
  center, 
  zoom, 
  polygons, 
  isSpraying, 
  onPolygonClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const polygonRefs = useRef<Record<string, L.Polygon>>({});
  
  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;
    
    // Set up default marker icon
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    
    L.Marker.prototype.options.icon = DefaultIcon;
    
    // Create map
    leafletMap.current = L.map(mapRef.current).setView(center, zoom);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap.current);
    
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [center, zoom]);
  
  // Update polygons when they change
  useEffect(() => {
    if (!leafletMap.current) return;
    
    // Clear existing polygons
    Object.values(polygonRefs.current).forEach(poly => {
      poly.remove();
    });
    polygonRefs.current = {};
    
    // Add new polygons
    polygons.forEach(polygon => {
      const poly = L.polygon(polygon.positions, {
        color: polygon.color,
        weight: 3,
        fillOpacity: 0.3,
        fillColor: polygon.color
      }).addTo(leafletMap.current!);
      
      poly.on('click', () => {
        onPolygonClick(polygon.id, polygon.positions);
      });
      
      polygonRefs.current[polygon.id] = poly;
    });
  }, [polygons, onPolygonClick]);
  
  return (
    <div className="border border-dashed border-gray-300 rounded-md h-[300px] relative">
      <div ref={mapRef} className="h-full w-full" />
      
      {isSpraying && (
        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
          <div className="bg-white/90 p-4 rounded-md shadow-lg">
            <p className="font-semibold text-blue-600">Pulvérisation en cours</p>
            <p className="text-sm text-gray-500">Zones sélectionnées: {polygons.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprayMap;
