
import L from 'leaflet';

// Setup default Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export const setupDefaultLeafletIcon = () => {
  const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  L.Marker.prototype.options.icon = DefaultIcon;
};

// Calculate approximate area of a polygon in square meters using Haversine formula
export const calculatePolygonArea = (positions: L.LatLngExpression[]): number => {
  if (positions.length < 3) return 0;
  
  // Convert positions to LatLng objects if they're arrays
  const latLngs = positions.map(pos => Array.isArray(pos) ? L.latLng(pos[0], pos[1]) : pos);
  
  // Basic implementation of polygon area calculation
  let area = 0;
  const R = 6371000; // Earth radius in meters
  
  for (let i = 0; i < latLngs.length; i++) {
    const j = (i + 1) % latLngs.length;
    const p1 = latLngs[i] as L.LatLng;
    const p2 = latLngs[j] as L.LatLng;
    
    // Convert to radians
    const lat1 = p1.lat * Math.PI / 180;
    const lat2 = p2.lat * Math.PI / 180;
    const lon1 = p1.lng * Math.PI / 180;
    const lon2 = p2.lng * Math.PI / 180;
    
    // Calculate area component
    area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  
  // Finalize calculation
  area = Math.abs(area * R * R / 2);
  return Math.round(area);
};
