
import React from 'react';
import { Battery, Smartphone, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from './StatusBadge';

interface DroneStatusProps {
  batteryLevel: number;
  signalStrength: number;
  status: 'online' | 'offline' | 'spraying' | 'charging';
  lastConnection: string;
}

const DroneStatus = ({ 
  batteryLevel, 
  signalStrength, 
  status, 
  lastConnection 
}: DroneStatusProps) => {
  const getBatteryColor = (level: number) => {
    if (level > 60) return 'bg-green-500';
    if (level > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSignalColor = (strength: number) => {
    if (strength > 70) return 'text-green-500';
    if (strength > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">État du Drone</CardTitle>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4" />
              <span className="text-sm">Batterie</span>
            </div>
            <div className="text-sm font-medium">{batteryLevel}%</div>
          </div>
          <div className="battery-indicator">
            <div 
              className={`battery-level ${getBatteryColor(batteryLevel)}`} 
              style={{ width: `${batteryLevel}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wifi className={getSignalColor(signalStrength)} />
              <span className="text-sm">Signal</span>
            </div>
            <div className="text-sm font-medium">{signalStrength}%</div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm">Dernière connexion</span>
            </div>
            <div className="text-sm font-medium">{lastConnection}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DroneStatus;
