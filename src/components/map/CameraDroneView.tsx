
import React from 'react';

const CameraDroneView: React.FC = () => {
  return (
    <div className="bg-black/5 backdrop-blur-sm p-3 border border-sidebar-border rounded-lg min-h-[250px] sm:min-h-[300px] flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <p className="text-sm">Connectez-vous au drone pour activer la vue caméra</p>
      </div>
    </div>
  );
};

export default CameraDroneView;
