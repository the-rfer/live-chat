import { signIn, signOut } from './auth-client';

export async function signInWithEmail(email: string, password: string) {
    try {
        const result = await signIn.email({
            email,
            password,
        });

        if (result?.error) {
            return {
                success: false,
                message: result.error?.message ?? 'Invalid credentials',
            };
        }

        return {
            success: true,
            message: 'Authentication successfull. Redirecting...',
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
