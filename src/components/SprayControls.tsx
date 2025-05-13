import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SprayCan, Upload, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface SprayControlsProps {
  isConnected: boolean;
  currentField?: {
    id: string;
    name: string;
    size: number;
  };
}

const SprayControls = ({ isConnected, currentField }: SprayControlsProps) => {
  const { toast } = useToast();
  const [sprayRate, setSprayRate] = useState([50]);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isSpraying, setIsSpraying] = useState(false);

  const handleStartSpray = () => {
    if (!isConnected) {
      toast({
        title: "Erreur",
        description: "Le drone n'est pas connecté",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Pulvérisation démarrée",
      description: `Pulvérisation en cours pour ${currentField?.name || "la zone sélectionnée"}`,
    });
    
    setIsSpraying(true);
  };
  
  const handleStopSpray = () => {
    toast({
      title: "Pulvérisation arrêtée",
      description: "La pulvérisation a été interrompue",
    });
    
    setIsSpraying(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Contrôles de Pulvérisation</CardTitle>
          <div className="flex h-5 w-5 items-center justify-center">
            <SprayCan className={isSpraying ? "text-spray-DEFAULT animate-pulse-spray" : "text-muted-foreground"} size={18} />
          </div>
        </div>
        <CardDescription>
          {currentField ? `Zone active: ${currentField.name} (${currentField.size} ha)` : "Aucune zone sélectionnée"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="spray-rate">Taux de pulvérisation</Label>
            <span className="text-sm font-medium">{sprayRate[0]}%</span>
          </div>
          <Slider
            id="spray-rate"
            defaultValue={[50]}
            max={100}
            step={5}
            value={sprayRate}
            onValueChange={setSprayRate}
            disabled={!isConnected || !currentField}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="auto-mode">Mode automatique</Label>
          <Switch
            id="auto-mode"
            checked={isAutoMode}
            onCheckedChange={setIsAutoMode}
            disabled={!isConnected || !currentField}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={!isConnected || !currentField}
            onClick={() => {
              toast({ title: "Configuration envoyée au drone" });
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Envoyer config
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={!isConnected}
            onClick={() => {
              toast({ title: "Téléchargement des paramètres" });
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Récupérer données
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          disabled={!isConnected || !currentField || isSpraying}
          onClick={handleStartSpray}
        >
          Démarrer Pulvérisation
        </Button>
        <Button 
          variant="destructive" 
          disabled={!isSpraying}
          onClick={handleStopSpray}
        >
          Arrêter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SprayControls;
