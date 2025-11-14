import { betterAuth } from 'better-auth';
import { bearer } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';

const isProduction = process.env.NODE_ENV === 'production';
const baseURL = process.env.AUTH_BASE_URL ?? 'http://localhost:3333';
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
    baseURL,
    emailAndPassword: {
        enabled: true,
    },
    socialProviders:
        googleClientId && googleClientSecret
            ? {
                  google: {
                      clientId: googleClientId,
                      clientSecret: googleClientSecret,
                  },
              }
            : undefined,
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    advanced: {
        useSecureCookies: isProduction,
    },
    trustedOrigins: [
        'http://localhost',
        'capacitor://localhost',
        'http://localhost:5173',
        'http://localhost:3333',
        'http://10.0.2.2:3333',
    ],
    plugins: [
        passkey({
            rpID: 'localhost',
            rpName: 'Shh.chat',
            origin: 'http://localhost',
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                residentKey: 'required',
                userVerification: 'required',
            },
        }),
        bearer(),
    ],
});
