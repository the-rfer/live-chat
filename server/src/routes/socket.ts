import { auth } from '@/lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'node:http';

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

export function ChatSocket(server: HttpServer) {
    const io = new SocketIOServer(server, {
        cors: {
            origin: ['http://localhost:3000'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.use(async (socket: CustomSocket, next) => {
        const headers = socket.handshake.headers;

        const session = await auth.api.getSession({
            headers: fromNodeHeaders(headers),
        });

        if (!session) {
            return next(new Error('Authentication error: No token provided.'));
        }

        socket.user = session.user;
        next();
    });

    io.on('connection', (socket) => {
        console.log('🔌 A user connected with socket ID:', socket.id);

        socket.on('disconnect', () => {
            console.log('👋 User disconnected with socket ID:', socket.id);
        });

        // Example: Listen for a 'chat message' event from a client
        socket.on('chat message', (msg) => {
            console.log('Received message:', msg);
            // Broadcast the message to all other clients
            io.emit('chat message', msg);
        });
    });

    return io;
}
