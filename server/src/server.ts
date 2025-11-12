import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '@/lib/auth';

const app = express();

app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    })
);

app.get('/health', (_, res) => {
    res.sendStatus(200);
});

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

export default app;
