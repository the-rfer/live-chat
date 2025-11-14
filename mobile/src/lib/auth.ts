import { type User } from '@/lib/types';
import { config } from '@/config';
import { clearSession } from './session';
import { passkey, signIn, signOut } from './auth-client';

export async function signInWithEmail(email: string, password: string) {
    try {
        const result = await signIn.email({
            email,
            password,
        });

        if (result?.error) {
            return {
                success: false,
                message: result.error?.message ?? 'Invalid credentials.',
            };
        }

        return {
            success: true,
            message: 'Authentication successful.',
        };
    } catch (error) {
        console.error('Error during sign-in:', error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Unexpected error. Try again later.',
        };
    }
}

export async function signInWithGoogle() {
    try {
        const result = await signIn.social({
            provider: 'google',
        });

        if (result?.error) {
            return {
                success: false,
                message: result.error?.message ?? 'Invalid credentials.',
            };
        }

        return {
            success: true,
            message: 'Authentication successful.',
        };
    } catch (error) {
        console.error('Error during Google sign-in:', error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Unexpected error. Try again later.',
        };
    }
}

export async function registerPasskey() {
    try {
        const result = await passkey.addPasskey({
            name: 'shh.chat-pkey', // name for this passkey
            authenticatorAttachment: 'platform', // use device authenticator (fingerprint/FaceID)
        });

        if (!result || result.error) {
            console.error('Passkey registration failed', result?.error);
            return;
        }

        const data = result.data;
        console.log('Passkey registered:', data);
    } catch (err) {
        console.error('Unexpected error registering passkey:', err);
    }
}

export async function hasPasskeys() {
    const passkeys = await passkey.listUserPasskeys();

    console.log(
        'Executed hasPasskeys, found: ',
        passkeys.data,
        passkeys.error?.message
    );

    return passkeys.data && passkeys.data.length > 0 ? true : false;
}

export async function getCurrentSession() {
    try {
        const result = await fetch(`${config.apiUrl}/api/me`, {
            credentials: 'include',
        });

        if (!result.ok) {
            return {
                success: false,
                user: null,
            };
        }

        const session = await result.json();

        if (!session || !session.user) {
            return { success: false, user: null };
        }

        return {
            success: true,
            user: session.user as User,
        };
    } catch (error) {
        console.error('Error getting current session:', error);
        return {
            success: false,
            user: null,
        };
    }
}

export async function logout() {
    await clearSession().then(async () => await signOut());
}
