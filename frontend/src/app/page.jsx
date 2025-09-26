import { ChatScreen } from '@/components/messages/chatScreen';
import { IsOpenProvider } from '@/hooks/useIsOpen';
import { redirect, RedirectType } from 'next/navigation';

export default async function Home() {
    //TODO: validar que existe um user antes de retornar app.
    // if !user redirect login, else return app

    return (
        <main className='flex flex-col justify-center items-center bg-gray-200 w-screen h-screen'>
            <IsOpenProvider>
                <ChatScreen
                    connection={'connected'} //TODO: substituir para usar useSocket
                    // selectedUser={selectedUser}
                />
            </IsOpenProvider>
        </main>
    );
}
