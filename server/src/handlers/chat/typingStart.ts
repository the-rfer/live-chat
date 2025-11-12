import { CustomSocket, Context } from '@/lib/types';

export default function typingStartHandler(
    context: Context,
    socket: CustomSocket
) {
    const { io, OnlineUsers } = context;

    return async (data: any) => {
        const { recipientId } = data ?? {};
        if (!recipientId) {
            return;
        }
        const recipientSocketId = await OnlineUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('typing_start_display', {
                senderId: socket.user?.id,
            });
        }
    };
}
