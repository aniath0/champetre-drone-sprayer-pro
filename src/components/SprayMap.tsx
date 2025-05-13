
import React from 'react';
import { Map, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  // Dans une vraie application, cette partie utiliserait une bibliothèque comme Leaflet ou Google Maps
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Carte des Zones</CardTitle>
          <Button variant="outline" size="sm">
            <Map className="h-4 w-4 mr-2" />
            Agrandir
          </Button>
        </div>
        <CardDescription>Vue des zones à pulvériser</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="map-container relative rounded-md border border-border">
          {/* Cette partie simule une carte, dans un vrai projet nous utiliserions une vraie carte */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Map className="h-12 w-12 mx-auto mb-2" />
              <p>Carte interactive des zones de pulvérisation</p>
              <p className="text-sm">Vue simplifiée - dans l'application finale, une vraie carte s'affichera ici.</p>
            </div>
          </div>

          {/* Informations sur les zones disponibles */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-md shadow-md">
            <h4 className="font-medium text-sm mb-2">Zones disponibles</h4>
            <div className="grid grid-cols-2 gap-2">
              {fields.map((field) => (
                <Button 
                  key={field.id}
                  variant={field.status === 'completed' ? "secondary" : "default"}
                  size="sm"
                  className="justify-start"
                  onClick={() => onSelectField(field)}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{field.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {currentDronePosition ? (
          <div>Position actuelle: {currentDronePosition[0].toFixed(6)}, {currentDronePosition[1].toFixed(6)}</div>
        ) : (
          <div>Position du drone indisponible</div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SprayMap;
