import { Preferences } from '@capacitor/preferences';

export async function saveSession(token: string) {
    await Preferences.set({ key: 'authToken', value: token });
}

export async function getStoredSession() {
    const tokenResult = await Preferences.get({ key: 'authToken' });

    const token = tokenResult.value;

    if (!token) return null;

    return { token };
}

export async function clearSession() {
    await Preferences.remove({ key: 'authToken' });
}
