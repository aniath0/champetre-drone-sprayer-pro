
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BatteryMedium } from 'lucide-react';

const AdvancedSettings = () => {
  return (
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
  );
};

export default AdvancedSettings;
