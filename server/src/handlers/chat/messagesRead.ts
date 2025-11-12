import { CustomSocket, Context } from '@/lib/types';

export default function messagesReadHandler(
    context: Context,
    socket: CustomSocket
) {
    const { io, prisma, OnlineUsers } = context;

    return async (data: any) => {
        const { chatId, readerId: payloadReaderId } = data;
        const readerId = payloadReaderId ?? socket.user?.id;
        if (!chatId || !readerId) {
            return;
        }
        try {
            const { count } = await prisma.message.updateMany({
                where: {
                    chatId: chatId,
                    recipientId: readerId,
                    status: { not: 'READ' },
                },
                data: {
                    status: 'READ',
                },
            });

            if (count > 0) {
                const message = await prisma.message.findFirst({
                    where: { chatId },
                    select: { senderId: true, recipientId: true },
                });

                if (message) {
                    const otherUserId =
                        message.senderId === readerId
                            ? message.recipientId
                            : message.senderId;
                    const otherUserSocketId = await OnlineUsers.get(
                        otherUserId
                    );

                    if (otherUserSocketId) {
                        io.to(otherUserSocketId).emit('chat_read', {
                            chatId,
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error updating read receipts:', error);
        }
    };
}
