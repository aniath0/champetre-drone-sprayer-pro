
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'online' | 'offline' | 'spraying' | 'charging' | 'warning' | 'error';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; label: string }> = {
  online: { color: 'bg-green-500', label: 'En ligne' },
  offline: { color: 'bg-gray-500', label: 'Hors ligne' },
  spraying: { color: 'bg-spray-DEFAULT animate-pulse-spray', label: 'Pulvérisation' },
  charging: { color: 'bg-blue-500', label: 'En charge' },
  warning: { color: 'bg-yellow-500', label: 'Attention' },
  error: { color: 'bg-red-500', label: 'Erreur' }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const { color, label } = statusConfig[status];
  
  return (
    <div className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', color, className)}>
      <span className="flex w-2 h-2 rounded-full mr-1.5 bg-white/80"></span>
      {label}
    </div>
  );
};

export default StatusBadge;
