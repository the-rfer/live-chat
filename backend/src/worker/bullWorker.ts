import { Queue, Worker, Job, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '../prisma';
import { parseISO, addDays } from 'date-fns';
import { REDIS_URL } from '../config';

const connection = new IORedis(REDIS_URL);

const scheduler = new QueueScheduler('messageQueue', { connection });
await scheduler.waitUntilReady();

export const messageQueue = new Queue('messageQueue', { connection });

export const deadQueue = new Queue('deadQueue', { connection });

const worker = new Worker(
    'messageQueue',
    async (job: Job) => {
        const item = job.data;
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
        return { ok: true };
    },
    {
        connection,
        concurrency: 5,
    }
);

worker.on('failed', async (job: Job | undefined, err: Error) => {
    if (!job) return;
    console.error(
        `[worker] job failed id=${job.id}, attemptsMade=${job.attemptsMade}, failedReason=${err.message}`
    );
    await deadQueue.add('failed:' + String(job.id), job.data, {
        removeOnComplete: 1000 * 60 * 60 * 24,
    });
});

process.on('SIGINT', async () => {
    console.log('Shutting down worker...');
    await worker.close();
    await scheduler.close();
    await messageQueue.close();
    await deadQueue.close();
    connection.disconnect();
    process.exit(0);
});

console.log('BullMQ worker started for messageQueue');
