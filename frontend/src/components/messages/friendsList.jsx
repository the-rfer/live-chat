import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsOpen } from '@/hooks/useIsOpen';
import { useEffect, useState } from 'react';

// temp user images
import m1 from '@/assets/avatars/m1.svg?url';
import m2 from '@/assets/avatars/m2.svg?url';
import m3 from '@/assets/avatars/m3.svg?url';
import g1 from '@/assets/avatars/g1.svg?url';
import g2 from '@/assets/avatars/g2.svg?url';

export function FriendsList() {
    const { isOpen } = useIsOpen();

    const [users, setUsers] = useState([]);

    //TODO: fetch users from db, requer promisse
    // fetch friends & friendsOf

    const fetchUsers = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/friends`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await res.json();
        console.log('fetched users: ', data);
        setUsers(data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    console.log('users: ', users);

    // temp data
    // const users = [
    //     {
    //         name: 'Luís Chaves',
    //         status: true,
    //         avatar: m1,
    //         hasUnread: true,
    //     },
    //     {
    //         name: 'Humberto Sousa',
    //         status: true,
    //         avatar: m2,
    //     },
    //     {
    //         name: 'Barbara Faria',
    //         status: true,
    //         avatar: g2,
    //     },
    //     {
    //         name: 'António Jardim',
    //         status: false,
    //         avatar: m3,
    //         hasUnread: true,
    //     },
    //     {
    //         name: 'Filipa Freitas',
    //         status: false,
    //         avatar: g1,
    //     },
    // ];

    return users.length > 0 ? (
        <>
            <UserList
                users={users.filter((u) => u.status === 'online')}
                isOpen={isOpen}
            />
            <UserList
                users={users.filter((u) => u.status === 'offline')}
                isOpen={isOpen}
            />
        </>
    ) : (
        isOpen && <p className='text-sm text-center'>Não tem contactos.</p>
    );
}

function UserList({ users, isOpen }) {
    return users.map((user, index) => (
        <Tooltip key={index} delayDuration={300}>
            <TooltipTrigger asChild>
                <Button
                    variant='ghost'
                    className={`flex cursor-pointer items-center relative w-full transition-all duration-300 ${
                        isOpen && 'justify-between'
                    }`}
                >
                    <Avatar className='mr-auto border rounded-full w-8 h-8'>
                        <AvatarImage
                            src={user.profilePictureUrl}
                            alt={user.name}
                            className='object-cover'
                        />
                        <AvatarFallback className='rounded-full'>
                            {user.fullName
                                .split(' ')
                                .map((w) => w[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>

                    {isOpen ? (
                        <div className='flex flex-col w-full text-left truncate'>
                            {user.fullName}
                        </div>
                    ) : (
                        <TooltipContent sideOffset={4} side='right'>
                            {user.fullName}
                        </TooltipContent>
                    )}

                    <Badge
                        className={` transition-all duration-300 p-1 rounded-full min-w-1 h-1 
                        ${
                            !isOpen
                                ? 'absolute bottom-0 right-0'
                                : 'absolute top-0'
                        }
                        ${user.status ? 'bg-green-600' : 'bg-gray-600'}
                        `}
                    />

                    {user.hasUnread && (
                        <Badge
                            className={`mr-2 ml-auto transition-all duration-300 p-1 rounded-full min-w-1 h-1 bg-blue-600
                        ${!isOpen && 'absolute top-0 left-0'}
                        `}
                        />
                    )}
                </Button>
            </TooltipTrigger>
        </Tooltip>
    ));
}
