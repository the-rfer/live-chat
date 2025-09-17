// import app from './server.js';
// import config from './config.js';

// app.listen(config.port, () => {
//     console.log(`Server is running on port ${config.port}`);
// });

import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
//TODO: Create redis instance

const prisma = new PrismaClient();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
});

app.use(express.json());
app.use(cookieParser());

// JWT secrets
const JWT_ACCESS_SECRET = process.env.ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';

// Helpers
function generateTokens(user) {
    const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_ACCESS_SECRET,
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
        const payload = jwt.verify(token, JWT_ACCESS_SECRET);
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
            JWT_ACCESS_SECRET,
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

//TODO: Add friend route

// delete friendships
app.delete('/api/friends/:friendId', async (req, res) => {
    const userId = req.user.id;
    const { friendId } = req.params;

    // 1. Delete the friendship from PostgreSQL
    await prisma.friendship.delete({
        //TODO: where clause
    });

    // 2. INVALIDATE THE CACHE
    const userIds = [userId, friendId].sort();
    const cacheKey = `friendship:${userIds[0]}-${userIds[1]}`;
    await redisClient.del(cacheKey);

    res.status(200).send('Friend removed successfully.');
});

// --- Socket.io ---

// middleware runs once when a client tries to connect
io.use((socket, next) => {
    const token = socket.handshake.auth.token; // pass token

    if (!token) {
        return next(new Error('Authentication error: No token provided.'));
    }

    verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error: Invalid token.'));
        }
        // Attach user info to the socket for use in event handlers
        socket.user = { id: decoded.userId };
        next();
    });
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);
    // every event handler from here on knows the user is authenticated

    socket.on('private_message', async (data) => {
        const { recipientId, content, chatId } = data;
        const senderId = socket.user.id;

        // --- Caching Logic Starts Here ---

        // 1. Generate the consistent cache key
        const userIds = [senderId, recipientId].sort();
        const cacheKey = `friendship:${userIds[0]}-${userIds[1]}`;

        try {
            // 2. Check the cache first
            const cachedFriendship = await redisClient.get(cacheKey);

            if (cachedFriendship === 'not_friends') {
                return socket.emit('error_message', {
                    message: 'You are not friends.',
                });
            }

            if (cachedFriendship !== 'is_friends') {
                // 3. CACHE MISS: Data is not in the cache, so query the DB
                const areFriends = await prisma.friendship.findFirst({
                    where: {
                        OR: [
                            { userAId: senderId, userBId: recipientId },
                            { userAId: recipientId, userBId: senderId },
                        ],
                    },
                });

                if (!areFriends) {
                    // 4a. SET CACHE: Store the negative result to prevent future DB hits
                    // Set with an expiry (e.g., 1 hour) to handle edge cases
                    await redisClient.set(cacheKey, 'not_friends', {
                        EX: 3600,
                    });
                    return socket.emit('error_message', {
                        message: 'You can only message friends.',
                    });
                }

                // 4b. SET CACHE: Store the positive result
                await redisClient.set(cacheKey, 'is_friends', { EX: 3600 });
            }

            // --- Caching Logic Ends Here ---
            // If we reach this point, they are friends (either from cache or DB)

            // Proceed with saving and sending the message
            const savedMessage = await prisma.message.create({
                data: {
                    chatId,
                    senderId,
                    recipientId,
                    content,
                },
            });

            // 3. Emit to recipient if online
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('new_message', savedMessage);
            }
        } catch (error) {
            console.error(error);
            socket.emit('error_message', {
                message: 'Failed to send message.',
            });
        }
    });

    socket.on('typing_start', ({ recipientId }) => {
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
            // Just forward the event to the recipient
            io.to(recipientSocketId).emit('typing_start_display', {
                senderId: socket.user.id,
            });
        }
    });

    socket.on('typing_stop', ({ recipientId }) => {
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('typing_stop_display', {
                senderId: socket.user.id,
            });
        }
    });
});

// --- Start ---
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

/* TODO: 
    1. update profile routes
    2. manage convo rooms / status
    3. redis storage
    4. db chat history store 
*/
