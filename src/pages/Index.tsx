
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/components/Dashboard';
import NavBar from '@/components/NavBar';

const Index = () => {
  // Dans une application réelle, cet état viendrait d'une API ou d'un contexte
  const droneStatus: 'online' | 'offline' | 'spraying' | 'charging' = 'online';

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar droneStatus={droneStatus} />
      <main className="flex-1 py-6">
        <Dashboard />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        <div className="container">
          AgriDrone &copy; 2025 - Application de Gestion de Drone Champêtre
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Index;
