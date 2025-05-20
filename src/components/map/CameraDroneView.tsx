
import React, { useState } from 'react';

interface CameraDroneViewProps {
  isConnected?: boolean;
}

const CameraDroneView: React.FC<CameraDroneViewProps> = ({ isConnected = false }) => {
  return (
    <div className="bg-black/5 backdrop-blur-sm p-3 border border-sidebar-border rounded-lg min-h-[250px] sm:min-h-[300px] flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        {isConnected ? (
          <p className="text-sm">Caméra drone connectée</p>
        ) : (
          <p className="text-sm">Connectez-vous au drone pour activer la vue caméra</p>
        )}
      </div>
    </div>
  );
};

export default CameraDroneView;
