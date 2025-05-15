
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings2, BatteryMedium, Trash2, RotateCw, Terminal, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const AdvancedSettings = () => {
  return (
    <Card className="frost-panel hover-glow">
      <CardHeader className="pb-4 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-secondary/10 rounded-full">
            <Settings2 className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <CardTitle>Paramètres Avancés</CardTitle>
            <CardDescription>Configuration avancée (utilisateurs expérimentés)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Alert variant="destructive" className="bg-destructive/5 border border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Zone réservée aux utilisateurs expérimentés</AlertTitle>
          <AlertDescription className="text-sm">
            La modification de ces paramètres peut affecter les performances du drone et annuler la garantie.
          </AlertDescription>
        </Alert>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="section-title flex items-center gap-2 text-secondary">
              <BatteryMedium className="h-5 w-5" /> 
              Calibration
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-md bg-white/50 border border-accent/30">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Dernière calibration</p>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-200 text-blue-600">
                    10 mai 2025
                  </Badge>
                </div>
                <Button variant="outline" className="w-full btn-effect border-secondary/30 flex items-center justify-center gap-2 mt-2">
                  <RotateCw className="h-4 w-4" /> Calibrer les capteurs
                </Button>
              </div>
              
              <div className="p-4 rounded-md bg-white/50 border border-accent/30">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Firmware</p>
                  <Badge variant="outline" className="bg-green-500/10 border-green-200 text-green-600">
                    v2.5.3
                  </Badge>
                </div>
                <Button variant="outline" className="w-full btn-effect border-secondary/30 flex items-center justify-center gap-2 mt-2">
                  <Upload className="h-4 w-4" /> Mettre à jour
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="section-title flex items-center gap-2 text-secondary">
              <Terminal className="h-5 w-5" /> 
              Maintenance
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-md bg-white/50 border border-accent/30">
                <p className="font-medium mb-1">Journaux système</p>
                <p className="text-xs text-muted-foreground mb-2">Exporter les logs pour diagnostic</p>
                <Button variant="outline" className="w-full btn-effect border-secondary/30">
                  Exporter les journaux
                </Button>
              </div>
              
              <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="font-medium text-destructive mb-1">Zone dangereuse</p>
                <p className="text-xs text-muted-foreground mb-2">Ces actions sont irréversibles</p>
                <Button 
                  variant="outline" 
                  className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 btn-effect flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Réinitialiser aux paramètres d'usine
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="p-4 rounded-md bg-accent/50 border border-accent/30">
          <p className="text-sm text-center text-muted-foreground">
            AgriDrone v2.5.3 &middot; Identifiant produit: AGD-X2301 &middot; Heures de vol: 124h
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSettings;
