
import React from 'react';
import { Button } from '@/components/ui/button';
import { LassoSelect, SprayCan, MousePointerClick } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapHeaderProps {
  selectedMode: 'select' | 'draw';
  onModeChange: (mode: 'select' | 'draw') => void;
  isSpraying: boolean;
  onSprayToggle: () => void;
  selectedAreasCount: number;
}

const MapHeader: React.FC<MapHeaderProps> = ({
  selectedMode,
  onModeChange,
  isSpraying,
  onSprayToggle,
  selectedAreasCount
}) => {
  const { toast } = useToast();

  const handleModeChange = (mode: 'select' | 'draw') => {
    onModeChange(mode);
    toast({
      title: mode === 'draw' ? "Mode délimitation activé" : "Mode sélection activé",
      description: mode === 'draw' ? "Dessinez les zones à pulvériser" : "Sélectionnez les zones à pulvériser",
    });
  };

  return (
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
          onClick={onSprayToggle}
          className="h-8"
          disabled={!selectedAreasCount && !isSpraying}
        >
          <SprayCan className="h-4 w-4 mr-1" />
          <span className="hidden xs:inline">{isSpraying ? 'Arrêter' : 'Pulvériser'}</span>
        </Button>
      </div>
    </div>
  );
};

export default MapHeader;
