
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { RotateCw, Volume2 } from 'lucide-react';

interface GeneralSettingsProps {
  autoReturn: boolean;
  setAutoReturn: (value: boolean) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  flySpeed: number;
  setFlySpeed: (value: number) => void;
  droneName: string;
  setDroneName: (value: string) => void;
}

const GeneralSettings = ({
  autoReturn,
  setAutoReturn,
  notifications,
  setNotifications,
  flySpeed,
  setFlySpeed,
  droneName,
  setDroneName
}: GeneralSettingsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-card/80 backdrop-blur-sm border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <RotateCw className="mr-2 h-5 w-5" />
            Comportement du Drone
          </CardTitle>
          <CardDescription>Configurez le comportement général du drone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-return">Retour automatique si batterie faible</Label>
              <p className="text-sm text-muted-foreground">Le drone reviendra automatiquement au point de départ</p>
            </div>
            <Switch
              id="auto-return"
              checked={autoReturn}
              onCheckedChange={setAutoReturn}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="fly-speed">Vitesse de vol</Label>
              <span className="text-sm text-muted-foreground">{flySpeed}%</span>
            </div>
            <Slider
              id="fly-speed"
              min={10}
              max={100}
              step={5}
              value={[flySpeed]}
              onValueChange={(value) => setFlySpeed(value[0])}
              className="bg-accent"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="drone-name">Nom du Drone</Label>
            <Input 
              id="drone-name" 
              value={droneName} 
              onChange={(e) => setDroneName(e.target.value)}
              className="bg-background"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/80 backdrop-blur-sm border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="mr-2 h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Gérez les alertes et les notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications push</Label>
              <p className="text-sm text-muted-foreground">Recevoir des alertes importantes</p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
