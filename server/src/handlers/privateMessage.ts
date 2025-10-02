import { CustomSocket, Context } from './types';

export default function privateMessageHandler(context: Context) {
    const { io, prisma, redisClient, onlineUsers } = context;

    return async (socket: CustomSocket, data: any) => {
        const { recipientId, content, chatId } = data;
        const senderId = socket.user?.id;

        const userIds = [senderId, recipientId].sort();
        const cacheKey = `friendship:${userIds[0]}-${userIds[1]}`;

        try {
            const cachedFriendship = redisClient
                ? await redisClient.get(cacheKey)
                : null;

            if (cachedFriendship === 'not_friends') {
                return socket.emit('error_message', {
                    message: 'You are not friends.',
                });
            }

            if (cachedFriendship !== 'is_friends') {
                const areFriends = await prisma.friendship.findFirst({
                    where: {
                        OR: [
                            { userAId: senderId, userBId: recipientId },
                            { userAId: recipientId, userBId: senderId },
                        ],
                    },
                });

                if (!areFriends) {
                    if (redisClient) {
                        await redisClient.set(cacheKey, 'not_friends', {
                            EX: 3600,
                        });
                    }
                    return socket.emit('error_message', {
                        message: 'You can only message friends.',
                    });
                }

                if (redisClient) {
                    await redisClient.set(cacheKey, 'is_friends', { EX: 3600 });
                }
            }

            const savedMessage = await prisma.message.create({
                data: {
                    chatId,
                    senderId,
                    recipientId,
                    content,
                },
            });

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
    };
}
