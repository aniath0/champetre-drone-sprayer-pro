
import React, { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapPolygon from './MapPolygon';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { setupDefaultLeafletIcon } from '@/utils/mapUtils';

// Initialize Leaflet icons
useEffect(() => {
  setupDefaultLeafletIcon();
}, []);

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
  // Initialize Leaflet icons
  useEffect(() => {
    setupDefaultLeafletIcon();
  }, []);
  
  return (
    <div className="border border-dashed border-gray-300 rounded-md h-[300px] relative">
      <MapContainer 
        center={center}
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
          <MapPolygon 
            key={polygon.id}
            id={polygon.id}
            positions={polygon.positions}
            color={polygon.color}
            onClick={onPolygonClick}
          />
        ))}
      </MapContainer>
      
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
