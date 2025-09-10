import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'change_me';
export const SESSION_NAME = process.env.SESSION_NAME || 'connect.sid';
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export const DATABASE_URL = process.env.DATABASE_URL || '';
