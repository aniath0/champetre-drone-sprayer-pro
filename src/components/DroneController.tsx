
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SprayCan, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';

interface DroneControllerProps {
  onSprayToggle: (isActive: boolean) => void;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onAltitudeChange: (direction: 'up' | 'down') => void;
  isConnected: boolean;
}

const DroneController = ({
  onSprayToggle,
  onMove,
  onAltitudeChange,
  isConnected
}: DroneControllerProps) => {
  const { toast } = useToast();
  const [isSpraying, setIsSpraying] = useState(false);

  const handleSprayToggle = () => {
    if (!isConnected) {
      toast({
        title: "Erreur",
        description: "Le drone n'est pas connecté",
        variant: "destructive",
      });
      return;
    }
    
    const newState = !isSpraying;
    setIsSpraying(newState);
    onSprayToggle(newState);
    
    toast({
      title: newState ? "Pulvérisation démarrée" : "Pulvérisation arrêtée",
      description: newState ? "Pulvérisation en cours" : "La pulvérisation a été interrompue",
    });
  };

  return (
    <Card className="mt-4 touch-none">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Contrôle de l'altitude */}
          <div className="col-span-1 flex flex-col justify-center items-center gap-2">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-16 h-16 rounded-full"
              onTouchStart={() => onAltitudeChange('up')}
              disabled={!isConnected}
            >
              <ArrowUp className="h-8 w-8" />
            </Button>
            <span className="text-xs">Altitude +</span>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-16 h-16 mt-4 rounded-full"
              onTouchStart={() => onAltitudeChange('down')}
              disabled={!isConnected}
            >
              <ArrowDown className="h-8 w-8" />
            </Button>
            <span className="text-xs">Altitude -</span>
          </div>
          
          {/* Contrôle de la pulvérisation */}
          <div className="col-span-1 flex justify-center items-center">
            <Button 
              variant={isSpraying ? "destructive" : "default"}
              size="lg" 
              className="w-20 h-20 rounded-full"
              onClick={handleSprayToggle}
              disabled={!isConnected}
            >
              <SprayCan className="h-10 w-10" />
            </Button>
          </div>
          
          {/* Contrôle du zoom */}
          <div className="col-span-1 flex flex-col justify-center items-center gap-2">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-16 h-16 rounded-full"
              disabled={!isConnected}
            >
              <ZoomIn className="h-8 w-8" />
            </Button>
            <span className="text-xs">Zoom +</span>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-16 h-16 mt-4 rounded-full"
              disabled={!isConnected}
            >
              <ZoomOut className="h-8 w-8" />
            </Button>
            <span className="text-xs">Zoom -</span>
          </div>
        </div>
        
        {/* Contrôle de la direction */}
        <div className="mt-8 flex justify-center">
          <div className="grid grid-cols-3 grid-rows-3 gap-2">
            <div></div>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-16 h-16 rounded-full"
              onTouchStart={() => onMove('up')}
              disabled={!isConnected}
            >
              <ArrowUp className="h-8 w-8" />
            </Button>
            <div></div>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-16 h-16 rounded-full"
              onTouchStart={() => onMove('left')}
              disabled={!isConnected}
            >
              <ArrowLeft className="h-8 w-8" />
            </Button>
            <div className="flex items-center justify-center">
              <span className="text-xs font-bold">Direction</span>
            </div>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-16 h-16 rounded-full"
              onTouchStart={() => onMove('right')}
              disabled={!isConnected}
            >
              <ArrowRight className="h-8 w-8" />
            </Button>
            <div></div>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-16 h-16 rounded-full"
              onTouchStart={() => onMove('down')}
              disabled={!isConnected}
            >
              <ArrowDown className="h-8 w-8" />
            </Button>
            <div></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DroneController;
