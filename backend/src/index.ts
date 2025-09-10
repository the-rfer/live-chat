import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './config';
import { sessionMiddleware } from './session';
import { setupSockets } from './socket';
import { router as orpcRouter } from './orpcRouter';
import { RPCHandler } from '@orpc/server/fetch';
import { startCleanupJob } from './jobs/cleanup';
import { prisma } from './prisma';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const app = express();
    app.set('trust proxy', 1);

    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(sessionMiddleware);

    app.get('/health', async (req, res) => {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ ok: true });
    });

    const handler = new RPCHandler(orpcRouter, {});
    app.use('/rpc', async (req: any, res: any, next) => {
        try {
            const ctx = { req, res, session: req.session };
            const result = await handler.handle(req, res, {
                prefix: '/rpc',
                context: ctx,
            });
            if (!result.matched) next();
        } catch (err) {
            next(err);
        }
    });

    const staticPath = path.join(__dirname, '..', 'dist');
    app.use(express.static(staticPath, { index: false }));

    app.get('*', (req, res) => {
        if (req.accepts('html')) {
            res.sendFile(path.join(staticPath, 'index.html'));
        } else {
            res.status(404).send('Not found');
        }
    });

    const server = http.createServer(app);
    setupSockets(server);

    server.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });

    startCleanupJob();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
