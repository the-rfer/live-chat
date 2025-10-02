import { auth } from '@/lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'node:http';
import privateMessageHandler from './handlers/privateMessage';
import typingStartHandler from './handlers/typingStart';
import typingStopHandler from './handlers/typingStop';
import messagesReadHandler from './handlers/messagesRead';
import disconnectHandler from './handlers/disconnect';
import { Context, CustomSocket as HandlerSocket } from './handlers/types';

interface CustomSocket extends Socket {
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

//TODO: Passar para redis
let onlineUsers = new Map();

export function ChatSocket(server: HttpServer) {
    const io = new SocketIOServer(server, {
        cors: {
            origin: ['http://localhost:3000'],
            credentials: true,
        },
    });

    io.use(async (socket: CustomSocket, next) => {
        const headers = socket.handshake.headers;

        const session = await auth.api.getSession({
            headers: fromNodeHeaders(headers),
        });

        if (!session) {
            return socket.emit('error_message', {
                message: 'User not authenticated.',
            });
        }

        socket.user = session.user;
        next();
    });

    io.on('connection', (socket: HandlerSocket) => {
        console.log('🔌 A user connected with socket ID:', socket.id);

        onlineUsers.set(socket.user?.id, socket.id);

        const context: Context = {
            io,
            prisma:
                (global as any).prisma ||
                (globalThis as any).prisma ||
                undefined,
            redisClient: (global as any).redisClient || undefined,
            onlineUsers,
        };

        socket.on('private_message', privateMessageHandler(context));
        socket.on('typing_start', typingStartHandler(context));
        socket.on('typing_stop', typingStopHandler(context));
        socket.on('messages_read', messagesReadHandler(context));
        socket.on('disconnect', disconnectHandler(context));
    });

    return io;
}
