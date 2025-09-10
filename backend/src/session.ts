import session from 'express-session';
import { createClient } from 'redis';
import { REDIS_URL, SESSION_SECRET, SESSION_NAME, NODE_ENV } from './config';

const connectRedis = require('connect-redis');

const RedisStore = connectRedis(session);
export const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => console.error('Redis error', err));

(async () => {
    await redisClient.connect();
    console.log('Redis connected');
})().catch((e) => {
    console.error('Redis connection error', e);
    process.exit(1);
});

export const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 14,
    },
});
