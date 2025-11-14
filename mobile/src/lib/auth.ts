import { config } from '@/config';
import { signIn } from './auth-client';
import { type User } from '@/lib/types';

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
