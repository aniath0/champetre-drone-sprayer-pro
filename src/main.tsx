
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Initialisation de Capacitor pour les fonctionnalités natives
defineCustomElements(window);

// Empêcher le zoom sur les appareils mobiles
document.addEventListener('touchmove', function (event) {
  if (event.scale !== 1) { event.preventDefault(); }
}, { passive: false });

createRoot(document.getElementById("root")!).render(<App />);
