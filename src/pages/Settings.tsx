
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wifi, Volume2, RotateCw, BatteryMedium, SprayCan, Map, Settings as SettingsIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  const { toast } = useToast();
  const [autoReturn, setAutoReturn] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [sprayIntensity, setSprayIntensity] = useState(75);
  const [flySpeed, setFlySpeed] = useState(50);
  const [droneName, setDroneName] = useState("AgriDrone-01");
  
  const handleSave = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Les nouvelles configurations ont été appliquées",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-sidebar">
      <NavBar droneStatus={'online'} />
      
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <SettingsIcon className="mr-2 h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Paramètres</h1>
          </div>
          
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="bg-sidebar/50 border border-sidebar-border">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="spray">Pulvérisation</TabsTrigger>
              <TabsTrigger value="network">Réseau</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
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
            </TabsContent>
            
            <TabsContent value="spray">
              <Card className="bg-card/80 backdrop-blur-sm border-sidebar-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <SprayCan className="mr-2 h-5 w-5 text-spray-DEFAULT" />
                    Configuration de Pulvérisation
                  </CardTitle>
                  <CardDescription>Ajustez les paramètres de pulvérisation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="spray-intensity">Intensité de pulvérisation</Label>
                      <span className="text-sm text-muted-foreground">{sprayIntensity}%</span>
                    </div>
                    <Slider
                      id="spray-intensity"
                      min={25}
                      max={100}
                      step={5}
                      value={[sprayIntensity]}
                      onValueChange={(value) => setSprayIntensity(value[0])}
                      className="bg-spray-light/30"
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <Label>Type de produit</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="border-spray-DEFAULT/50">Eco-Protect A</Button>
                      <Button variant="outline" className="border-spray-DEFAULT/50">Bio-Guard</Button>
                      <Button variant="outline" className="border-spray-DEFAULT/50">Eco-Protect B</Button>
                      <Button variant="outline" className="border-spray-DEFAULT/50">Personnalisé</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="network">
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
            </TabsContent>
            
            <TabsContent value="advanced">
              <Card className="bg-card/80 backdrop-blur-sm border-sidebar-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BatteryMedium className="mr-2 h-5 w-5 text-secondary" />
                    Paramètres Avancés
                  </CardTitle>
                  <CardDescription>Configuration avancée (utilisateurs expérimentés)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
                      <p className="text-sm font-medium text-destructive">Zone réservée aux utilisateurs expérimentés</p>
                      <p className="text-xs text-muted-foreground mt-1">La modification de ces paramètres peut affecter les performances du drone</p>
                    </div>
                    
                    <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10">
                      Réinitialiser les paramètres d'usine
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-end">
            <Button 
              className="px-8"
              onClick={handleSave}
            >
              Sauvegarder
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
