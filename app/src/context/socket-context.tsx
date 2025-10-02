'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
    socket: Socket | null;
    joinRoom: (roomId: string) => void;
    leaveRoom: (roomId: string) => void;
};

export const SocketContext = createContext<SocketContextType>({
    socket: null,
    joinRoom: () => {},
    leaveRoom: () => {},
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        // connect when on /chat route
        const s = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
            withCredentials: true,
        });
        setSocket(s);

        s.on('connect', () => {
            console.log('Connected to socket:', s.id);
        });

        s.on('disconnect', () => {
            console.log('Disconnected from socket');
        });

        return () => {
            s.disconnect();
        };
    }, []);

    function joinRoom(roomId: string) {
        if (!socket) return;
        socket.emit('joinRoom', roomId);
    }

    function leaveRoom(roomId: string) {
        if (!socket) return;
        socket.emit('leaveRoom', roomId);
    }

    return (
        <SocketContext.Provider value={{ socket, joinRoom, leaveRoom }}>
            {children}
        </SocketContext.Provider>
    );
};
