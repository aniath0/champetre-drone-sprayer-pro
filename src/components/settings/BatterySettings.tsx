
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { BatteryMedium, AlertCircle, Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BatterySettingsProps {
  batteryThreshold: number;
  setBatteryThreshold: (value: number) => void;
  emergencyReturn: boolean;
  setEmergencyReturn: (value: boolean) => void;
  onEmergencyReturn: () => void;
}

const BatterySettings = ({
  batteryThreshold,
  setBatteryThreshold,
  emergencyReturn,
  setEmergencyReturn,
  onEmergencyReturn
}: BatterySettingsProps) => {
  // Fonction pour obtenir la couleur en fonction du seuil de batterie
  const getThresholdColor = (threshold: number) => {
    if (threshold <= 10) return "text-red-500";
    if (threshold <= 20) return "text-orange-500";
    return "text-green-500";
  };

  // Fonction pour obtenir la couleur d'arrière-plan de la barre de progression
  const getProgressColor = (threshold: number) => {
    if (threshold <= 10) return "bg-red-500";
    if (threshold <= 20) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-card/80 backdrop-blur-sm border-sidebar-border hover-glow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BatteryMedium className="mr-2 h-5 w-5 text-blue-500" />
            Gestion de la Batterie
          </CardTitle>
          <CardDescription>Paramètres de contrôle de la batterie du drone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="battery-threshold">Seuil de batterie faible</Label>
              <span className={`text-sm font-medium ${getThresholdColor(batteryThreshold)}`}>{batteryThreshold}%</span>
            </div>
            <Slider
              id="battery-threshold"
              min={5}
              max={50}
              step={5}
              value={[batteryThreshold]}
              onValueChange={(value) => setBatteryThreshold(value[0])}
              className="bg-accent"
            />
            <div className="h-2 w-full rounded-full bg-gray-200 mt-2">
              <div 
                className={`h-full rounded-full ${getProgressColor(batteryThreshold)}`}
                style={{ width: `${batteryThreshold}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Le drone sera rappelé automatiquement lorsque sa batterie descendra sous ce seuil
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5">
              <Label htmlFor="emergency-return">Retour automatique</Label>
              <p className="text-sm text-muted-foreground">Rappel le drone lorsque la batterie est faible</p>
            </div>
            <Switch
              id="emergency-return"
              checked={emergencyReturn}
              onCheckedChange={setEmergencyReturn}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-sidebar-border hover-glow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="mr-2 h-5 w-5 text-blue-500" />
            Actions d'urgence
          </CardTitle>
          <CardDescription>Contrôle manuel du retour du drone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              Utilisez cette fonction seulement en cas d'urgence pour rappeler immédiatement le drone à sa position de départ.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={onEmergencyReturn}
            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-6 flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Rappel d'urgence du drone
          </Button>

          <div className="p-4 mt-4 border border-dashed border-muted-foreground/30 rounded-md">
            <h4 className="text-sm font-medium mb-2">Informations importantes</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>Le retour d'urgence interrompt immédiatement toute mission</li>
              <li>Les données de pulvérisation seront sauvegardées</li>
              <li>La position GPS est enregistrée pour une reprise ultérieure</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatterySettings;
