
import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/NavBar';
import MapView from '@/components/MapView';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import DroneController from '@/components/DroneController';
import { Button } from '@/components/ui/button';
import { LassoSelect, SprayCan, MousePointerClick } from 'lucide-react';

const Map = () => {
  const { toast } = useToast();
  const [isConnected] = useState(true);
  const [isSpraying, setIsSpraying] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'select' | 'draw'>('select');
  const [selectedAreas, setSelectedAreas] = useState<any[]>([]);
  const isMobile = useIsMobile();
  
  const currentField = {
    id: '1',
    name: 'Parcelle Nord',
    size: 5
  };

  const handleModeChange = (mode: 'select' | 'draw') => {
    setSelectedMode(mode);
    toast({
      title: mode === 'draw' ? "Mode délimitation activé" : "Mode sélection activé",
      description: mode === 'draw' ? "Dessinez les zones à pulvériser" : "Sélectionnez les zones à pulvériser",
    });
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
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-6 bg-spray-DEFAULT mr-2 rounded-sm"></span>
                  Vue caméra drone en direct
                </h2>
                
                {/* Contrôles de pulvérisation */}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant={selectedMode === 'draw' ? 'default' : 'outline'}
                    onClick={() => handleModeChange('draw')}
                    className="h-8"
                  >
                    <LassoSelect className="h-4 w-4 mr-1" />
                    <span className="hidden xs:inline">Délimiter</span>
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant={selectedMode === 'select' ? 'default' : 'outline'}
                    onClick={() => handleModeChange('select')}
                    className="h-8"
                  >
                    <MousePointerClick className="h-4 w-4 mr-1" />
                    <span className="hidden xs:inline">Sélectionner</span>
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant={isSpraying ? 'destructive' : 'default'}
                    onClick={isSpraying ? handleSprayStop : handleSprayStart}
                    className="h-8"
                    disabled={!selectedAreas.length && !isSpraying}
                  >
                    <SprayCan className="h-4 w-4 mr-1" />
                    <span className="hidden xs:inline">{isSpraying ? 'Arrêter' : 'Pulvériser'}</span>
                  </Button>
                </div>
              </div>
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
