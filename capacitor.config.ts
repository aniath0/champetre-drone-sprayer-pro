
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6537e206b2fe48cb907c260ed71087c2',
  appName: 'champetre-drone-sprayer-pro',
  webDir: 'dist',
  server: {
    url: 'https://6537e206-b2fe-48cb-907c-260ed71087c2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#4caf50",
      showSpinner: true,
      spinnerColor: "#ffffff",
    }
  }
};

export default config;
