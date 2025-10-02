'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

interface IsOpenContextType {
    isOpen: boolean;
    toggleOpen: () => void;
}

export const IsOpenContext = createContext<IsOpenContextType>({
    isOpen: false,
    toggleOpen: () => {},
});

export function IsOpenProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);

    function toggleOpen() {
        setIsOpen((prev) => {
            const newState = !prev;
            localStorage.setItem('sh.ch-isopen', JSON.stringify(newState));
            return newState;
        });
    }

    useEffect(() => {
        const storedIsOpen = localStorage.getItem('sh.ch-isopen');
        if (storedIsOpen) {
            setIsOpen(JSON.parse(storedIsOpen));
        }
    }, []);

    return (
        <IsOpenContext.Provider value={{ isOpen, toggleOpen }}>
            {children}
        </IsOpenContext.Provider>
    );
}
