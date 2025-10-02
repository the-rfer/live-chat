import { CustomSocket, Context } from './types';

export default function disconnectHandler(context: Context) {
    const { onlineUsers } = context;

    // Socket.IO calls the disconnect handler with (reason?: string)
    // We'll return a function that captures the socket via closure when registering.
    return function (this: any, reason?: any) {
        // `this` is the socket instance when using a normal function, but TypeScript cannot
        // statically guarantee that, so we defensively attempt to read socket id.
        const socket = this as CustomSocket | undefined;
        console.log(
            '👋 User disconnected with socket ID:',
            socket?.id ?? 'unknown'
        );
        if (socket?.user?.id) {
            onlineUsers.delete(socket.user.id);
        }
    };
}
