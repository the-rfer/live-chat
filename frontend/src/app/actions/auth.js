'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import prisma from '@/lib/prisma';

export async function login(formData) {
    const supabase = await createClient();

    //TODO: validar inputs
    const creds = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const { data, error } = await supabase.auth.signInWithPassword(creds);

    if (error) {
        console.log('error detected during login: ', error.message);
        redirect('/login?error=' + encodeURIComponent('Credenciais Inválidas'));
    }

    console.log('successfull login detected');

    //TODO: validar status da onboard flag aqui
    //FIXME: erro ao connectar com db causa acesso indevido a app.
    const userRecord = await prisma.user.findUnique({
        where: { id: data.user.id },
        select: { onboarded: true },
    });

    console.log('user record: ', userRecord);

    if (!userRecord.onboarded) {
        redirect('/onboard');
    } else {
        revalidatePath('/', 'layout');
        redirect('/');
    }
}

export async function signup(formData) {
    const supabase = await createClient();

    //TODO: validar inputs
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        redirect('/error'); //TODO: redirect para /login e usar searchparams para apresentar erro
    }

    // TODO: redirect para onboarding

    revalidatePath('/', 'layout');
    redirect('/');
}
