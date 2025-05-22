
import React, { useEffect, useRef, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PolygonData {
  id: string;
  positions: LatLngExpression[];
  color: string;
}

interface SprayMapProps {
  center: [number, number];
  zoom: number;
  polygons: PolygonData[];
  isSpraying: boolean;
  onPolygonClick: (id: string, positions: LatLngExpression[]) => void;
}

const SprayMap: React.FC<SprayMapProps> = ({ 
  center, 
  zoom, 
  polygons, 
  isSpraying, 
  onPolygonClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const polygonRefs = useRef<Record<string, L.Polygon>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const drawingLayerRef = useRef<L.FeatureGroup | null>(null);
  
  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;
    
    // Set up default marker icon
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    
    L.Marker.prototype.options.icon = DefaultIcon;
    
    // Create map
    leafletMap.current = L.map(mapRef.current).setView(center, zoom);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap.current);
    
    // Initialize the drawing layer
    drawingLayerRef.current = L.featureGroup().addTo(leafletMap.current);
    
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [center, zoom]);
  
  // Update polygons when they change
  useEffect(() => {
    if (!leafletMap.current) return;
    
    // Clear existing polygons
    Object.values(polygonRefs.current).forEach(poly => {
      poly.remove();
    });
    polygonRefs.current = {};
    
    // Add new polygons
    polygons.forEach(polygon => {
      const poly = L.polygon(polygon.positions, {
        color: polygon.color,
        weight: 3,
        fillOpacity: 0.3,
        fillColor: polygon.color
      }).addTo(leafletMap.current!);
      
      poly.on('click', () => {
        onPolygonClick(polygon.id, polygon.positions);
      });
      
      polygonRefs.current[polygon.id] = poly;
    });
  }, [polygons, onPolygonClick]);
  
  // Handle search functionality
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    // Nominatim API search
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data);
        
        if (data.length > 0 && leafletMap.current) {
          const result = data[0];
          leafletMap.current.flyTo([parseFloat(result.lat), parseFloat(result.lon)], 13);
          
          // Add a marker
          L.marker([parseFloat(result.lat), parseFloat(result.lon)])
            .addTo(leafletMap.current)
            .bindPopup(result.display_name)
            .openPopup();
        }
      })
      .catch(error => {
        console.error("Search error:", error);
      });
  };
  
  // Toggle selection mode
  const toggleSelectionMode = () => {
    if (!leafletMap.current || !drawingLayerRef.current) return;
    
    setIsSelectionMode(!isSelectionMode);
    
    if (!isSelectionMode) {
      // Enable drawing mode
      let points: L.LatLngExpression[] = [];
      let tempPolyline: L.Polyline | null = null;
      let polygon: L.Polygon | null = null;
      
      const clickHandler = (e: L.LeafletMouseEvent) => {
        points.push(e.latlng);
        
        // Remove previous temporary line
        if (tempPolyline !== null) {
          tempPolyline.remove();
        }
        
        // Draw new line
        if (points.length > 1) {
          tempPolyline = L.polyline([...points], {
            color: 'blue',
            weight: 2,
            dashArray: '5, 10'
          }).addTo(drawingLayerRef.current!);
        }
        
        // Add marker for the point
        L.circleMarker(e.latlng, {
          radius: 5,
          color: 'blue',
          fill: true,
          fillColor: 'white',
          fillOpacity: 1
        }).addTo(drawingLayerRef.current!);
        
        // If we have at least 3 points, we can create a polygon
        if (points.length >= 3) {
          // Remove previous polygon if exists
          if (polygon !== null) {
            polygon.remove();
          }
          
          // Create new polygon
          polygon = L.polygon(points, {
            color: 'blue',
            weight: 2,
            fillOpacity: 0.3
          }).addTo(drawingLayerRef.current!);
        }
      };
      
      const dblClickHandler = () => {
        if (points.length >= 3 && polygon) {
          // Complete the polygon
          const id = Math.random().toString(36).substring(2, 15);
          onPolygonClick(id, points);
          
          // Reset for next drawing
          points = [];
          if (tempPolyline) tempPolyline.remove();
          polygon.remove();
          tempPolyline = null;
          polygon = null;
          
          // Clear drawing layer
          drawingLayerRef.current?.clearLayers();
        }
      };
      
      leafletMap.current.on('click', clickHandler);
      leafletMap.current.on('dblclick', dblClickHandler);
      
      // Store the event handlers so we can remove them later
      leafletMap.current.selectionHandlers = {
        click: clickHandler,
        dblclick: dblClickHandler
      };
    } else {
      // Disable drawing mode
      if (leafletMap.current.selectionHandlers) {
        leafletMap.current.off('click', leafletMap.current.selectionHandlers.click);
        leafletMap.current.off('dblclick', leafletMap.current.selectionHandlers.dblclick);
        leafletMap.current.selectionHandlers = null;
      }
      
      // Clear drawing layer
      drawingLayerRef.current.clearLayers();
    }
  };
  
  return (
    <div className="border border-dashed border-gray-300 rounded-md h-[300px] relative">
      <div className="absolute top-2 left-2 right-2 z-10 bg-white/90 rounded-md shadow-md p-2 flex gap-2">
        <Input
          type="text"
          placeholder="Rechercher une ville, région..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4" />
        </Button>
        <Button 
          onClick={toggleSelectionMode} 
          size="sm"
          variant={isSelectionMode ? "secondary" : "outline"}
        >
          <MapPin className="h-4 w-4 mr-1" />
          Sélectionner zone
        </Button>
      </div>
      
      <div ref={mapRef} className="h-full w-full" />
      
      {searchResults.length > 0 && (
        <div className="absolute bottom-2 left-2 right-2 z-10 bg-white/90 rounded-md shadow-md max-h-24 overflow-y-auto">
          <div className="p-2">
            <h4 className="text-sm font-medium">Résultats</h4>
            <ul className="text-xs">
              {searchResults.slice(0, 3).map((result, index) => (
                <li key={index} className="py-1 cursor-pointer hover:bg-gray-100" onClick={() => {
                  if (leafletMap.current) {
                    leafletMap.current.flyTo([parseFloat(result.lat), parseFloat(result.lon)], 13);
                  }
                }}>
                  {result.display_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {isSelectionMode && (
        <div className="absolute bottom-2 right-2 z-10 bg-white/90 rounded-md shadow-md p-2">
          <p className="text-xs font-medium">Mode sélection actif</p>
          <p className="text-xs text-gray-500">Cliquez pour ajouter des points, double-cliquez pour terminer</p>
        </div>
      )}
      
      {isSpraying && (
        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
          <div className="bg-white/90 p-4 rounded-md shadow-lg">
            <p className="font-semibold text-blue-600">Pulvérisation en cours</p>
            <p className="text-sm text-gray-500">Zones sélectionnées: {polygons.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Add TypeScript augmentation for custom properties
declare global {
  namespace L {
    interface Map {
      selectionHandlers: {
        click: (e: L.LeafletMouseEvent) => void;
        dblclick: (e: L.LeafletMouseEvent) => void;
      } | null;
    }
  }
}

export default SprayMap;
