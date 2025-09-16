import { OnboardingForm } from '@/components/onboarding';

export default function Page() {
    return (
        <div className='flex justify-center items-center bg-muted p-6 md:p-10 w-full min-h-svh'>
            <div className='w-full max-w-sm'>
                <OnboardingForm />
            </div>
        </div>
    );
}
