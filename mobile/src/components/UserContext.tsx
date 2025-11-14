import { useState, useEffect, type ReactNode } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { useHistory } from 'react-router-dom';
import { useSession } from '@/lib/auth-client';
import { UserContext } from '@/hooks/useUser';
import { type User } from '@/lib/types';
import { clearSession, getStoredSession } from '@/lib/session';

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useHistory();
    const session = useSession();

    useEffect(() => {
        async function initUserFlow() {
            const stored = await getStoredSession();

            if (!stored) {
                setUser(null);
                navigate.push('/login', { replace: true });
                await SplashScreen.hide();
                return;
            }

            if (session.data?.user) {
                setUser(session.data.user);
                navigate.push('/home', { replace: true });
            } else if (session?.error) {
                await clearSession();
                setUser(null);
                navigate.push('/login', { replace: true });
            }

            await SplashScreen.hide();
        }

        initUserFlow();
    }, [navigate, session]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
