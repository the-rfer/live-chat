import { redirect, RedirectType } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    LogOut,
    UserCog,
    SunMoon,
    BellOff,
    UserPlus,
    Loader,
    Satellite,
    RotateCcw,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { useIsOpen } from '@/hooks/useIsOpen';

export function CurrentUser({ connection }) {
    const { isOpen } = useIsOpen();

    async function signOut() {
        const error = false; // TODO: implementar sign out
        if (!error) {
            redirect('/login', RedirectType.replace);
        }
    }

    // temp user
    const user = {
        name: 'Rúben Fernandes',
        email: 'ruben@alfa-digital.dev',
        avatar: 'https://ui.shadcn.com/avatars/shadcn.jpg',
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className={`flex items-center relative w-full transition-all duration-300 ${
                        isOpen && 'justify-between'
                    }`}
                >
                    <Avatar className='mr-auto rounded-full w-8 h-8'>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className='rounded-full'>
                            {user.name
                                .split(' ')
                                .map((w) => w[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                    {isOpen && <div className='truncate'>{user.name}</div>}
                    <Badge
                        className={`mr-2 ml-auto transition-all duration-300 p-1 rounded-full min-w-1 h-1 ${
                            connection === 'connected'
                                ? 'bg-green-600'
                                : connection === 'connecting'
                                ? 'bg-gray-600'
                                : 'bg-red-600'
                        }
                        ${!isOpen && 'absolute top-0 left-0'}
                        `}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='top'
                align='start'
                sideOffset={8}
            >
                <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-sm text-left'>
                        <Avatar className='mr-auto border rounded-lg w-8 h-8'>
                            <AvatarImage
                                src={user.avatar}
                                alt={user.name}
                                className='object-cover'
                            />
                            <AvatarFallback className='rounded-lg'>
                                {user.name
                                    .split(' ')
                                    .map((w) => w[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 grid text-sm text-left leading-tight'>
                            <span className='font-medium truncate'>
                                {user.name}
                            </span>
                            <span className='text-xs truncate'>
                                {user.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Ligação</DropdownMenuLabel>
                <DropdownMenuItem
                    className={
                        connection === 'connected' ||
                        connection === 'connecting'
                            ? ''
                            : 'cursor-pointer'
                    }
                >
                    <Satellite />
                    <span
                        className={`font-semibold ${
                            connection === 'connected'
                                ? 'text-green-600'
                                : connection === 'connecting'
                                ? 'text-gray-600'
                                : 'text-red-600'
                        }`}
                    >
                        {connection}
                    </span>
                    {!(
                        connection === 'connected' ||
                        connection === 'connecting'
                    ) && <RotateCcw className='ml-auto' />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Definições</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <UserCog />
                        Preferências
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <SunMoon />
                        Alterar tema
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <UserPlus />
                        Adicionar utilizador
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Loader />
                        Pedidos pendentes
                        <Badge className='bg-blue-600 ml-auto px-1 rounded-full h-3 aspect-square' />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <BellOff />
                        Eliminar notificações
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-variant='destructive' onClick={signOut}>
                    <LogOut />
                    Terminar sessão
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
