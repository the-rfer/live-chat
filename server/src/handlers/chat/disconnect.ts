import { CustomSocket, Context } from '@/lib/types';

export default function disconnectHandler(
    context: Context,
    socket: CustomSocket
) {
    const { OnlineUsers } = context;

    return async (reason?: any) => {
        console.log(
            '👋 User disconnected with socket ID:',
            socket?.id ?? 'unknown',
            reason ? `(${String(reason)})` : ''
        );

        if (socket?.user?.id) {
            await OnlineUsers.delete(socket.user.id);
        }
    };
}
