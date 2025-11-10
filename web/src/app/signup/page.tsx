import { GalleryVerticalEnd } from 'lucide-react';

import { SignupForm } from '@/components/signup-form';

export default function SignupPage() {
    return (
        <div className='flex flex-col justify-center items-center gap-6 bg-muted p-6 md:p-10 min-h-svh'>
            <div className='flex flex-col gap-6 w-full max-w-sm'>
                <a
                    href='#'
                    className='flex items-center self-center gap-2 font-medium'
                >
                    <div className='flex justify-center items-center bg-primary rounded-md size-6 text-primary-foreground'>
                        <GalleryVerticalEnd className='size-4' />
                    </div>
                    Acme Inc.
                </a>
                <SignupForm />
            </div>
        </div>
    );
}
