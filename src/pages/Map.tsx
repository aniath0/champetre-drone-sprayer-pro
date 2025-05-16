
import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/NavBar';
import MapView from '@/components/MapView';
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
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {/* Vue principale de la caméra */}
            <div className={`${isMobile ? "order-2" : ""} md:col-span-2`}>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <span className="w-2 h-6 bg-spray-DEFAULT mr-2 rounded-sm"></span>
                Vue caméra drone en direct
              </h2>
              <div className="bg-black/5 backdrop-blur-sm p-3 border border-sidebar-border rounded-lg min-h-[250px] sm:min-h-[300px] flex items-center justify-center">
                {/* La zone pour la caméra de drone est vide comme demandé */}
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Connectez-vous au drone pour activer la vue caméra</p>
                </div>
              </div>
            </div>
            
            {/* Carte de visualisation pour la délimitation de zones */}
            <div className={isMobile ? "order-1" : ""}>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <span className="w-2 h-6 bg-agriculture-DEFAULT mr-2 rounded-sm"></span>
                Cartographie terrain
              </h2>
              <MapView className="h-full" />
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Map;
