
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define default icon for Leaflet
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  const [mapCenter] = React.useState<[number, number]>([48.8566, 2.3522]); // Paris par défaut
  const zoom = 14;

  // Custom icons for different statuses
  const getMarkerIcon = (status: string) => {
    const iconColor = status === 'completed' 
      ? '#10B981' // Green for completed
      : status === 'in-progress'
        ? '#F97316' // Orange for in-progress
        : '#9b87f5'; // Purple for pending
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };
  
  // Special icon for drone
  const droneIcon = L.divIcon({
    className: 'drone-marker',
    html: `<div style="background-color: #F43F5E; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;">
             <div style="background-color: white; width: 4px; height: 4px; border-radius: 50%;"></div>
           </div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
  
  // Generate a unique key to force proper rendering of MapContainer
  const mapKey = `map-${mapCenter.join(',')}-${zoom}-${fields.length}-${currentDronePosition?.join(',') || 'no-drone'}-${Date.now()}`;

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
        <div className="h-[350px] w-full rounded-md overflow-hidden">
          <MapContainer 
            key={mapKey}
            center={mapCenter} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {fields.map((field) => (
              <Marker 
                key={field.id} 
                position={field.coordinates} 
                icon={getMarkerIcon(field.status)}
                eventHandlers={{
                  click: () => onSelectField(field)
                }}
              >
                <Popup>
                  <div className="text-sm font-medium">{field.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {field.size} ha · {field.status === 'completed' 
                      ? 'Terminé' 
                      : field.status === 'in-progress' 
                        ? 'En cours' 
                        : 'En attente'}
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {currentDronePosition && (
              <Marker 
                key={`drone-${currentDronePosition.join(',')}`}
                position={currentDronePosition} 
                icon={droneIcon}
              >
                <Popup>Position actuelle du drone</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        
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
