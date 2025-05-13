
import React, { useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ZoomIn, ZoomOut, SprayCan } from 'lucide-react';

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
  const [zoomLevel, setZoomLevel] = useState(30); // 0-100
  const [cameraAngle, setCameraAngle] = useState({ x: 0, y: 0 });
  const [overlayVisible, setOverlayVisible] = useState(true);
  
  // Simulate camera feed with changing overlay elements
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        setOverlayVisible(prev => !prev);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isLive]);
  
  const handleSprayToggle = () => {
    if (isSpraying) {
      setIsSpraying(false);
      onSprayStop?.();
    } else {
      setIsSpraying(true);
      onSprayStart?.();
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 100));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 0));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    
    setCameraAngle({ x, y });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div 
          className="relative cursor-crosshair" 
          onMouseMove={handleMouseMove}
        >
          {/* Vue caméra avec un ratio d'aspect 16:9 */}
          <AspectRatio ratio={16/9} className="bg-black">
            {/* Couche principale de la vue drone */}
            <div className="absolute inset-0 overflow-hidden">
              <img 
                src="/lovable-uploads/20adf710-5c8d-40f5-97d9-15fcc1a5d7e3.png" 
                alt="Vue caméra du drone" 
                className="w-full h-full object-cover transform transition-transform duration-300"
                style={{ 
                  transform: `scale(${1 + zoomLevel/100}) translate(${cameraAngle.x}px, ${cameraAngle.y}px)`,
                  filter: isSpraying ? 'brightness(1.1) contrast(1.1)' : 'none'
                }}
              />
              
              {/* Effet de spray quand actif */}
              {isSpraying && (
                <div className="absolute inset-0 bg-green-500/10 animate-pulse z-10"></div>
              )}
              
              {/* Grille de visée */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="w-[2px] h-20 bg-white/30"></div>
                <div className="w-20 h-[2px] bg-white/30"></div>
                <div className="absolute w-16 h-16 border-2 border-white/40 rounded-full"></div>
              </div>
              
              {/* Lignes de HUD */}
              <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-white/20 z-10"></div>
              <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-white/20 z-10"></div>
              <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-white/20 z-10"></div>
              <div className="absolute inset-y-0 left-1/4 border-l border-dashed border-white/20 z-10"></div>
              <div className="absolute inset-y-0 left-2/4 border-l border-dashed border-white/20 z-10"></div>
              <div className="absolute inset-y-0 left-3/4 border-l border-dashed border-white/20 z-10"></div>
            </div>
            
            {/* Éléments d'interface supérieurs */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-white text-xs z-30">
              <div className="flex items-center gap-2 bg-black/50 px-2 py-1 rounded">
                <div className={`h-3 w-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span>{isLive ? 'LIVE' : 'DÉCONNECTÉ'}</span>
              </div>
              <div className="bg-black/50 px-2 py-1 rounded">
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span>REC</span>
                  </div>
                )}
              </div>
              <div className="bg-black/50 px-2 py-1 rounded flex items-center gap-2">
                <div className="h-2 w-10 bg-white/30 rounded-full">
                  <div className="h-full w-4/5 bg-green-500 rounded-full"></div>
                </div>
                <span>80%</span>
              </div>
            </div>
            
            {/* Info overlay qui apparaît et disparaît */}
            {overlayVisible && (
              <div className="absolute top-10 left-2 text-xs text-white bg-black/40 p-1 rounded z-30">
                <div>ALT: 32.5m</div>
                <div>SPD: 5.2km/h</div>
                <div>TEMP: 24°C</div>
              </div>
            )}
            
            {/* Contrôles de zoom */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-black/50 border-white/30"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4 text-white" />
              </Button>
              
              <div className="h-24 w-1 bg-white/30 rounded-full mx-auto relative">
                <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-full" style={{ height: `${zoomLevel}%` }} />
                <div className="absolute w-4 h-4 rounded-full -right-1.5 bg-blue-500 border-2 border-white" 
                     style={{ bottom: `calc(${zoomLevel}% - 8px)` }} />
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-black/50 border-white/30"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4 text-white" />
              </Button>
            </div>
            
            {/* Overlay de contrôle au centre-droit */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30">
              <div className="w-24 h-24 rounded-full border-2 border-white/50 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur"></div>
              </div>
            </div>
            
            {/* Boutons de contrôle */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 z-30">
              <Button 
                size="lg"
                variant="destructive"
                className="rounded-full h-14 w-32"
                onClick={onSprayStop}
                disabled={!isSpraying}
              >
                Arrêter
              </Button>
              <Button 
                size="lg"
                className={`rounded-full h-14 w-32 ${isSpraying ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={handleSprayToggle}
              >
                <SprayCan className="h-5 w-5 mr-2" />
                {isSpraying ? 'PULVÉRISE' : 'ARROSER'}
              </Button>
            </div>
            
            {/* Données techniques en bas à gauche */}
            <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 p-1 rounded z-30">
              <div className="flex items-center gap-1">
                <SprayCan className="h-3 w-3" />
                <span>NIVEAU: {Math.floor(Math.random() * 100)}%</span>
              </div>
              <div>ZOOM: {zoomLevel}%</div>
            </div>
          </AspectRatio>
        </div>
      </CardContent>
    </Card>
  );
};

export default DroneCamera;
