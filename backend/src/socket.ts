import http from 'http';
import { Server as IOServer } from 'socket.io';
import { sessionMiddleware, redisClient } from './session';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { REDIS_URL } from './config';

let ioInstance: IOServer | null = null;

export function setupSockets(server: http.Server) {
    const io = new IOServer(server, {
        path: '/ws',
        cors: { origin: true, credentials: true },
    });

    io.engine.use((req: any, res: any, next: any) => {
        (sessionMiddleware as any)(req, res, next);
    });

    const pubClient = createClient({ url: REDIS_URL });
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()])
        .then(() => {
            io.adapter(createAdapter(pubClient, subClient));
            console.log('Socket.IO Redis adapter connected');
        })
        .catch((err) => console.error('Socket Redis adapter failed', err));

    io.on('connection', (socket) => {
        const sess = (socket.request as any).session;
        if (!sess || !sess.userId) {
            socket.disconnect(true);
            return;
        }
        const userId = sess.userId as string;
        socket.join(`user:${userId}`);

        socket.on('join:conversation', (conversationId: string) => {
            socket.join(`conv:${conversationId}`);
        });
        socket.on('leave:conversation', (conversationId: string) => {
            socket.leave(`conv:${conversationId}`);
        });

        socket.on('disconnect', () => {
            // update lastSeen
        });
    });

    ioInstance = io;
    return io;
}

export function getIO() {
    if (!ioInstance) throw new Error('IO not initialized');
    return ioInstance;
}
