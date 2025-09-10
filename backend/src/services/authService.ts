import { prisma } from '../prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const RegisterInput = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(30),
    password: z.string().min(8),
});

export type RegisterInputType = z.infer<typeof RegisterInput>;

export const LoginInput = z.object({
    email: z.string().email(),
    password: z.string(),
});
export type LoginInputType = z.infer<typeof LoginInput>;

export async function registerUser(input: RegisterInputType) {
    const existing = await prisma.user.findUnique({
        where: { displayName: input.username },
    });
    if (existing) {
        throw new Error('Username already taken');
    }
    const hashed = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
        data: {
            displayName: input.username,
            fullName: '',
            profilePictureUrl: null,
            messages: {},
        },
    });
    return user;
}

export async function loginUser(input: LoginInputType) {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
    });
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(input.password, (user as any).password);
    if (!ok) throw new Error('Invalid credentials');
    return user;
}
