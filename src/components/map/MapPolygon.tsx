
import React, { useCallback } from 'react';
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
  const handleClick = useCallback(() => {
    onClick(id, positions);
  }, [id, onClick, positions]);

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
        click: handleClick
      }}
    />
  );
};

export default MapPolygon;
