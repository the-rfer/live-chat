import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as pipeline from '../src/services/messagePipeline';
import * as session from '../src/session';

vi.mock('../src/session', async () => {
    const actual = await vi.importActual('../src/session');
    return {
        ...actual,
        redisClient: {
            rPush: vi.fn().mockResolvedValue(1),
            ttl: vi.fn().mockResolvedValue(-1),
            expire: vi.fn().mockResolvedValue(1),
        },
    };
});
vi.mock('../src/socket', async () => {
    return {
        getIO: () => ({
            to: () => ({ emit: vi.fn() }),
        }),
    };
});
vi.mock('../src/prisma', async () => {
    return {
        prisma: {
            conversation: {
                findUnique: vi.fn().mockResolvedValue({
                    retentionDays: 7,
                    userAId: 'userA',
                    userBId: 'userB',
                }),
            },
        },
    };
});

describe('sendMessageNonBlocking', () => {
    it('emits and enqueues', async () => {
        const payload = await pipeline.sendMessageNonBlocking({
            conversationId: 'conv1',
            senderId: 'userA',
            content: 'hello',
        });
        expect(payload.content).toBe('hello');
        expect(payload.id).toBeDefined();
    });
});
