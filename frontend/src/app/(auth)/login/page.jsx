import { LoginForm } from '@/components/login';

export default async function Page({ searchParams }) {
    const { error } = await searchParams;

    return (
        <div className='flex justify-center items-center bg-muted p-6 md:p-10 w-full min-h-svh'>
            <div className='w-full max-w-sm'>
                <LoginForm error={error} />
            </div>
        </div>
    );
}
