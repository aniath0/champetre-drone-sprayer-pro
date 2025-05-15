
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Save, BatteryMedium } from 'lucide-react';

// Import refactored settings components
import GeneralSettings from '@/components/settings/GeneralSettings';
import SpraySettings from '@/components/settings/SpraySettings';
import NetworkSettings from '@/components/settings/NetworkSettings';
import AdvancedSettings from '@/components/settings/AdvancedSettings';
import BatterySettings from '@/components/settings/BatterySettings';

const Settings = () => {
  const { toast } = useToast();
  const [autoReturn, setAutoReturn] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [sprayIntensity, setSprayIntensity] = useState(75);
  const [flySpeed, setFlySpeed] = useState(50);
  const [droneName, setDroneName] = useState("AgriDrone-01");
  const [batteryThreshold, setBatteryThreshold] = useState(20);
  const [emergencyReturn, setEmergencyReturn] = useState(true);
  
  const handleSave = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Les nouvelles configurations ont été appliquées",
      className: "frost-panel",
    });
  };

  const handleEmergencyReturn = () => {
    toast({
      title: "Retour d'urgence activé",
      description: "Le drone revient à sa position de départ",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <NavBar droneStatus={'online'} />
      
      <main className="flex-1 py-8 px-4 animate-fade">
        <div className="container mx-auto">
          <div className="flex items-center mb-8 border-b pb-4 border-primary/20">
            <div className="p-2 rounded-full bg-primary/10 mr-4">
              <SettingsIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
          </div>
          
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-sidebar/30 border border-sidebar-border rounded-full p-1 w-full md:w-auto flex flex-wrap">
              <TabsTrigger value="general" className="rounded-full hover:bg-white/50 transition-colors">Général</TabsTrigger>
              <TabsTrigger value="spray" className="rounded-full hover:bg-white/50 transition-colors">Pulvérisation</TabsTrigger>
              <TabsTrigger value="battery" className="rounded-full hover:bg-white/50 transition-colors">Batterie</TabsTrigger>
              <TabsTrigger value="network" className="rounded-full hover:bg-white/50 transition-colors">Réseau</TabsTrigger>
              <TabsTrigger value="advanced" className="rounded-full hover:bg-white/50 transition-colors">Avancé</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="animate-fade">
              <GeneralSettings
                autoReturn={autoReturn}
                setAutoReturn={setAutoReturn}
                notifications={notifications}
                setNotifications={setNotifications}
                flySpeed={flySpeed}
                setFlySpeed={setFlySpeed}
                droneName={droneName}
                setDroneName={setDroneName}
              />
            </TabsContent>
            
            <TabsContent value="spray" className="animate-fade">
              <SpraySettings 
                sprayIntensity={sprayIntensity}
                setSprayIntensity={setSprayIntensity}
              />
            </TabsContent>
            
            <TabsContent value="battery" className="animate-fade">
              <BatterySettings 
                batteryThreshold={batteryThreshold}
                setBatteryThreshold={setBatteryThreshold}
                emergencyReturn={emergencyReturn}
                setEmergencyReturn={setEmergencyReturn}
                onEmergencyReturn={handleEmergencyReturn}
              />
            </TabsContent>
            
            <TabsContent value="network" className="animate-fade">
              <NetworkSettings />
            </TabsContent>
            
            <TabsContent value="advanced" className="animate-fade">
              <AdvancedSettings />
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end">
            <Button 
              className="px-8 py-6 hover-glow btn-effect flex items-center gap-2 text-base"
              onClick={handleSave}
            >
              <Save className="h-5 w-5" /> 
              Sauvegarder les paramètres
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-muted-foreground border-t bg-white/60 backdrop-blur-sm">
        <div className="container">
          AgriDrone &copy; 2025 - Application de Gestion de Drone Champêtre
        </div>
      </footer>
    </div>
  );
};

export default Settings;
