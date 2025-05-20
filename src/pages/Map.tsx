
import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/NavBar';
import MapView from '@/components/MapView';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import DroneController from '@/components/DroneController';
import MapHeader from '@/components/map/MapHeader';
import CameraDroneView from '@/components/map/CameraDroneView';
import { getFieldsData } from '@/components/map/FieldData';

const Map = () => {
  const { toast } = useToast();
  const [isConnected] = useState(true);
  const [isSpraying, setIsSpraying] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'select' | 'draw'>('select');
  const [selectedAreas, setSelectedAreas] = useState<any[]>([]);
  const isMobile = useIsMobile();
  
  // Current field mockup - this would normally be from a selection
  const currentField = {
    id: '1',
    name: 'Parcelle Nord',
    size: 5
  };

  const handleSprayStart = () => {
    if (selectedAreas.length === 0) {
      toast({
        title: "Aucune zone sélectionnée",
        description: "Veuillez d'abord sélectionner une zone à pulvériser",
        variant: "destructive"
      });
      return;
    }
    
    setIsSpraying(true);
    toast({
      title: "Pulvérisation démarrée",
      description: `Pulvérisation en cours pour ${selectedAreas.length} zone(s)`,
    });
  };

  const handleSprayStop = () => {
    setIsSpraying(false);
    toast({
      title: "Pulvérisation arrêtée",
      description: "La pulvérisation a été interrompue",
    });
  };

  const handleSprayToggle = () => {
    isSpraying ? handleSprayStop() : handleSprayStart();
  };

  const handleModeChange = (mode: 'select' | 'draw') => {
    setSelectedMode(mode);
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

  const handleAreasSelected = (areas: any[]) => {
    setSelectedAreas(areas);
    toast({
      title: `${areas.length} zone(s) sélectionnée(s)`,
      description: "Prêt pour la pulvérisation"
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
              <MapHeader 
                selectedMode={selectedMode}
                onModeChange={handleModeChange}
                isSpraying={isSpraying}
                onSprayToggle={handleSprayToggle}
                selectedAreasCount={selectedAreas.length}
              />
              <CameraDroneView />
            </div>
            
            {/* Carte de visualisation pour la délimitation de zones */}
            <div className={isMobile ? "order-1" : ""}>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <span className="w-2 h-6 bg-agriculture-DEFAULT mr-2 rounded-sm"></span>
                Cartographie terrain
              </h2>
              <MapView 
                className="h-full" 
                mode={selectedMode} 
                isSpraying={isSpraying}
                onAreasSelected={handleAreasSelected}
              />
              
              {isMobile && (
                <div className="mt-4">
                  <DroneController 
                    onSprayToggle={(isActive) => isActive ? handleSprayStart() : handleSprayStop()}
                    onMove={handleDroneMove}
                    onAltitudeChange={handleAltitudeChange}
                    isConnected={isConnected}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Map;
