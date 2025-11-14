import { createAuthClient } from 'better-auth/react';
import { config } from '@/config';

export const { signIn, signUp, signOut, useSession } = createAuthClient({
    baseURL: config.apiUrl,
});
