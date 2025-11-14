import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { auth } from '@/lib/auth';

const app = express();

if (process.env.APP_ENV === 'dev') {
    app.use(morgan('dev'));
}

app.use(
    cors({
        origin: [
            'http://localhost',
            'capacitor://localhost',
            'http://localhost:5173',
            'http://localhost:3333',
            'http://10.0.2.2:3333',
        ], // update in prod
        credentials: true,
    })
);

app.get('/health', (_, res) => {
    res.sendStatus(200);
});

app.use('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.get('/api/me', async (req, res) => {
    res.set('Cache-Control', 'no-store'); // dont cache session data

    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
});

export default app;
