
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SprayCan } from 'lucide-react';

interface SpraySettingsProps {
  sprayIntensity: number;
  setSprayIntensity: (value: number) => void;
}

const SpraySettings = ({
  sprayIntensity,
  setSprayIntensity
}: SpraySettingsProps) => {
  return (
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
  );
};

export default SpraySettings;
