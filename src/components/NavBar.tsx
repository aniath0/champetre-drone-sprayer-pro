
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SprayCan, Map, Settings, Smartphone } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface NavBarProps {
  droneStatus: 'online' | 'offline' | 'spraying' | 'charging';
}

const NavBar = ({ droneStatus }: NavBarProps) => {
  return (
    <header className="sticky top-0 z-10 w-full bg-gradient-to-r from-background to-primary/5 backdrop-blur border-b">
      <div className="container flex h-16 items-center">
        <div className="flex items-center mr-4">
          <div className="bg-agriculture-DEFAULT p-2 rounded-md">
            <SprayCan className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold ml-2 text-lg text-primary">AgriDrone</span>
        </div>
        
        <nav className="flex-1">
          <ul className="flex space-x-4">
            <li>
              <NavLink to="/" exact>
                <Smartphone className="h-4 w-4 mr-2" />
                <span>Tableau de bord</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/map">
                <Map className="h-4 w-4 mr-2" />
                <span>Carte</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings">
                <Settings className="h-4 w-4 mr-2" />
                <span>Paramètres</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div>
          <StatusBadge status={droneStatus} />
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ 
  to, 
  children, 
  exact = false 
}: { 
  to: string;
  children: React.ReactNode;
  exact?: boolean;
}) => {
  const path = window.location.pathname;
  const isActive = exact ? path === to : path.startsWith(to);
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors",
        isActive 
          ? "nav-item active font-medium" 
          : "text-foreground/70 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
};

export default NavBar;
