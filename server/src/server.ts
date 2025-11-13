import express from 'express';
import cors from 'cors';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { auth } from '@/lib/auth';
import { signIn, signUp } from './handlers/auth/users';

const app = express();

app.use(
    cors({
        origin: ['http://localhost:3333', 'http://localhost:5173'], // update in prod
        credentials: true,
    })
);

app.get('/health', (_, res) => {
    res.sendStatus(200);
});

app.use('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.get('/api/me', async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
});

export default app;
