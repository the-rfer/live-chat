import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from '../src/services/authService';
import bcrypt from 'bcrypt';

vi.mock('../src/prisma', async () => {
    return {
        prisma: {
            user: {
                findUnique: vi.fn(),
                create: vi.fn(),
            },
        },
    };
});

const { prisma } = await vi.importActual('../src/prisma');

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('registerUser creates user', async () => {
        (prisma.user.findUnique as any).mockResolvedValue(null);
        (prisma.user.create as any).mockImplementation(async (args: any) => ({
            id: 'u1',
            displayName: args.data.displayName,
        }));

        const user = await authService.registerUser({
            email: 'a@a.com',
            username: 'testuser',
            password: 'password123',
        });
        expect(user.id).toBe('u1');
        expect(user.displayName).toBe('testuser');
    });

    it('loginUser validates password', async () => {
        const hashed = await bcrypt.hash('password123', 12);
        (prisma.user.findUnique as any).mockResolvedValue({
            id: 'u1',
            email: 'a@a.com',
            password: hashed,
            displayName: 'testuser',
        });
        const user = await authService.loginUser({
            email: 'a@a.com',
            password: 'password123',
        });
        expect(user.id).toBe('u1');
    });

    it('loginUser rejects invalid password', async () => {
        const hashed = await bcrypt.hash('password123', 12);
        (prisma.user.findUnique as any).mockResolvedValue({
            id: 'u1',
            email: 'a@a.com',
            password: hashed,
            displayName: 'testuser',
        });
        await expect(
            authService.loginUser({ email: 'a@a.com', password: 'bad' })
        ).rejects.toThrow();
    });
});
