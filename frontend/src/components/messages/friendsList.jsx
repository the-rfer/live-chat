import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsOpen } from '@/hooks/useIsOpen';

// temp user images
import m1 from '@/assets/avatars/m1.svg?url';
import m2 from '@/assets/avatars/m2.svg?url';
import m3 from '@/assets/avatars/m3.svg?url';
import g1 from '@/assets/avatars/g1.svg?url';
import g2 from '@/assets/avatars/g2.svg?url';

export function FriendsList() {
    const { isOpen } = useIsOpen();

    //TODO: fetch users from db, requer promisse

    // temp data
    const users = [
        {
            name: 'Luís Chaves',
            status: true,
            avatar: m1,
            hasUnread: true,
        },
        {
            name: 'Humberto Sousa',
            status: true,
            avatar: m2,
        },
        {
            name: 'Barbara Faria',
            status: true,
            avatar: g2,
        },
        {
            name: 'António Jardim',
            status: false,
            avatar: m3,
            hasUnread: true,
        },
        {
            name: 'Filipa Freitas',
            status: false,
            avatar: g1,
        },
    ];

    return (
        <>
            <UserList users={users.filter((u) => u.status)} isOpen={isOpen} />
            <UserList users={users.filter((u) => !u.status)} isOpen={isOpen} />
        </>
    );
}

function UserList({ users, isOpen }) {
    if (users.length === 0)
        return <p className='text-sm text-center'>Não tem contactos.</p>;
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
                            src={user.avatar.src}
                            alt={user.name}
                            className='object-cover'
                        />
                        <AvatarFallback className='rounded-full'>
                            {user.name
                                .split(' ')
                                .map((w) => w[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>

                    {isOpen ? (
                        <div className='w-full text-left truncate'>
                            {user.name}
                        </div>
                    ) : (
                        <TooltipContent sideOffset={4} side='right'>
                            {user.name}
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
