import { io } from 'socket.io-client';
import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie';

// wrap fetch with cookie support
const cookieJar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, cookieJar);

const SERVER_URL = 'http://localhost:3001'; // your backend URL

async function main() {
    // 1️⃣ Login to get cookies
    const loginRes = await fetchWithCookies(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'test1@mail.com',
            password: '123456',
        }),
    });

    const loginData = await loginRes.json();
    console.log('Login response:', loginData);

    // 2️⃣ Connect to Socket.IO with cookies
    const socket = io(SERVER_URL, {
        withCredentials: true,
        extraHeaders: {
            Cookie: cookieJar.getCookieStringSync(SERVER_URL),
        },
    });

    socket.on('connect', () => {
        console.log('Connected to server:', socket.id);

        // 3️⃣ Join a room
        const room = 'room1';
        socket.emit('joinRoom', room);

        // 4️⃣ Send a test chat message
        socket.emit('chatMessage', { room, text: 'Hello from client.js!' });
    });

    // Listen for messages from the server
    socket.on('message', (msg) => {
        console.log('Received message:', msg);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
    });
}

main().catch(console.error);
