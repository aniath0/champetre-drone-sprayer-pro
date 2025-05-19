import React, { useState } from 'react';
import DroneStatus from './DroneStatus';
import SprayMap from './SprayMap';
import SprayControls from './SprayControls';
import SprayHistory from './SprayHistory';
import StatCard from './StatCard';
import { SprayCan, Map as MapIcon, Battery } from 'lucide-react';

const Dashboard = () => {
  // État simulé pour la démo
  const [droneConnected] = useState(true);
  const [selectedField, setSelectedField] = useState<{
    id: string;
    name: string;
    size: number;
  } | undefined>(undefined);
  
  // Données simulées avec des coordonnées GPS réelles
  const fields = [
    { id: '1', name: 'Parcelle Nord', coordinates: [48.8566, 2.3522] as [number, number], size: 5, status: 'pending' as const },
    { id: '2', name: 'Parcelle Sud', coordinates: [48.8516, 2.3591] as [number, number], size: 3, status: 'completed' as const },
    { id: '3', name: 'Parcelle Est', coordinates: [48.8606, 2.3612] as [number, number], size: 4, status: 'pending' as const },
    { id: '4', name: 'Parcelle Ouest', coordinates: [48.8526, 2.3422] as [number, number], size: 6, status: 'in-progress' as const },
  ];
  
  const sprayHistory = [
    { id: '1', date: '13/05/2025 10:30', fieldName: 'Parcelle Sud', duration: '45min', coverage: 100, product: 'Eco-Protect A' },
    { id: '2', date: '10/05/2025 14:15', fieldName: 'Parcelle Ouest', duration: '30min', coverage: 65, product: 'Bio-Guard' },
    { id: '3', date: '05/05/2025 09:00', fieldName: 'Parcelle Nord', duration: '1h 15min', coverage: 100, product: 'Eco-Protect B' },
  ];
  
  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard 
          title="Surface Traitée"
          value="18 ha"
          description="Cette semaine"
          icon={<MapIcon className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Insecticide Utilisé"
          value="45 L"
          description="Cette semaine"
          icon={<SprayCan className="h-4 w-4" />}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard 
          title="Autonomie Moyenne"
          value="42 min"
          description="Par charge complète"
          icon={<Battery className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
      </div>
      
      {/* Conteneur principal - improved layout to ensure all components are visible */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche */}
        <div className="lg:col-span-1 space-y-6">
          <DroneStatus 
            batteryLevel={75} 
            signalStrength={92} 
            status="online" 
            lastConnection="13/05/2025 15:45" 
          />
          <SprayControls 
            isConnected={droneConnected}
            currentField={selectedField}
          />
        </div>
        
        {/* Colonne du milieu - Carte */}
        <div className="lg:col-span-1">
          <SprayMap 
            fields={fields}
            onSelectField={(field) => {
              setSelectedField({
                id: field.id,
                name: field.name,
                size: field.size
              });
            }}
            currentDronePosition={[48.8566, 2.3522]}
          />
        </div>
        
        {/* Colonne de droite - Historique de pulvérisation */}
        <div className="lg:col-span-1">
          <SprayHistory records={sprayHistory} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
