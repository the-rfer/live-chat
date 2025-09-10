import { os } from '@orpc/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from './prisma';
import { can } from './abac';
import { sendMessageNonBlocking } from './services/messagePipeline';
import { updateConversationRetention } from './services/retentionService';
import { deleteConversation } from './services/conversationService';
import {
    RegisterInput,
    registerUser,
    LoginInput,
    loginUser,
} from './services/authService';

export type RPCContext = {
    req: any;
    res: any;
    session: any;
    io?: any;
};

const s = os;

const register = s.procedure
    .input(
        z.object({
            email: z.string().email(),
            username: z.string().min(3).max(30),
            password: z.string().min(8),
        })
    )
    .handler(async ({ input, context }) => {
        const hashed = await bcrypt.hash(input.password, 12);
        const user = await prisma.user
            .create({
                data: {
                    id: undefined,
                    displayName: input.username,
                    fullName: '',
                    messages: [],
                },
            })
            .catch(() => null);

        const created = await prisma.user.create({
            data: {
                displayName: input.username,
            },
        });

        context.session.userId = created.id;
        await context.session.save?.();
        return { id: created.id, displayName: created.displayName };
    });

const login = s.procedure
    .input(
        z.object({
            displayName: z.string().min(3),
            password: z.string(),
        })
    )
    .handler(async ({ input, context }) => {
        const user = await prisma.user.findUnique({
            where: { displayName: input.displayName },
        });
        if (!user) throw new Error('Invalid credentials');
        context.session.userId = user.id;
        await context.session.save?.();
        return { id: user.id, displayName: user.displayName };
    });

const me = s.procedure.handler(async ({ context }) => {
    const uid = context.session.userId;
    if (!uid) return null;
    const user = await prisma.user.findUnique({
        where: { id: uid },
        select: {
            id: true,
            displayName: true,
            fullName: true,
            profilePictureUrl: true,
            onboarded: true,
        },
    });
    return user;
});

const sendMessage = s.procedure
    .input(
        z.object({
            conversationId: z.string().uuid(),
            content: z.string().min(1),
        })
    )
    .handler(async ({ input, context }) => {
        const actorId = context.session.userId;
        if (!actorId) throw new Error('Not authenticated');

        const conv = await prisma.conversation.findUnique({
            where: { id: input.conversationId },
            select: { userAId: true, userBId: true },
        });
        if (!conv) throw new Error('Conversation not found');

        const otherUserId =
            conv.userAId === actorId ? conv.userBId : conv.userAId;
        const blocked = await prisma.friendship.findFirst({
            where: {
                AND: [
                    { userAId: otherUserId, userBId: actorId },
                    { status: 'blocked' },
                ],
            },
        });
        const allowed = can({ id: actorId }, 'send_message', {
            blockedBy: !!blocked,
        });
        if (!allowed) throw new Error('Recipient has blocked you');

        const payload = await sendMessageNonBlocking({
            conversationId: input.conversationId,
            senderId: actorId,
            content: input.content,
        });

        return { ok: true, message: payload };
    });

const setRetention = s.procedure
    .input(
        z.object({
            conversationId: z.string().uuid(),
            retentionDays: z.number().int().min(0).max(365),
        })
    )
    .handler(async ({ input, context }) => {
        const actorId = context.session.userId;
        if (!actorId) throw new Error('Not authenticated');

        const conv = await prisma.conversation.findUnique({
            where: { id: input.conversationId },
        });
        if (!conv) throw new Error('Conversation not found');
        const participants = [conv.userAId, conv.userBId];
        if (!participants.includes(actorId)) throw new Error('Not authorized');

        const res = await updateConversationRetention(
            input.conversationId,
            input.retentionDays
        );
        return { ok: true, deleted: res };
    });

const deleteConv = s.procedure
    .input(z.object({ conversationId: z.string().uuid() }))
    .handler(async ({ input, context }) => {
        const actorId = context.session.userId;
        if (!actorId) throw new Error('Not authenticated');

        const res = await deleteConversation(input.conversationId, actorId);
        return res;
    });

export const router = s.router({
    auth: s.router({ register, login, me }),
    messages: s.router({ send: sendMessage }),
    conversation: s.router({ setRetention, delete: deleteConv }),
});

export type AppRouter = typeof router;
