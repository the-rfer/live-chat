import { CustomSocket, Context } from '@/lib/types';

export default function typingStopHandler(context: Context) {
    const { io, onlineUsers } = context;

    return (socket: CustomSocket, data: any) => {
        const { recipientId } = data;
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('typing_stop_display', {
                senderId: socket.user?.id,
            });
        }
    };
}
