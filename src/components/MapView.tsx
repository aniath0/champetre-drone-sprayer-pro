
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, LassoSelect, MousePointerClick } from 'lucide-react';
import * as fabric from 'fabric';

interface MapViewProps {
  className?: string;
  mode: 'select' | 'draw';
  isSpraying: boolean;
  onAreasSelected: (areas: any[]) => void;
}

const MapView = ({ className, mode, isSpraying, onAreasSelected }: MapViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<fabric.Object[]>([]);
  const [drawingMode, setDrawingMode] = useState<'select' | 'draw'>(mode);
  
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: canvasRef.current.offsetWidth,
        height: 300,
        selection: true,
        backgroundColor: '#f8f9fa'
      });
      
      setCanvas(fabricCanvas);
      
      // Load a field map background (simulated agricultural field)
      fabric.Image.fromURL('/placeholder.svg', (img) => {
        img.scaleToWidth(fabricCanvas.width!);
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
      });
      
      fabricCanvas.on('selection:created', handleSelection);
      fabricCanvas.on('selection:updated', handleSelection);
      
      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [canvasRef]);
  
  // Update drawing mode when prop changes
  useEffect(() => {
    setDrawingMode(mode);
    if (canvas) {
      if (mode === 'draw') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 3;
        canvas.freeDrawingBrush.color = '#3B82F6';
      } else {
        canvas.isDrawingMode = false;
      }
      canvas.renderAll();
    }
  }, [mode, canvas]);
  
  // Handle selection update
  const handleSelection = (e: fabric.IEvent) => {
    if (!canvas) return;
    
    // Store selected objects
    const selected = canvas.getActiveObjects();
    
    // Change selection color to indicate it's selected
    selected.forEach(obj => {
      if (obj.type === 'path') {
        obj.set({
          stroke: '#1E40AF',
          strokeWidth: 4
        });
      } else {
        obj.set({
          borderColor: '#1E40AF',
          cornerColor: '#1E40AF'
        });
      }
    });
    
    setSelectedAreas(selected);
    canvas.renderAll();
    
    // Notify parent of selected areas
    onAreasSelected(selected.map(obj => {
      return {
        id: obj.data?.id || Math.random().toString(36).substring(2, 15),
        type: obj.type,
        area: calculateArea(obj)
      };
    }));
  };
  
  // Calculate approximate area of an object
  const calculateArea = (obj: fabric.Object) => {
    if (!obj.width || !obj.height) return 0;
    return Math.round(obj.width * obj.height / 100);
  };
  
  // Create a rectangular selection
  const addRectangle = () => {
    if (!canvas) return;
    
    const rect = new fabric.Rect({
      left: 50,
      top: 50,
      fill: 'rgba(59, 130, 246, 0.3)',
      width: 100,
      height: 100,
      objectCaching: false,
      stroke: '#3B82F6',
      strokeWidth: 2,
      strokeUniform: true,
      data: { id: Math.random().toString(36).substring(2, 15) }
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };
  
  // Clear all selections
  const clearSelections = () => {
    if (!canvas) return;
    
    canvas.getObjects().forEach(obj => {
      canvas.remove(obj);
    });
    
    setSelectedAreas([]);
    onAreasSelected([]);
    canvas.renderAll();
  };
  
  return (
    <Card className={`${className || ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Zones à pulvériser</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={addRectangle}
            >
              <Map className="h-4 w-4 mr-1" />
              Ajouter zone
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearSelections}
            >
              Effacer tout
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant={drawingMode === 'draw' ? 'default' : 'outline'}
              className="h-8"
            >
              <LassoSelect className="h-4 w-4 mr-1" />
              Délimiter
            </Button>
            
            <Button 
              size="sm" 
              variant={drawingMode === 'select' ? 'default' : 'outline'}
              className="h-8"
            >
              <MousePointerClick className="h-4 w-4 mr-1" />
              Sélectionner
            </Button>
          </div>
          
          {selectedAreas.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedAreas.length} zone(s) sélectionnée(s)
            </div>
          )}
        </div>
        
        <div className="border border-dashed border-gray-300 rounded-md h-[300px] relative">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
          
          {isSpraying && (
            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
              <div className="bg-white/90 p-4 rounded-md shadow-lg">
                <p className="font-semibold text-blue-600">Pulvérisation en cours</p>
                <p className="text-sm text-gray-500">Zones sélectionnées: {selectedAreas.length}</p>
              </div>
            </div>
          )}
        </div>
        
        {selectedAreas.length > 0 && (
          <div className="mt-4 text-sm">
            <span className="font-medium">Surface totale:</span> {selectedAreas.reduce((sum, obj) => sum + calculateArea(obj), 0)} m²
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapView;
