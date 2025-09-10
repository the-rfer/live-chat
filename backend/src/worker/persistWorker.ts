import { redisClient } from '../session';
import { prisma } from '../prisma';
import { parseISO, addDays } from 'date-fns';

async function processItem(raw: string) {
    const item = JSON.parse(raw);
    const {
        id,
        conversationId,
        senderId,
        content,
        sentAt,
        conversationRetentionDays,
    } = item;
    const sentDate = parseISO(sentAt);
    const expiresAt = addDays(sentDate, conversationRetentionDays);

    try {
        await prisma.message.create({
            data: {
                id,
                conversationId,
                senderId,
                content,
                sentAt: sentDate,
                expiresAt,
            },
        });
        console.log(`[worker] persisted message ${id}`);
    } catch (err: any) {
        console.error('[worker] persist error', err);
        await redisClient.rPush('dead:pending:messages', raw);
    }
}

export async function startPersistWorker() {
    console.log('[worker] starting persist worker');
    while (true) {
        const res = await redisClient.brPop('pending:messages', 5);
        if (!res) continue;
        const [key, raw] = res;
        await processItem(raw);
    }
}

if (require.main === module) {
    startPersistWorker().catch((e) => {
        console.error(e);
        process.exit(1);
    });
}
