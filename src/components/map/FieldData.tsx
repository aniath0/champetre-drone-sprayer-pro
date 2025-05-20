
import React from 'react';

interface Field {
  id: string;
  name: string;
  coordinates: [number, number];
  size: number;
  status: 'pending' | 'completed' | 'in-progress';
}

// Mock field data - this would normally come from props or context
const getFieldsData = (): Field[] => [
  { 
    id: '1', 
    name: 'Parcelle Nord', 
    coordinates: [48.8566, 2.3522] as [number, number],
    size: 5, 
    status: 'pending' as const 
  },
  { 
    id: '2', 
    name: 'Parcelle Sud', 
    coordinates: [48.8516, 2.3591] as [number, number],
    size: 3, 
    status: 'completed' as const 
  },
  { 
    id: '3', 
    name: 'Parcelle Est', 
    coordinates: [48.8606, 2.3612] as [number, number],
    size: 4, 
    status: 'pending' as const 
  },
  { 
    id: '4', 
    name: 'Parcelle Ouest', 
    coordinates: [48.8526, 2.3422] as [number, number],
    size: 6, 
    status: 'in-progress' as const 
  },
];

export { getFieldsData };
export type { Field };
