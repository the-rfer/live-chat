import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import { LoginForm } from '@/components/login';

export default async function Page({ searchParams }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // evitar que users autenticados visitem pagina de login novamente
    if (user) {
        return redirect('/');
    }

    const { error } = await searchParams;

    return (
        <div className='flex justify-center items-center bg-muted p-6 md:p-10 w-full min-h-svh'>
            <div className='w-full max-w-sm'>
                <LoginForm error={error} />
            </div>
        </div>
    );
}
