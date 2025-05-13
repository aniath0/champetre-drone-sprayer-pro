
import React, { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DroneCameraProps {
  isLive: boolean;
  isRecording?: boolean;
  onSprayStart?: () => void;
  onSprayStop?: () => void;
}

const DroneCamera = ({ 
  isLive = true, 
  isRecording = false,
  onSprayStart,
  onSprayStop
}: DroneCameraProps) => {
  const [isSpraying, setIsSpraying] = useState(false);
  
  const handleSprayToggle = () => {
    if (isSpraying) {
      setIsSpraying(false);
      onSprayStop?.();
    } else {
      setIsSpraying(true);
      onSprayStart?.();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Vue caméra avec un ratio d'aspect 16:9 */}
          <AspectRatio ratio={16/9} className="bg-black">
            <img 
              src="/lovable-uploads/20adf710-5c8d-40f5-97d9-15fcc1a5d7e3.png" 
              alt="Vue caméra du drone" 
              className="w-full h-full object-cover"
            />
            
            {/* Indicateurs de statut */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-white text-xs">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span>{isLive ? 'LIVE' : 'DÉCONNECTÉ'}</span>
              </div>
              <div>
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span>REC</span>
                  </div>
                )}
              </div>
              <div className="bg-black/50 px-2 py-1 rounded">80%</div>
            </div>
            
            {/* Barre de zoom stylisée */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-1/2 w-1 bg-white/30 rounded-full">
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-full h-1/3" />
              <div className="absolute bg-blue-500 w-4 h-4 rounded-full -right-1.5 top-2/3 -translate-y-1/2 border-2 border-white"/>
            </div>
            
            {/* Boutons de contrôle */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <Button 
                size="lg"
                variant="destructive"
                className="rounded-full h-14 w-32"
                onClick={onSprayStop}
              >
                Arrêter
              </Button>
              <Button 
                size="lg"
                className="rounded-full h-14 w-32 bg-blue-500 hover:bg-blue-600"
                onClick={handleSprayToggle}
              >
                ARROSER
              </Button>
            </div>

            {/* Overlay de contrôle au centre */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <div className="w-24 h-24 rounded-full border-2 border-white/50 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-400/30"></div>
              </div>
            </div>
          </AspectRatio>
        </div>
      </CardContent>
    </Card>
  );
};

export default DroneCamera;
