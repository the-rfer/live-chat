'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { login } from '@/app/actions/auth';

// APENAS LOGIN - Sign up fica por invite only por agora.
export function LoginForm({ error }) {
    return (
        <div className='flex flex-col gap-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Introduza o email e password abaixo para se autenticar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={login}>
                        <div className='flex flex-col gap-6'>
                            <div className='gap-3 grid'>
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    name='email'
                                    placeholder='m@example.com'
                                    required
                                />
                            </div>
                            <div className='gap-3 grid'>
                                <div className='flex items-center'>
                                    <Label htmlFor='password'>Password</Label>
                                    <a
                                        href='#'
                                        className='inline-block ml-auto text-sm hover:underline underline-offset-4'
                                    >
                                        Esqueceu a password?
                                    </a>
                                </div>
                                <Input
                                    id='password'
                                    type='password'
                                    name='password'
                                    required
                                />
                            </div>
                            {error && (
                                <p className='text-red-500 text-sm text-center'>
                                    {error}
                                </p>
                            )}
                            <div className='flex flex-col gap-3'>
                                <LoginButton />
                            </div>
                            <p className='text-xs text-justify'>
                                Ainda não tem conta?
                                <br />
                                Novos registos disponíveis apenas por convite de
                                utilizadores existentes.
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button type='submit' className='w-full' disabled={pending}>
            {pending ? 'Logging in...' : 'Log in'}
        </Button>
    );
}
