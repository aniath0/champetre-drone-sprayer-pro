
import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/NavBar';
import DroneCamera from '@/components/DroneCamera'; 
import SprayControls from '@/components/SprayControls';
import DroneController from '@/components/DroneController';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Map = () => {
  const { toast } = useToast();
  const [isConnected] = useState(true);
  const [isSpraying, setIsSpraying] = useState(false);
  const isMobile = useIsMobile();
  
  const currentField = {
    id: '1',
    name: 'Parcelle Nord',
    size: 5
  };

  const handleSprayStart = () => {
    setIsSpraying(true);
    toast({
      title: "Pulvérisation démarrée",
      description: `Pulvérisation en cours pour ${currentField.name}`,
    });
  };

  const handleSprayStop = () => {
    setIsSpraying(false);
    toast({
      title: "Pulvérisation arrêtée",
      description: "La pulvérisation a été interrompue",
    });
  };

  const handleDroneMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    toast({
      title: `Déplacement: ${direction}`,
      description: "Commande envoyée au drone",
    });
  };

  const handleAltitudeChange = (direction: 'up' | 'down') => {
    toast({
      title: `Altitude: ${direction === 'up' ? 'augmentée' : 'diminuée'}`,
      description: "Commande envoyée au drone",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-sidebar/30">
      <NavBar droneStatus={isSpraying ? 'spraying' : 'online'} />
      <main className="flex-1 py-2">
        <div className="container mx-auto p-2 space-y-3">
          <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-3'} gap-4`}>
            {/* Vue principale de la caméra */}
            <div className={isMobile ? "col-span-1" : "lg:col-span-2"}>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <span className="w-2 h-6 bg-spray-DEFAULT mr-2 rounded-sm"></span>
                Vue caméra drone en direct
              </h2>
              <div className="bg-black/5 backdrop-blur-sm p-3 border border-sidebar-border rounded-lg">
                <DroneCamera 
                  isLive={isConnected} 
                  isRecording={isSpraying}
                  onSprayStart={handleSprayStart}
                  onSprayStop={handleSprayStop}
                />
              </div>
            </div>
            
            {/* Contrôles de pulvérisation - afficher uniquement en mode desktop */}
            {!isMobile && (
              <div>
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  <span className="w-2 h-6 bg-agriculture-DEFAULT mr-2 rounded-sm"></span>
                  Contrôles
                </h2>
                <div className="bg-black/5 backdrop-blur-sm p-3 border border-sidebar-border rounded-lg h-[calc(100%-2rem)]">
                  <SprayControls 
                    isConnected={isConnected}
                    currentField={currentField}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Contrôleur mobile - n'afficher que sur mobile */}
          {isMobile && (
            <div className="bg-black/5 backdrop-blur-sm p-3 border border-sidebar-border rounded-lg">
              <DroneController 
                onSprayToggle={(isActive) => {
                  if (isActive) {
                    handleSprayStart();
                  } else {
                    handleSprayStop();
                  }
                }}
                onMove={handleDroneMove}
                onAltitudeChange={handleAltitudeChange}
                isConnected={isConnected}
              />
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Map;
