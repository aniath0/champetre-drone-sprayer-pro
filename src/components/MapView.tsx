
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, MapPin, Navigation } from 'lucide-react';

interface MapViewProps {
  className?: string;
}

const MapView = ({ className }: MapViewProps) => {
  return (
    <Card className={`h-full border border-sidebar-border bg-card/80 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <Layers className="mr-2 h-5 w-5 text-[#03A9F4]" />
            Cartographie
          </CardTitle>
          <Badge variant="outline" className="bg-spray-DEFAULT/10 text-xs">En direct</Badge>
        </div>
        <CardDescription className="text-xs">Vue aérienne</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="map-visualization rounded-md overflow-hidden h-[300px] relative">
          {/* Simplified map visualization */}
          <div className="absolute inset-0 bg-[#e5e7eb] bg-opacity-80">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {Array(64).fill(0).map((_, i) => (
                <div 
                  key={i}
                  className={`border border-gray-300 ${i % 7 === 0 ? 'bg-green-100/50' : ''} ${i % 9 === 0 ? 'bg-green-200/50' : ''}`}
                >
                  {i === 27 && (
                    <div className="flex items-center justify-center h-full">
                      <div className="h-4 w-4 rounded-full bg-red-500 animate-pulse relative">
                        <div className="absolute -inset-1 border-2 border-red-500 rounded-full animate-ping opacity-50"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Map overlay elements */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-2">
              <Button size="sm" variant="outline" className="bg-white/90 h-8 w-8 p-0">
                <Navigation className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90 h-8 w-8 p-0">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Map information */}
            <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm p-2 rounded text-xs shadow-sm">
              <div className="font-medium">Parcelle Nord</div>
              <div className="text-muted-foreground">48.8566° N, 2.3522° E</div>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                <span>Couverture: 45%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
