import { prisma } from '../prisma';

export async function softDeleteMessage(
    messageId: string,
    actorUserId: string
) {
    const msg = await prisma.message.findUnique({ where: { id: messageId } });
    if (!msg) throw new Error('Message not found');

    if (msg.senderId !== actorUserId) throw new Error('Not permitted');

    return prisma.message.update({
        where: { id: messageId },
        data: { deleted: true, deletedAt: new Date() },
    });
}
