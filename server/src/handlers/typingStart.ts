import { CustomSocket, Context } from './types';

export default function typingStartHandler(context: Context) {
    const { io, onlineUsers } = context;

    return (socket: CustomSocket, data: any) => {
        const { recipientId } = data;
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('typing_start_display', {
                senderId: socket.user?.id,
            });
        }
    };
}
