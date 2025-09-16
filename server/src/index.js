// import app from './server.js';
// import config from './config.js';

// app.listen(config.port, () => {
//     console.log(`Server is running on port ${config.port}`);
// });

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
});

app.use(express.json());
app.use(cookieParser());

// JWT secrets
const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';

// Helpers
function generateTokens(user) {
    const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        ACCESS_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
        expiresIn: '7d',
    });

    return { accessToken, refreshToken };
}

function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false, // ❗ set true in prod (HTTPS)
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15,
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
}

// --- Routes ---

// Register
app.post('/register', async (req, res) => {
    const { email, displayName, password } = req.body;

    const existing = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { displayName }],
        },
    });

    if (existing) {
        if (existing.email === email) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        if (existing.username === username) {
            return res.status(400).json({ error: 'Username already in use' });
        }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { email, username, passwordHash },
    });

    res.json({ message: 'User registered', userId: user.id });
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const { accessToken, refreshToken } = generateTokens(user);
    setAuthCookies(res, accessToken, refreshToken);

    res.json({ message: 'Logged in' });
});

// Logout
app.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
});

// Me (protected)
app.get('/me', async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
        const payload = jwt.verify(token, ACCESS_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });
        res.json({ user: { id: user.id, email: user.email } });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Refresh (when access token expired)
app.post('/refresh', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.status(401).json({ error: 'No refresh token' });

    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        const accessToken = jwt.sign(
            { userId: payload.userId },
            ACCESS_SECRET,
            { expiresIn: '15m' }
        );
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 15,
        });
        res.json({ message: 'Token refreshed' });
    } catch (err) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

// --- Socket.io ---

io.use((socket, next) => {
    try {
        const cookies = cookie.parse(socket.handshake.headers.cookie || '');
        const token = cookies.accessToken;
        if (!token) throw new Error('No token');
        const payload = jwt.verify(token, ACCESS_SECRET);
        socket.user = payload;
        next();
    } catch (err) {
        next(new Error('Unauthorized'));
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.user.email);

    // Join room example
    socket.on('joinRoom', (room) => {
        socket.join(room);
        socket.emit('message', { from: 'system', text: `Joined room ${room}` });
    });

    // Chat message
    socket.on('chatMessage', (msg) => {
        const message = {
            from: socket.user.email,
            text: msg.text,
            ts: Date.now(),
        };
        io.to(msg.room).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.user.email);
    });
});

// --- Start ---
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
