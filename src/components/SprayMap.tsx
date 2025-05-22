
import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface FieldArea {
  id: string;
  name: string;
  coordinates: [number, number]; // Lat, Long
  size: number; // en hectares
  status: 'pending' | 'completed' | 'in-progress';
}

interface SprayMapProps {
  fields: FieldArea[];
  onSelectField: (field: FieldArea) => void;
  currentDronePosition?: [number, number];
}

const SprayMap = ({ fields, onSelectField, currentDronePosition }: SprayMapProps) => {
  const [isClient, setIsClient] = useState(false);
  const mapCenter: [number, number] = [48.8566, 2.3522]; // Paris by default
  const zoom = 14;
  const mapRef = React.useRef<HTMLDivElement>(null);
  const leafletMap = React.useRef<L.Map | null>(null);

  // Initialize map on client-side only
  useEffect(() => {
    setIsClient(true);
    
    if (!mapRef.current || leafletMap.current) return;
    
    // Set up default marker icon
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;
    
    // Create the map
    leafletMap.current = L.map(mapRef.current).setView(mapCenter, zoom);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap.current);
    
    // Add field markers
    fields.forEach(field => {
      const iconColor = field.status === 'completed' 
        ? '#10B981' // Green for completed
        : field.status === 'in-progress'
          ? '#F97316' // Orange for in-progress
          : '#9b87f5'; // Purple for pending
      
      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      const marker = L.marker(field.coordinates, { icon: markerIcon })
        .addTo(leafletMap.current!)
        .bindPopup(`
          <div class="text-sm font-medium">${field.name}</div>
          <div class="text-xs text-muted-foreground">
            ${field.size} ha · ${field.status === 'completed' 
              ? 'Terminé' 
              : field.status === 'in-progress' 
                ? 'En cours' 
                : 'En attente'}
          </div>
        `);
      
      marker.on('click', () => {
        onSelectField(field);
      });
    });
    
    // Add drone marker if exists
    if (currentDronePosition) {
      const droneIcon = L.divIcon({
        className: 'drone-marker',
        html: `<div style="background-color: #F43F5E; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;">
                <div style="background-color: white; width: 4px; height: 4px; border-radius: 50%;"></div>
              </div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      
      L.marker(currentDronePosition, { icon: droneIcon })
        .addTo(leafletMap.current!)
        .bindPopup('Position actuelle du drone');
    }
    
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [fields, currentDronePosition, mapCenter, zoom, onSelectField]);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Carte des Zones</CardTitle>
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            Vue satellite
          </Button>
        </div>
        <CardDescription>Vue des zones à pulvériser</CardDescription>
      </CardHeader>
      <CardContent className="p-0 relative">
        {!isClient ? (
          <div className="h-[350px] w-full rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
            <p>Chargement de la carte...</p>
          </div>
        ) : (
          <div className="h-[350px] w-full rounded-md overflow-hidden">
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
          </div>
        )}
        
        {/* Available zones list */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-md shadow-md">
          <h4 className="font-medium text-xs mb-2">Zones disponibles</h4>
          <div className="grid grid-cols-2 gap-2">
            {fields.map((field) => (
              <Button 
                key={field.id}
                variant={field.status === 'completed' ? "secondary" : "default"}
                size="sm"
                className="justify-start text-xs"
                onClick={() => onSelectField(field)}
              >
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{field.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SprayMap;
