
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, MapPin, Navigation, Map, Square, MousePointer, MousePointerClick, LassoSelect, SprayCan } from 'lucide-react';
import { fabric } from 'fabric';
import { useIsMobile } from '@/hooks/use-mobile';

interface MapViewProps {
  className?: string;
  mode: 'select' | 'draw';
  isSpraying: boolean;
  onAreasSelected: (areas: Zone[]) => void;
}

interface Zone {
  id: string;
  points: fabric.Point[];
  selected: boolean;
  sprayed: boolean;
}

const MapView = ({ className, mode, isSpraying, onAreasSelected }: MapViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activePolygon, setActivePolygon] = useState<fabric.Polygon | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [coverage, setCoverage] = useState<number>(0);
  const [selectedZones, setSelectedZones] = useState<Zone[]>([]);
  const [sprayedZones, setSprayedZones] = useState<Zone[]>([]);
  const isMobile = useIsMobile();
  
  // Calcul de la hauteur du canvas en fonction de l'appareil
  const canvasHeight = isMobile ? 250 : 300;

  // Initialiser le canvas Fabric
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasWidth = canvasRef.current.parentElement?.offsetWidth || (isMobile ? 320 : 400);
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#F2FCE2'
    });

    // Ajouter une image de carte agricole comme arrière-plan
    fabric.Image.fromURL('https://i.imgur.com/jYPXRLQ.jpg', (img) => {
      img.scaleToWidth(fabricCanvas.width!);
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
        opacity: 0.7
      });
    });

    // Marquer la position du drone avec un point rouge
    const droneMarker = new fabric.Circle({
      left: canvasWidth / 2 - 6,
      top: canvasHeight / 2 - 6,
      radius: 6,
      fill: 'red',
      stroke: 'white',
      strokeWidth: 2,
      selectable: false
    });

    fabricCanvas.add(droneMarker);
    
    // Ajouter une animation de pulsation pour le marqueur du drone
    (function animate() {
      droneMarker.animate('opacity', droneMarker.opacity === 1 ? 0.5 : 1, {
        duration: 1000,
        onChange: fabricCanvas.renderAll.bind(fabricCanvas),
        onComplete: animate
      });
    })();

    setCanvas(fabricCanvas);

    // Adaptation de la taille du canvas en fonction du redimensionnement de la fenêtre
    const handleResize = () => {
      if (!canvasRef.current) return;
      const newWidth = canvasRef.current.parentElement?.offsetWidth || (isMobile ? 320 : 400);
      fabricCanvas.setWidth(newWidth);
      fabricCanvas.setHeight(canvasHeight);
      
      // Redimensionner l'arrière-plan si nécessaire
      if (fabricCanvas.backgroundImage) {
        const bgImg = fabricCanvas.backgroundImage as fabric.Image;
        bgImg.scaleToWidth(newWidth);
        fabricCanvas.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);

    // Nettoyer le canvas quand le composant est démonté
    return () => {
      window.removeEventListener('resize', handleResize);
      fabricCanvas.dispose();
    };
  }, [isMobile, canvasHeight]);

  // Configurer le mode de dessin ou de sélection
  useEffect(() => {
    if (!canvas) return;

    // Réinitialiser les écouteurs d'événements
    canvas.off('mouse:down');
    canvas.off('mouse:dblclick');
    canvas.off('object:selected');
    canvas.off('selection:created');
    
    if (mode === 'draw') {
      // Activer le dessin de polygones
      canvas.selection = false;
      
      // Réinitialiser le polygone actif si on change de mode
      setActivePolygon(null);
      
      let points: fabric.Point[] = [];
      let lines: fabric.Line[] = [];
      let isDrawing = false;
      
      canvas.on('mouse:down', (options) => {
        if (!isDrawing) {
          isDrawing = true;
          const pointer = canvas.getPointer(options.e);
          points = [new fabric.Point(pointer.x, pointer.y)];
        } else {
          const pointer = canvas.getPointer(options.e);
          points.push(new fabric.Point(pointer.x, pointer.y));
          
          // Dessiner une ligne entre les deux derniers points
          if (points.length >= 2) {
            const lastIndex = points.length - 1;
            const line = new fabric.Line(
              [points[lastIndex-1].x, points[lastIndex-1].y, points[lastIndex].x, points[lastIndex].y],
              {
                stroke: '#9b87f5',
                strokeWidth: 2,
                selectable: false,
                evented: false
              }
            );
            canvas.add(line);
            lines.push(line);
          }
          
          // Si on a au moins 3 points, créer un polygone
          if (points.length >= 3) {
            // Supprimer l'ancien polygone s'il existe
            if (activePolygon) {
              canvas.remove(activePolygon);
            }
            
            const polygon = new fabric.Polygon(points, {
              fill: 'rgba(155, 135, 245, 0.3)',
              stroke: '#9b87f5',
              strokeWidth: 2,
              selectable: true
            });
            
            canvas.add(polygon);
            setActivePolygon(polygon);
          }
        }
      });
      
      // Double-clic pour terminer le polygone
      canvas.on('mouse:dblclick', () => {
        if (!isDrawing || points.length < 3) return;
        
        isDrawing = false;
        
        // Nettoyer les lignes temporaires
        lines.forEach(line => canvas.remove(line));
        lines = [];
        
        // Finaliser le polygone
        if (activePolygon) {
          const newZone: Zone = {
            id: `zone-${Date.now()}`,
            points: [...points],
            selected: false,
            sprayed: false
          };
          
          setZones(prev => [...prev, newZone]);
          
          // Calculer la couverture approximative
          const totalArea = canvas.width! * canvas.height!;
          const zoneArea = getPolygonArea(points);
          setCoverage(prev => Math.min(100, prev + (zoneArea / totalArea) * 100));
          
          // Réinitialiser pour le prochain dessin
          points = [];
          setActivePolygon(null);
        }
      });
      
    } else {
      // Mode sélection
      canvas.selection = true;
      
      // Permettre la sélection des polygones
      canvas.on('object:selected', (options) => {
        const selectedObject = options.target;
        if (selectedObject && selectedObject.type === 'polygon') {
          const zoneId = selectedObject.data?.id;
          if (zoneId) {
            setZones(prev => prev.map(z => 
              z.id === zoneId 
                ? { ...z, selected: !z.selected } 
                : z
            ));
            
            // Mettre à jour l'apparence du polygone
            selectedObject.set({
              fill: selectedObject.data?.selected 
                ? 'rgba(155, 135, 245, 0.3)'  // Non sélectionné 
                : 'rgba(229, 222, 255, 0.5)', // Sélectionné
              stroke: selectedObject.data?.selected 
                ? '#9b87f5' 
                : '#7b67d5'
            });
            canvas.renderAll();
            
            // Mettre à jour les zones sélectionnées
            const updatedZones = zones.map(z => 
              z.id === zoneId 
                ? { ...z, selected: !z.selected } 
                : z
            );
            const selected = updatedZones.filter(z => z.selected);
            setSelectedZones(selected);
            onAreasSelected(selected);
          }
        }
      });
    }
    
    return () => {
      if (canvas) {
        canvas.off('mouse:down');
        canvas.off('mouse:dblclick');
        canvas.off('object:selected');
        canvas.off('selection:created');
      }
    };
  }, [mode, canvas, activePolygon, zones, onAreasSelected]);

  // Gérer la pulvérisation des zones sélectionnées
  useEffect(() => {
    if (!canvas) return;
    
    if (isSpraying && selectedZones.length > 0) {
      // Marquer les zones comme pulvérisées
      const updatedZones = zones.map(zone => {
        if (selectedZones.some(selectedZone => selectedZone.id === zone.id)) {
          // Trouver le polygone correspondant dans le canvas
          const objects = canvas.getObjects('polygon');
          const polygonObj = objects.find(obj => obj.data?.id === zone.id);
          
          if (polygonObj) {
            polygonObj.set({
              fill: 'rgba(249, 115, 22, 0.4)',  // Couleur de pulvérisation
              stroke: '#F97316'
            });
            polygonObj.data = { ...polygonObj.data, sprayed: true };
          }
          
          return { ...zone, sprayed: true, selected: false };
        }
        return zone;
      });
      
      setZones(updatedZones);
      setSprayedZones(updatedZones.filter(z => z.sprayed));
      setSelectedZones([]);
      canvas.renderAll();
    }
  }, [isSpraying, selectedZones, zones, canvas]);

  // Fonction utilitaire pour calculer l'aire d'un polygone
  const getPolygonArea = (points: fabric.Point[]): number => {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      let j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
  };
  
  // Effacer toutes les zones
  const clearZones = () => {
    if (!canvas) return;
    
    // Supprimer tous les objets sauf le marqueur du drone
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj.type !== 'circle') { // Ne pas supprimer le marqueur du drone
        canvas.remove(obj);
      }
    });
    
    setZones([]);
    setSelectedZones([]);
    setSprayedZones([]);
    setCoverage(0);
    setActivePolygon(null);
  };

  // Calculer le pourcentage de couverture pulvérisée
  const sprayedCoverage = zones.length === 0 
    ? 0 
    : (sprayedZones.length / zones.length) * coverage;

  return (
    <Card className={`h-full border border-sidebar-border bg-card/80 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <Layers className="mr-2 h-5 w-5 text-[#03A9F4]" />
            Cartographie
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={mode === 'draw' ? "default" : "outline"} 
              className="h-8 text-xs sm:text-sm"
              disabled // Contrôlé par le parent maintenant
            >
              {mode === 'draw' ? (
                <>
                  <LassoSelect className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden xs:inline">Délimiter</span>
                </>
              ) : (
                <>
                  <MousePointerClick className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden xs:inline">Sélectionner</span>
                </>
              )}
            </Button>
            <Badge variant="outline" className="bg-spray-DEFAULT/10 text-xs">En direct</Badge>
          </div>
        </div>
        <CardDescription className="text-xs">
          {mode === 'draw' 
            ? 'Cliquez pour créer des points et double-cliquez pour terminer une zone' 
            : 'Sélectionnez les zones à pulvériser'} 
          • {zones.length > 0 
              ? `${zones.length} zone(s) définie(s)` 
              : 'Aucune zone définie'}
          {selectedZones.length > 0 && ` • ${selectedZones.length} sélectionnée(s)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`map-visualization rounded-md overflow-hidden relative`} style={{ height: `${canvasHeight}px` }}>
          {/* Canvas pour la carte interactive */}
          <div className="absolute inset-0">
            <canvas ref={canvasRef} className="border-none" />
          </div>
          
          {/* Contrôles de la carte */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2">
            <Button size="sm" variant="outline" className="bg-white/90 h-7 w-7 sm:h-8 sm:w-8 p-0">
              <Navigation className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button size="sm" variant="outline" className="bg-white/90 h-7 w-7 sm:h-8 sm:w-8 p-0">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/90 h-7 w-7 sm:h-8 sm:w-8 p-0" 
              onClick={clearZones}
            >
              <Map className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          
          {/* Informations sur la carte */}
          <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm p-2 rounded text-xs shadow-sm">
            <div className="font-medium">Parcelle Nord</div>
            <div className="text-muted-foreground text-[10px] sm:text-xs">48.8566° N, 2.3522° E</div>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
              <span>Couverture: {coverage.toFixed(1)}%</span>
            </div>
            {sprayedZones.length > 0 && (
              <div className="flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-orange-500 mr-1"></span>
                <span>Pulvérisé: {sprayedCoverage.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
