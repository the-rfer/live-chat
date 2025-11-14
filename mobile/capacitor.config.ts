import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'io.ionic.starter',
    appName: 'Budget App',
    webDir: 'dist',
    plugins: {
        SplashScreen: {
            launchAutoHide: false,
        },
    },
    server: {
        androidScheme: 'http',
        cleartext: true,
    },
};

export default config;
