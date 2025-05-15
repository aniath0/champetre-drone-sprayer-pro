
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Wifi } from 'lucide-react';

const NetworkSettings = () => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-sidebar-border">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wifi className="mr-2 h-5 w-5 text-blue-500" />
          Paramètres de Connexion
        </CardTitle>
        <CardDescription>Configurez les paramètres de connexion du drone</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-md bg-accent/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Drone WiFi</p>
              <p className="text-sm text-muted-foreground">AgriDrone_Network</p>
            </div>
            <div className="bg-green-500/20 text-green-600 px-2 py-1 rounded text-xs font-medium">
              Connecté
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wifi-password">Mot de passe WiFi</Label>
          <Input 
            id="wifi-password" 
            type="password" 
            placeholder="••••••••"
            className="bg-background"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkSettings;
