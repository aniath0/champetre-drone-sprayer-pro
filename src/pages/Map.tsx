
import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/NavBar';
import DroneCamera from '@/components/DroneCamera'; 
import SprayControls from '@/components/SprayControls';
import { useToast } from '@/hooks/use-toast';

const Map = () => {
  const { toast } = useToast();
  const [isConnected] = useState(true);
  const [isSpraying, setIsSpraying] = useState(false);
  
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar droneStatus={isSpraying ? 'spraying' : 'online'} />
      <main className="flex-1 py-6">
        <div className="container mx-auto p-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vue principale de la caméra */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-2">Vue caméra drone en direct</h2>
              <DroneCamera 
                isLive={isConnected} 
                isRecording={isSpraying}
                onSprayStart={handleSprayStart}
                onSprayStop={handleSprayStop}
              />
            </div>
            
            {/* Contrôles de pulvérisation */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Contrôles</h2>
              <SprayControls 
                isConnected={isConnected}
                currentField={currentField}
              />
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Map;
