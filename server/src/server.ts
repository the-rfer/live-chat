import express from 'express';
import cors from 'cors';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '@lib/auth';

const app = express();

app.use(
    cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

// TODO: provavelmente é descnecessário
// app.all('/api/auth/*splat', toNodeHandler(auth));

app.get('/api/me', async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
});

app.get('/', (_, res) => {
    res.send('App is running');
});

app.use(express.json());

export default app;
