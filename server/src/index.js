//NOTE: All cluttered for testing purposes, refactor later

import crypto from 'node:crypto';
import { createServer } from 'node:http';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const server = createServer(app);

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
await redisClient.connect();
console.log('Connected to Redis');

//TODO: passar mapa de user online para redis
let onlineUsers = new Map();

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

const protectRoute = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        req.user = { id: decoded.userId }; // Attach user to the request
        next();
    } catch (error) {
        res.status(401).json({ error: 'Not authorized, token failed' });
    }
};

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

app.put('/api/profile', protectRoute, async (req, res) => {
    const { fullName, profilePicUrl } = req.body;
    const userId = req.user.id;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { fullName, profilePicUrl },
            select: {
                id: true,
                email: true,
                fullName: true,
                profilePicUrl: true,
            },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// --- Friend Management Routes ---

//FIXME: modificar para aguardar x segundos antes de iniciar pesquisa
const searchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});

app.get('/api/users/search', protectRoute, searchLimiter, async (req, res) => {
    const { query } = req.query;
    if (!query || typeof query !== 'string' || query.length < 2) {
        return res.json([]);
    }

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: { contains: query, mode: 'insensitive' } },
                { username: { contains: query, mode: 'insensitive' } },
            ],
            // Don't return the current user in search results
            NOT: { id: req.user.id },
        },
        select: { id: true, username: true, profilePicUrl: true },
        take: 10,
    });
    res.json(users);
});

// Send a friend request
app.post('/api/friends/requests', protectRoute, async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
        return res.status(400).json({ error: "You can't add yourself." });
    }

    // TODO: Check if already friends or if a block exists
    const newRequest = await prisma.friendRequest.create({
        data: { senderId, receiverId },
    });
    // Optional: emit a real-time notification to the receiver if they are online
    res.status(201).json(newRequest);
});

// Accept a friend request
app.post(
    '/api/friends/requests/:requestId/accept',
    protectRoute,
    async (req, res) => {
        const { requestId } = req.params;
        const currentUserId = req.user.id;

        const request = await prisma.friendRequest.findUnique({
            where: { id: requestId },
        });

        if (!request || request.receiverId !== currentUserId) {
            return res.status(404).json({
                error: 'Request not found or you are not the receiver.',
            });
        }

        // Use a transaction to ensure both actions succeed or fail together
        await prisma.$transaction([
            // 1. Create the friendship
            prisma.friendship.create({
                data: {
                    userAId: request.senderId,
                    userBId: request.receiverId,
                },
            }),
            // 2. Delete the request
            prisma.friendRequest.delete({ where: { id: requestId } }),
        ]);

        res.status(200).json({ message: 'Friend request accepted.' });
    }
);

// Create an invite link
app.post('/api/friends/invites', protectRoute, async (req, res) => {
    const code = crypto.randomBytes(4).toString('hex'); // e.g., 'a4f2c1b8'
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const invite = await prisma.friendInvite.create({
        data: { code, creatorId: req.user.id, expiresAt },
    });
    res.json({ inviteLink: `http://localhost:3000/invite/${invite.code}` });
});

// Block a user
app.post('/api/users/:userId/block', protectRoute, async (req, res) => {
    const { userId: blockedId } = req.params;
    const blockerId = req.user.id;

    await prisma.$transaction(async (tx) => {
        // 1. Create the block record
        await tx.block.create({ data: { blockerId, blockedId } });

        // 2. Remove any existing friendship
        await tx.friendship.deleteMany({
            where: {
                OR: [
                    { userAId: blockerId, userBId: blockedId },
                    { userAId: blockedId, userBId: blockerId },
                ],
            },
        });
    });

    // 3. Invalidate the cache IMMEDIATELY
    const userIds = [blockerId, blockedId].sort();
    const cacheKey = `friendship:${userIds[0]}-${userIds[1]}`;
    await redisClient.del(cacheKey);

    res.status(200).json({ message: 'User blocked and friendship removed.' });
});

// Delete friendship
app.delete('/api/friends/:friendId', protectRoute, async (req, res) => {
    const userId = req.user.id;
    const { friendId } = req.params;

    // 1. Delete the friendship from PostgreSQL
    await prisma.friendship.deleteMany({
        where: {
            OR: [
                { userAId: userId, userBId: friendId },
                { userAId: friendId, userBId: userId },
            ],
        },
    });

    // 2. Invalidate the cache
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

    jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
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

    // mapa de users online
    onlineUsers.set(socket.user.id, socket.id);

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

    socket.on('messages_read', async ({ chatId, readerId }) => {
        try {
            // Update all messages in the chat that were sent to the reader
            const { count } = await prisma.message.updateMany({
                where: {
                    chatId: chatId,
                    recipientId: readerId, // The user who just read the messages
                    status: { not: 'READ' },
                },
                data: {
                    status: 'READ',
                },
            });

            if (count > 0) {
                // Find the other user in the chat to notify them
                const message = await prisma.message.findFirst({
                    where: { chatId },
                    select: { senderId: true, recipientId: true },
                });

                if (message) {
                    const otherUserId =
                        message.senderId === readerId
                            ? message.recipientId
                            : message.senderId;
                    const otherUserSocketId = onlineUsers.get(otherUserId);

                    if (otherUserSocketId) {
                        // Notify the other user that their messages were read
                        io.to(otherUserSocketId).emit('chat_read', { chatId });
                    }
                }
            }
        } catch (error) {
            console.error('Error updating read receipts:', error);
        }
    });

    socket.on('disconnect', () => {
        onlineUsers.delete(socket.user.id);
        console.log(`User disconnected: ${socket.user.id}`);
    });
});

// --- Start ---
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
