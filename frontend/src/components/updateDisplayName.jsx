'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AtSignIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { isDisplayNameAvailable } from '@/app/actions/userProfile';
import { debounce } from '@/lib/utils';

export function UpdateNames({
    displayName,
    setDisplayName,
    fullName,
    setFullName,
    available,
    setAvailable,
}) {
    const [error, setError] = useState(false);

    const checkAvailability = useMemo(
        () =>
            debounce(async (name) => {
                if (!name.trim() || !/^[a-zA-Z0-9_-]+$/.test(name))
                    return setAvailable(null);

                setAvailable(await isDisplayNameAvailable(name));
            }, 500),
        []
    );

    function handleInputChange(name) {
        setDisplayName(name);

        if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
            setError(true);
            setAvailable(null);
            return;
        } else {
            setError(false);
        }

        checkAvailability(name);
    }

    return (
        <>
            <div className='mx-auto *:not-first:mt-2 w-[250px]'>
                <Label
                    htmlFor='displayName'
                    className='pt-4 font-normal text-muted-foreground text-xs'
                >
                    Handle
                </Label>
                <div className='relative'>
                    <Input
                        id='displayName'
                        className={`peer ps-9 ${
                            available === false || error
                                ? 'ring ring-red-400'
                                : available === true
                                ? 'ring ring-green-400'
                                : ''
                        }`}
                        placeholder='meu_nome'
                        value={displayName}
                        onChange={(e) => handleInputChange(e.target.value)}
                        type='text'
                    />
                    <div className='absolute inset-y-0 flex justify-center items-center peer-disabled:opacity-50 ps-3 text-muted-foreground/80 pointer-events-none start-0'>
                        <AtSignIcon size={16} aria-hidden='true' />
                    </div>
                </div>
                {available === false && (
                    <p className='text-destructive text-xs'>
                        Esta handle já está a ser usada.
                    </p>
                )}
                {error && (
                    <p className='text-destructive text-xs'>
                        Utilize apenas letras, números, hífen ou underscore.
                    </p>
                )}
            </div>
            <div className='mx-auto *:not-first:mt-2 w-[250px]'>
                <Label
                    htmlFor='displayName'
                    className='pt-4 font-normal text-muted-foreground text-xs'
                >
                    Nome Completo
                </Label>
                <div className='relative'>
                    <Input
                        id='displayName'
                        className=''
                        placeholder='Meu Nome'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        type='text'
                    />
                </div>
            </div>
        </>
    );
}
