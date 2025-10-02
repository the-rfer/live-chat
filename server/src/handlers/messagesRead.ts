import { CustomSocket, Context } from '@/lib/types';

export default function messagesReadHandler(context: Context) {
    const { io, prisma, onlineUsers } = context;

    return async (socket: CustomSocket, data: any) => {
        const { chatId, readerId } = data;
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
                    const otherUserSocketId = onlineUsers.get(otherUserId);

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
