'use server';

// Cada bucket é identificado pelo auth.userid, onde o acesso é público, sendo que a url tem validade de 60 minutos (este valor pode ter mudado entretanto)
// Embora o r seja público, w requer /<auth.id>/* === auth.id

import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function updateDisplayName(userId, newName) {
    const supabase = await createClient();

    // Update in Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
        data: { displayName: newName },
    });

    if (authError) console.log('auth err:\n', authError);

    // Update in Prisma User table
    await prisma.user.update({
        where: { id: userId },
        data: { displayName: newName },
    });

    revalidatePath('/');
}

export async function isDisplayNameAvailable(displayName) {
    if (displayName === '') return null;

    try {
        const user = await prisma.user.findUnique({
            where: { displayName },
            select: { id: true },
        });

        return user ? false : true; // false if taken, true if available
    } catch (err) {
        console.error('Error checking display name availability:', err);
        return false; // treat errors as "not available" for safety //FIXME: retornar erro gracefully
    }
}

export async function updateFullName(userId, newName) {
    await prisma.user.update({
        where: { id: userId },
        data: { fullName: newName },
    });

    revalidatePath('/');
}

export async function uploadAvatar(userId, file, avatarId) {
    const supabase = await createClient();

    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${
        avatarId ? avatarId : crypto.randomUUID()
    }.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError; // FIXME: devolver obj com flag erro em vez de dar throw

    // public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    // possível criar signedUrl com metodo .createSignedUrl(filePath, 60) em que 60 é a duração em segundos

    await prisma.user.update({
        where: { id: userId },
        data: { profilePictureUrl: data.publicUrl },
    });

    revalidatePath('/');
}

export async function deleteAvatar(userId) {
    const supabase = createClient();

    const user = await prisma.user.findUnique({ where: { id: userId } }); //TODO: verificar se o return inclui de facto profilePictureUrl
    if (!user?.profilePictureUrl) return;

    const path = user.profilePictureUrl.split('/storage/v1/object/public/')[1];

    console.log('/actions/user-profile.js: #62 || ', path);

    await supabase.storage.from('avatars').remove([path]);
    await prisma.user.update({
        where: { id: userId },
        data: { profilePictureUrl: null },
    });

    revalidatePath('/');
}
