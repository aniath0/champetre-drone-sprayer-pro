
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/components/Dashboard';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Camera, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  // Dans une application réelle, cet état viendrait d'une API ou d'un contexte
  const droneStatus: 'online' | 'offline' | 'spraying' | 'charging' = 'online';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-sidebar animate-gradient-background">
      <NavBar droneStatus={droneStatus} />
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tableau de Bord</h1>
            <div className="flex space-x-3">
              <Link to="/settings">
                <Button variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
                  <Settings size={18} />
                  Paramètres
                </Button>
              </Link>
              <Link to="/map">
                <Button className="gap-2">
                  <Camera size={18} />
                  Vue Caméra
                </Button>
              </Link>
            </div>
          </div>
          <Dashboard />
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t bg-sidebar/60 backdrop-blur-sm">
        <div className="container">
          AgriDrone &copy; 2025 - Application de Gestion de Drone Champêtre
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Index;
