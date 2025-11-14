import { useState, useEffect, type ReactNode } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { useHistory } from 'react-router-dom';
import { getCurrentSession } from '@/lib/auth';
import { UserContext } from '@/hooks/useUser';
import { type User } from '@/lib/types';

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useHistory();

    useEffect(() => {
        async function fetchSession() {
            try {
                const session = await getCurrentSession();
                if (session.success) {
                    setUser(session.user);
                    navigate.replace('/home');
                } else {
                    setUser(null);
                    navigate.replace('/login');
                }
            } catch (error) {
                console.error('Error fetching session:', error);
                setUser(null);
                navigate.replace('/login');
            } finally {
                await SplashScreen.hide();
            }
        }

        fetchSession();
    }, [navigate]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
