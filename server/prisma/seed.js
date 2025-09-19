import { PrismaClient } from '@prisma/client';
import { addDays, subDays } from 'date-fns';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Clear DB first (for dev only!)
    await prisma.readReceipt.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.setting.deleteMany();
    await prisma.friendRequest.deleteMany();
    await prisma.friendship.deleteMany();
    await prisma.block.deleteMany();
    await prisma.friendInvite.deleteMany();
    await prisma.user.deleteMany();

    // Create Users
    const passwordHash = await bcrypt.hash('password123', 10);

    const alice = await prisma.user.create({
        data: {
            username: 'alice',
            email: 'alice@example.com',
            passwordHash,
            fullName: 'Alice Johnson',
            status: 'online',
            onboarded: true,
            profilePictureUrl: 'https://i.pravatar.cc/150?u=alice',
            settings: {
                create: {
                    theme: 'dark',
                    language: 'en',
                    chatHistoryRetention: '30d',
                    statusVisibility: 'friends',
                },
            },
        },
    });

    const bob = await prisma.user.create({
        data: {
            username: 'bob',
            email: 'bob@example.com',
            passwordHash,
            fullName: 'Bob Smith',
            status: 'offline',
            onboarded: true,
            profilePictureUrl: 'https://i.pravatar.cc/150?u=bob',
            settings: {
                create: {
                    theme: 'light',
                    language: 'en',
                    chatHistoryRetention: '7d',
                    statusVisibility: 'everyone',
                },
            },
        },
    });

    const charlie = await prisma.user.create({
        data: {
            username: 'charlie',
            email: 'charlie@example.com',
            passwordHash,
            fullName: 'Charlie Doe',
            status: 'offline',
            onboarded: false,
        },
    });

    // Friendships
    await prisma.friendship.create({
        data: { userId: alice.id, friendId: bob.id },
    });
    await prisma.friendship.create({
        data: { userId: bob.id, friendId: alice.id },
    });

    // Friend Request (Charlie → Alice)
    await prisma.friendRequest.create({
        data: {
            senderId: charlie.id,
            receiverId: alice.id,
        },
    });

    // Block (Alice blocked Charlie)
    await prisma.block.create({
        data: {
            blockerId: alice.id,
            blockedId: charlie.id,
        },
    });

    // Conversation between Alice & Bob
    const conversation = await prisma.conversation.create({
        data: {
            userAId: alice.id,
            userBId: bob.id,
        },
    });

    // Messages
    const msg1 = await prisma.message.create({
        data: {
            conversationId: conversation.id,
            senderId: alice.id,
            content: 'Hey Bob, how are you?',
            sentAt: subDays(new Date(), 1),
        },
    });
    const msg2 = await prisma.message.create({
        data: {
            conversationId: conversation.id,
            senderId: bob.id,
            content: "I'm good Alice! Thanks for asking.",
            sentAt: new Date(),
        },
    });

    // Read Receipts
    await prisma.readReceipt.create({
        data: {
            messageId: msg1.id,
            userId: bob.id,
            readAt: new Date(),
        },
    });

    // Notifications
    await prisma.notification.createMany({
        data: [
            {
                userId: alice.id,
                type: 'friend_request',
                content: 'Charlie sent you a friend request.',
            },
            {
                userId: bob.id,
                type: 'message',
                content: 'Alice sent you a new message.',
            },
        ],
    });

    // Friend Invites
    await prisma.friendInvite.createMany({
        data: [
            {
                code: 'INVITE123',
                creatorId: alice.id,
                expiresAt: addDays(new Date(), 7),
            },
            {
                code: 'EXPIRED456',
                creatorId: bob.id,
                expiresAt: subDays(new Date(), 1),
            },
        ],
    });

    console.log('✅ Database has been seeded!');
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
