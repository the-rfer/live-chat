import { PrismaClient } from '@prisma/client';
import { NODE_ENV } from './config.js';

export const prisma = new PrismaClient({
    log:
        NODE_ENV === 'development'
            ? ['query', 'info', 'warn', 'error']
            : ['error'],
});
