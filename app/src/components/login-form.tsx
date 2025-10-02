'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

import { signIn } from '../../server/users';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const formSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(50),
});

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function signInWithGoogle() {
        await authClient.signIn.social({
            provider: 'google',
            callbackURL: 'http://localhost:3000/chat',
        });
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const { success, message } = await signIn(
            values.email,
            values.password
        );

        if (success) {
            toast.success(message as string);
            router.push('/chat');
        } else {
            toast.error(message as string);
        }

        setIsLoading(false);
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle className='text-xl'>Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-8'
                        >
                            <div className='gap-6 grid'>
                                <div className='flex flex-col gap-4'>
                                    <Button
                                        variant='outline'
                                        className='w-full'
                                        type='button'
                                        onClick={signInWithGoogle}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                                                fill='currentColor'
                                            />
                                        </svg>
                                        Login with Google
                                    </Button>
                                </div>
                                <div className='after:top-1/2 after:z-0 after:absolute relative after:inset-0 after:flex after:items-center after:border-t after:border-border text-sm text-center'>
                                    <span className='z-10 relative bg-card px-2 text-muted-foreground'>
                                        Or continue with
                                    </span>
                                </div>
                                <div className='gap-6 grid'>
                                    <div className='gap-3 grid'>
                                        <FormField
                                            control={form.control}
                                            name='email'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='your@email.com'
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='gap-3 grid'>
                                        <FormField
                                            control={form.control}
                                            name='password'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Password
                                                        <a
                                                            href='#'
                                                            className='ml-auto font-normal text-sm hover:underline underline-offset-4'
                                                        >
                                                            Forgot your
                                                            password?
                                                        </a>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='********'
                                                            type='password'
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button
                                        type='submit'
                                        className='w-full'
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className='size-4 animate-spin' />
                                        ) : (
                                            'Login'
                                        )}
                                    </Button>
                                </div>
                                <div className='text-sm text-center'>
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href='/signup'
                                        className='underline underline-offset-4'
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className='text-muted-foreground *:[a]:hover:text-primary text-xs text-center *:[a]:underline *:[a]:underline-offset-4 text-balance'>
                By clicking continue, you agree to our{' '}
                <a href='#'>Terms of Service</a> and{' '}
                <a href='#'>Privacy Policy</a>.
            </div>
        </div>
    );
}
