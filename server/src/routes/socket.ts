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
            return next(new Error('Authentication error: No token provided.'));
        }

        socket.user = session.user;
        next();
    });

    io.on('connection', (socket: CustomSocket) => {
        console.log('🔌 A user connected with socket ID:', socket.id);

        onlineUsers.set(socket.user?.id, socket.id);

        socket.on('private_message', async (data) => {
            const { recipientId, content, chatId } = data;
            const senderId = socket.user?.id;

            // --- Caching Logic Starts Here ---

            // 1. Generate the consistent cache key
            const userIds = [senderId, recipientId].sort();
            const cacheKey = `friendship:${userIds[0]}-${userIds[1]}`;

            try {
                // 2. Check the cache first
                const cachedFriendship = await redisClient.get(cacheKey);

                if (cachedFriendship === 'not_friends') {
                    return socket.emit('error_message', {
                        message: 'You are not friends.',
                    });
                }

                if (cachedFriendship !== 'is_friends') {
                    // 3. CACHE MISS: Data is not in the cache, so query the DB
                    const areFriends = await prisma.friendship.findFirst({
                        where: {
                            OR: [
                                { userAId: senderId, userBId: recipientId },
                                { userAId: recipientId, userBId: senderId },
                            ],
                        },
                    });

                    if (!areFriends) {
                        // 4a. SET CACHE: Store the negative result to prevent future DB hits
                        // Set with an expiry (e.g., 1 hour) to handle edge cases
                        await redisClient.set(cacheKey, 'not_friends', {
                            EX: 3600,
                        });
                        return socket.emit('error_message', {
                            message: 'You can only message friends.',
                        });
                    }

                    // 4b. SET CACHE: Store the positive result
                    await redisClient.set(cacheKey, 'is_friends', { EX: 3600 });
                }

                // --- Caching Logic Ends Here ---
                // If we reach this point, they are friends (either from cache or DB)

                // Proceed with saving and sending the message
                const savedMessage = await prisma.message.create({
                    data: {
                        chatId,
                        senderId,
                        recipientId,
                        content,
                    },
                });

                // 3. Emit to recipient if online
                const recipientSocketId = onlineUsers.get(recipientId);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('new_message', savedMessage);
                }
            } catch (error) {
                console.error(error);
                socket.emit('error_message', {
                    message: 'Failed to send message.',
                });
            }
        });

        socket.on('typing_start', ({ recipientId }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                // Just forward the event to the recipient
                io.to(recipientSocketId).emit('typing_start_display', {
                    senderId: socket.user?.id,
                });
            }
        });

        // considerar alternativa de timeout e debounce on-send
        socket.on('typing_stop', ({ recipientId }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typing_stop_display', {
                    senderId: socket.user?.id,
                });
            }
        });

        socket.on('messages_read', async ({ chatId, readerId }) => {
            try {
                // Update all messages in the chat that were sent to the reader
                const { count } = await prisma.message.updateMany({
                    where: {
                        chatId: chatId,
                        recipientId: readerId, // The user who just read the messages
                        status: { not: 'READ' },
                    },
                    data: {
                        status: 'READ',
                    },
                });

                if (count > 0) {
                    // Find the other user in the chat to notify them
                    const message = await prisma.message.findFirst({
                        where: { chatId },
                        select: { senderId: true, recipientId: true },
                    });

                    if (message) {
                        const otherUserId =
                            message.senderId === readerId
                                ? message.recipientId
                                : message.senderId;
                        const otherUserSocketId = onlineUsers.get(otherUserId);

                        if (otherUserSocketId) {
                            // Notify the other user that their messages were read
                            io.to(otherUserSocketId).emit('chat_read', {
                                chatId,
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error updating read receipts:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('👋 User disconnected with socket ID:', socket.id);
        });
    });

    return io;
}
