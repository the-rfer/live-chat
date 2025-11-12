import { CustomSocket, Context } from '@/lib/types';

export default function privateMessageHandler(
    context: Context,
    socket: CustomSocket
) {
    const { io, prisma, redis, OnlineUsers } = context;

    return async (data: any) => {
        const { recipientId, content, chatId } = data;
        const senderId = socket.user?.id;

        if (!senderId || !recipientId || !chatId || !content) {
            socket.emit('error_message', {
                message: 'Missing message details.',
            });
            return;
        }

        const userIds = [senderId, recipientId].sort();
        const cacheKey = `friendship:${userIds[0]}-${userIds[1]}`;

        try {
            const cachedFriendship = redis ? await redis.get(cacheKey) : null;

            if (cachedFriendship === 'not_friends') {
                socket.emit('error_message', {
                    message: 'You are not friends.',
                });
                return;
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
                    if (redis) {
                        await redis.set(cacheKey, 'not_friends', {
                            EX: 3600,
                        });
                    }
                    socket.emit('error_message', {
                        message: 'You can only message friends.',
                    });
                    return;
                }

                if (redis) {
                    await redis.set(cacheKey, 'is_friends', { EX: 3600 });
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

            const recipientSocketId = await OnlineUsers.get(recipientId);
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
