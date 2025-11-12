import { Server as SocketIOServer, Socket } from 'socket.io';
import { redis } from './redis';

export interface CustomSocket extends Socket {
    user?: {
        id: string;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
}

export type Context = {
    io: SocketIOServer;
    prisma: typeof import('./prisma').prisma;
    redis: typeof redis;
    OnlineUsers: typeof import('./redis').OnlineUsers;
};
