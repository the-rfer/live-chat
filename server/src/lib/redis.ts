import { createClient } from 'redis';

const redis = createClient({
    socket: {
        host: 'localhost',
        port: 6379,
    },
    password: 'redispassword',
});

async function connectRedis() {
    if (!redis.isOpen) {
        await redis.connect();
        console.log('🆙 Redis connected');
    }
}

const OnlineUsers = {
    async set(userId: string, socketId: string) {
        if (!userId) return;
        await redis.hSet('online_users', userId, socketId);
    },

    async get(userId: string) {
        return await redis.hGet('online_users', userId);
    },

    async getAll() {
        return await redis.hGetAll('online_users');
    },

    async delete(userId: string) {
        await redis.hDel('online_users', userId);
    },

    async clear() {
        await redis.del('online_users');
    },
};

export { redis, connectRedis, OnlineUsers };
