
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon } from 'lucide-react';

// Import refactored settings components
import GeneralSettings from '@/components/settings/GeneralSettings';
import SpraySettings from '@/components/settings/SpraySettings';
import NetworkSettings from '@/components/settings/NetworkSettings';
import AdvancedSettings from '@/components/settings/AdvancedSettings';

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
            
            <TabsContent value="spray">
              <SpraySettings 
                sprayIntensity={sprayIntensity}
                setSprayIntensity={setSprayIntensity}
              />
            </TabsContent>
            
            <TabsContent value="network">
              <NetworkSettings />
            </TabsContent>
            
            <TabsContent value="advanced">
              <AdvancedSettings />
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
