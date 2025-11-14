import { createAuthClient } from 'better-auth/react';
import { passkeyClient } from 'better-auth/client/plugins';
import { config } from '@/config';
import { getStoredSession, saveSession } from './session';

export const { signIn, signUp, signOut, useSession, passkey } =
    createAuthClient({
        baseURL: config.apiUrl,
        plugins: [passkeyClient()],
        fetchOptions: {
            onSuccess: async (ctx) => {
                const authToken = ctx.response.headers.get('set-auth-token');
                if (authToken) {
                    await saveSession(authToken);
                }
            },
            auth: {
                type: 'Bearer',
                token: async () => (await getStoredSession())?.token || '',
            },
        },
    });
