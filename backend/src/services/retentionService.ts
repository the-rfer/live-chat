import { prisma } from '../prisma';
import { subDays } from 'date-fns';
import { redisClient } from '../session';

export async function updateConversationRetention(
    conversationId: string,
    newRetentionDays: number
) {
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { retentionDays: newRetentionDays },
    });

    const cutoff = subDays(new Date(), newRetentionDays);
    const deleted = await prisma.message.deleteMany({
        where: { conversationId, sentAt: { lt: cutoff } },
    });

    const conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { userAId: true, userBId: true },
    });
    if (conv) {
        const ttl = Math.min(24 * 60 * 60, newRetentionDays * 24 * 60 * 60);
        for (const userId of [conv.userAId, conv.userBId]) {
            const key = `offline:messages:${userId}`;
            const cur = await redisClient.ttl(key);
            if (cur === -1 || cur > ttl) {
                await redisClient.expire(key, ttl);
            }
        }
    }

    return deleted.count;
}
