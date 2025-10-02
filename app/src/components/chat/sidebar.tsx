import { MessageCircleDashed } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useIsOpen } from '@/hooks/is-open';
import { CurrentUser } from '@/components/chat/current-user';
import { FriendsList } from './friends-list';

export function Sidebar() {
    const { isOpen } = useIsOpen();
    return (
        <TooltipProvider delayDuration={500}>
            <div
                className={`h-full  flex flex-col border-r transition-all duration-300 ${
                    isOpen ? 'w-62' : 'w-14'
                }`}
            >
                <div className='flex justify-between items-center p-4'>
                    <div className='flex items-center gap-2'>
                        <MessageCircleDashed height={24} width={24} />
                        {isOpen && (
                            <span className='font-bold text-lg'>Shh.Chat</span>
                        )}
                    </div>
                </div>

                <nav className='flex-1 space-y-2 px-2 pb-4 scrollbar-thumb-rounded-md overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30'>
                    <div className='flex items-center gap-2 mb-4 font-semibold text-sm'>
                        {isOpen && 'Contactos'}
                        <Separator decorative />
                    </div>
                    <FriendsList />
                </nav>

                <div className='mt-auto p-2 border-t'>
                    <CurrentUser />
                </div>
            </div>
        </TooltipProvider>
    );
}
