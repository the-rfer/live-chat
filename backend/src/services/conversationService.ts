import { prisma } from '../prisma';
import { getIO } from '../socket';

export async function deleteConversation(
    conversationId: string,
    actorUserId: string
) {
    const conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { userAId: true, userBId: true },
    });
    if (!conv) throw new Error('Conversation not found');

    if (![conv.userAId, conv.userBId].includes(actorUserId))
        throw new Error('Not authorized');

    await prisma.conversation.delete({ where: { id: conversationId } });

    const io = getIO();
    try {
        io.to(`user:${conv.userAId}`).emit('conversation:deleted', {
            conversationId,
        });
        io.to(`user:${conv.userBId}`).emit('conversation:deleted', {
            conversationId,
        });
    } catch (err) {
        console.warn('notify participants failed', err);
    }

    return { ok: true };
}
