import { MessageCircleDashed } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { FriendsList } from '@/components/messages/friendsList';
import { CurrentUser } from '@/components/currentUser';
import { useIsOpen } from '@/hooks/useIsOpen';

export function Sidebar({ connection }) {
    const { isOpen } = useIsOpen();
    return (
        <TooltipProvider delayDuration={500}>
            <div
                className={`h-full bg-background flex flex-col border-r transition-all duration-300 ${
                    isOpen ? 'w-62' : 'w-14'
                }`}
            >
                {/* logo */}
                <div className='flex justify-between items-center p-4'>
                    <div className='flex items-center gap-2'>
                        <MessageCircleDashed height={24} width={24} />
                        {isOpen && (
                            <span className='font-bold text-lg'>Shh.Chat</span>
                        )}
                    </div>
                </div>

                {/* friend list */}
                <nav className='flex-1 space-y-2 px-2 pb-4 scrollbar-thumb-rounded-md overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30'>
                    <div className='flex items-center gap-2 mb-4 font-semibold text-sm'>
                        {isOpen && 'Contactos'}
                        <Separator decorative />
                    </div>
                    <FriendsList />
                </nav>

                {/* user */}
                <div className='mt-auto p-2 border-t'>
                    <CurrentUser connection={connection} />
                </div>
            </div>
        </TooltipProvider>
    );
}
