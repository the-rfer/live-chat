import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({
        log: ['query'], //logs queries
    });
} else {
    // Prevent multiple instances of Prisma Client in development
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            log: ['query'], // logs queries during dev
        });
    }
    prisma = global.prisma;
}

export default prisma;
