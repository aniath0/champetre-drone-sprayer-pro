
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Wifi, Signal, Laptop, Router } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const NetworkSettings = () => {
  return (
    <Card className="frost-panel hover-glow">
      <CardHeader className="pb-4 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Wifi className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle>Paramètres de Connexion</CardTitle>
              <CardDescription>Configurez les paramètres réseau du drone</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-200">
            Connecté
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="bg-accent/50 p-5 rounded-lg border border-accent">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Signal className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">AgriDrone_Network</p>
                <p className="text-sm text-muted-foreground">Réseau actif</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={`w-1 ${i <= 3 ? 'bg-blue-500' : 'bg-gray-300'} rounded-full`} 
                    style={{ height: `${i * 5}px` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="wifi-password" className="text-base">Mot de passe WiFi</Label>
            <Input 
              id="wifi-password" 
              type="password" 
              placeholder="••••••••"
              className="bg-white/80 input-focused"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wifi-channel" className="text-base">Canal WiFi</Label>
            <Input 
              id="wifi-channel" 
              placeholder="Auto (optimal)"
              className="bg-white/80 input-focused"
            />
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <h3 className="section-title flex items-center gap-2 text-blue-500">
          <Laptop className="h-5 w-5" /> 
          Appareils connectés
        </h3>
        
        <div className="space-y-3">
          <div className="p-3 rounded-md bg-white/50 border border-accent/30 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Laptop className="h-4 w-4 text-blue-500" />
              </div>
              <p className="font-medium">Tablette de contrôle</p>
            </div>
            <Badge variant="outline" className="bg-green-500/10 border-green-200">Actif</Badge>
          </div>
          
          <div className="p-3 rounded-md bg-white/50 border border-accent/30 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Router className="h-4 w-4 text-blue-500" />
              </div>
              <p className="font-medium">Station de base</p>
            </div>
            <Badge variant="outline" className="bg-green-500/10 border-green-200">Actif</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkSettings;
