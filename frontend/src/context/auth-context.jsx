'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

const AuthContext = createContext(null);

const ME_ROUTE = process.env.NEXT_PUBLIC_ME_ROUTE;
const LOGIN_ROUTE = process.env.NEXT_PUBLIC_LOGIN_ROUTE;
const LOGOUT_ROUTE = process.env.NEXT_PUBLIC_LOGOUT_ROUTE;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch(ME_ROUTE);
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (e) {
                console.error('Auth init error', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    console.log('current user in ctx:', user);

    async function login(email, password) {
        const res = await apiFetch(LOGIN_ROUTE, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            // after login, fetch user
            const me = await apiFetch(ME_ROUTE);
            if (me.ok) {
                const data = await me.json();
                setUser(data.user);
            }
        }
        return res;
    }

    async function logout() {
        await apiFetch(LOGOUT_ROUTE, { method: 'POST' });
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
