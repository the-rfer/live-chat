import cron from 'node-cron';
import { prisma } from '../prisma';

export function startCleanupJob() {
    // hourly cleanup
    cron.schedule('0 * * * *', async () => {
        try {
            const res = await prisma.message.deleteMany({
                where: { expiresAt: { lte: new Date() } },
            });
            console.log(`[cleanup] deleted ${res.count} expired messages`);
        } catch (err) {
            console.error('[cleanup] failed', err);
        }
    });
}
