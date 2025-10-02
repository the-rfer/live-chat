import { Server as SocketIOServer, Socket } from 'socket.io';

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
    prisma: any; // kept as any to avoid tight coupling; the project already imports prisma elsewhere
    // redisClient left as any to avoid requiring redis types in this refactor
    redisClient?: any;
    onlineUsers: Map<any, any>;
};
