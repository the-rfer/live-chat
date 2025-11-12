import { Server as HttpServer } from 'node:http';
import { fromNodeHeaders } from 'better-auth/node';
import { Server as SocketIOServer } from 'socket.io';

import { Context, CustomSocket as HandlerSocket } from '@/lib/types';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OnlineUsers, redis } from '@/lib/redis';

import privateMessageHandler from '@/handlers/chat/privateMessage';
import typingStartHandler from '@/handlers/chat/typingStart';
import typingStopHandler from '@/handlers/chat/typingStop';
import messagesReadHandler from '@/handlers/chat/messagesRead';
import disconnectHandler from '@/handlers/chat/disconnect';

export function ChatSocket(server: HttpServer) {
    const io = new SocketIOServer(server, {
        cors: {
            origin: ['http://localhost:3000'],
            credentials: true,
        },
    });

    io.use(async (socket: HandlerSocket, next) => {
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

    io.on('connection', async (socket: HandlerSocket) => {
        console.log('🔌 A user connected with socket ID:', socket.id);

        if (socket.user?.id) {
            try {
                await OnlineUsers.set(socket.user.id, socket.id);
            } catch (error) {
                console.error('Failed to register online user', error);
            }
        }

        const context: Context = {
            io,
            prisma,
            redis,
            OnlineUsers,
        };

        socket.on('private_message', privateMessageHandler(context, socket));
        socket.on('typing_start', typingStartHandler(context, socket));
        socket.on('typing_stop', typingStopHandler(context, socket));
        socket.on('messages_read', messagesReadHandler(context, socket));
        socket.on('disconnect', disconnectHandler(context, socket));
    });

    return io;
}
