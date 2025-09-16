import { useEffect, useRef } from 'react';

//FIXME: Corrigir utilização devida do hook e retornar o que é necessário
export default function useSocket(onMessage) {
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const typingSentRef = useRef(false);

    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState({});
    const [typingUsers, setTypingUsers] = useState({});
    const [username, setUsername] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('connecting');

    useEffect(() => {
        const u = document.cookie.match(/(^|;)\s*username=([^;]+)/);
        const name = u?.[2];
        setUsername(name);

        const socket = new WebSocket('ws://172.16.96.36:4000');
        socketRef.current = socket;

        socket.onopen = () => {
            setConnectionStatus('connected');
        };

        socket.onclose = () => {
            setConnectionStatus('disconnected');
        };

        socket.onerror = () => {
            setConnectionStatus('error');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'user-list') {
                setUsers(data.users.filter((u) => u !== name));
            } else if (data.from && data.text) {
                setMessages((prev) => {
                    const prevMsgs = prev[data.from] || [];
                    return {
                        ...prev,
                        [data.from]: [
                            ...prevMsgs,
                            `${data.from}: ${data.text}`,
                        ],
                    };
                });
            } else if (data.type === 'typing' && data.from) {
                setTypingUsers((prev) => ({ ...prev, [data.from]: true }));
            } else if (data.type === 'stop-typing' && data.from) {
                setTypingUsers((prev) => {
                    const updated = { ...prev };
                    delete updated[data.from];
                    return updated;
                });
            }
        };

        return () => socket.close();
    }, []);

    const sendMessage = () => {
        if (!selectedUser || !input) return;

        // Clear typing state
        socketRef.current?.send(
            JSON.stringify({ to: selectedUser, type: 'stop-typing' })
        );
        typingSentRef.current = false;
        clearTimeout(typingTimeoutRef.current);

        socketRef.current?.send(
            JSON.stringify({ to: selectedUser, type: 'message', text: input })
        );

        setMessages((prev) => {
            const prevMsgs = prev[selectedUser] || [];
            return {
                ...prev,
                [selectedUser]: [...prevMsgs, `You: ${input}`],
            };
        });

        setInput('');
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);

        if (!selectedUser) return;
        if (!typingSentRef.current) {
            socketRef.current?.send(
                JSON.stringify({ to: selectedUser, type: 'typing' })
            );
            typingSentRef.current = true;
        }

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.send(
                JSON.stringify({ to: selectedUser, type: 'stop-typing' })
            );
            typingSentRef.current = false;
        }, 1500);
    };
}
