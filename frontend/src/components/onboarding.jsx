'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/router';
import { AvatarUploader } from '@/components/updateAvatar';
import { UpdateNames } from '@/components/updateDisplayName';
import {
    updateFullName,
    updateDisplayName,
    uploadAvatar,
} from '@/app/actions/userProfile';
import { createClient } from '@/lib/supabaseClient';

export function OnboardingForm() {
    const [displayName, setDisplayName] = useState('');
    const [fullName, setFullName] = useState('');
    const [finalImageUrl, setFinalImageUrl] = useState(null);
    const [available, setAvailable] = useState(null);
    const [finalImageFile, setFinalImageFile] = useState(null);
    const supabase = createClient();

    console.log(
        'DEBUG onboarding-form.jsx:\nfullName: ',
        fullName,
        '\ndisplayName: ',
        displayName,
        '\nfinalImageUrl: ',
        finalImageUrl
    );

    async function handleSubmit() {
        if (
            !displayName.trim() ||
            !finalImageUrl ||
            !available ||
            !fullName.trim()
        )
            return console.warn('handlesubmit chamado mas não submeteu dados.');

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            await Promise.all([
                updateDisplayName(user.id, displayName),
                updateFullName(user.id, fullName),
                uploadAvatar(user.id, finalImageFile),
            ]);

            //FIXME: falta alterar flag de onboarded para true

            redirect('/'); //TODO: enviar searchparams para ativar modal de onboarding
        } catch (e) {
            console.warn('algo correu mal: ', e.message);
        }
    }

    return (
        <>
            {/* Main Card */}
            <Card className='shadow-lg border-0'>
                <CardHeader className='text-center'>
                    <CardTitle className='text-lg text-left'>
                        Finaliza o teu perfil
                    </CardTitle>
                    <CardDescription className='text-left'>
                        Adicione um avatar e o nome pelo qual será conhecido
                    </CardDescription>
                </CardHeader>
                <CardContent className='gap-2 space-y-4 my-6'>
                    <AvatarUploader
                        finalImageUrl={finalImageUrl}
                        setFinalImageUrl={setFinalImageUrl}
                        setFinalImageFile={setFinalImageFile}
                    />
                    <UpdateNames
                        displayName={displayName}
                        setDisplayName={setDisplayName}
                        fullName={fullName}
                        setFullName={setFullName}
                        available={available}
                        setAvailable={setAvailable}
                    />
                </CardContent>
                <CardFooter className='text-xs'>
                    Estes dados podem ser alterados a qualquer momento.
                </CardFooter>
            </Card>

            {/* Action Buttons */}
            <div className='flex gap-3 mt-4'>
                <Button
                    className='group flex-1 cursor-pointer'
                    disabled={
                        !available || !finalImageUrl || fullName.length < 3
                    }
                    onClick={handleSubmit}
                >
                    <span className='group-hover:animate-pulse'>Finalizar</span>
                </Button>
            </div>
        </>
    );
}
