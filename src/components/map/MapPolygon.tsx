
import React from 'react';
import { Polygon } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface MapPolygonProps {
  id: string;
  positions: LatLngExpression[];
  color: string;
  onClick: (id: string, positions: LatLngExpression[]) => void;
}

const MapPolygon: React.FC<MapPolygonProps> = ({ 
  id, 
  positions, 
  color, 
  onClick 
}) => {
  return (
    <Polygon 
      positions={positions}
      pathOptions={{
        color: color,
        weight: 3,
        fillOpacity: 0.3,
        fillColor: color
      }}
      eventHandlers={{
        click: () => onClick(id, positions)
      }}
    />
  );
};

export default MapPolygon;
