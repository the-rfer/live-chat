import { redisClient } from '../session';
import { getIO } from '../socket';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../prisma';
import { messageQueue } from '../worker/bullWorker';

const ONE_DAY_SECONDS = 24 * 60 * 60;

export async function sendMessageNonBlocking({
    conversationId,
    senderId,
    content,
}: {
    conversationId: string;
    senderId: string;
    content: string;
}) {
    const conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { retentionDays: true, userAId: true, userBId: true },
    });
    if (!conv) throw new Error('Conversation not found');

    const messageId = uuidv4();
    const sentAt = new Date().toISOString();

    const payload = {
        id: messageId,
        conversationId,
        senderId,
        content,
        sentAt,
        deleted: false,
    };

    try {
        const io = getIO();
        io.to(`conv:${conversationId}`).emit('message:new', payload);
    } catch (err) {
        console.warn('emit failed', err);
    }

    const retentionDays = conv.retentionDays ?? 7;
    const retentionSeconds = retentionDays * 24 * 60 * 60;
    const ttl = Math.min(ONE_DAY_SECONDS, retentionSeconds);
    const recipients = [conv.userAId, conv.userBId].filter(
        (id) => id !== senderId
    );
    const offlineItem = JSON.stringify({ type: 'message', payload });

    await Promise.all(
        recipients.map(async (userId) => {
            const key = `offline:messages:${userId}`;
            await redisClient.rPush(key, offlineItem);
            const curTtl = await redisClient.ttl(key);
            if (curTtl === -1 || curTtl > ttl) {
                await redisClient.expire(key, ttl);
            }
        })
    );

    const pendingItem = JSON.stringify({
        id: messageId,
        conversationId,
        senderId,
        content,
        sentAt,
        conversationRetentionDays: retentionDays,
    });

    await messageQueue.add(
        'persist',
        {
            id: messageId,
            conversationId,
            senderId,
            content,
            sentAt,
            conversationRetentionDays: retentionDays,
        },
        {
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: { age: 60 * 60 * 24 }, // remove job after 24h
            removeOnFail: { age: 60 * 60 * 24 * 7 }, // keep failed jobs 7 days
        }
    );

    await redisClient.rPush('pending:messages', pendingItem);

    return payload;
}
