export const config = {
    isProd: import.meta.env.VITE_APP_ENV === 'prod',

    isNative: () => {
        return (
            typeof navigator !== 'undefined' &&
            /android|ios|iphone|ipad|ipod/i.test(navigator.userAgent)
        );
    },

    isAndroidEmulator: () => {
        return (
            typeof navigator !== 'undefined' &&
            /android/i.test(navigator.userAgent) &&
            !window.Capacitor?.isNativePlatform() &&
            location.hostname === 'localhost'
        );
    },

    get apiUrl() {
        if (this.isProd) {
            return 'https://api.myapp.com'; // FIXME: Atualizar para live url da backend
        }

        if (this.isNative() && /android/i.test(navigator.userAgent)) {
            return 'http://10.0.2.2:3333';
        }

        return 'http://localhost:3333';
    },
};
