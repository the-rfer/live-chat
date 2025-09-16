'use client';

import { createContext, useContext, useState } from 'react';

const IsOpenContext = createContext();

export function IsOpenProvider({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => setIsOpen((prev) => !prev);

    return (
        <IsOpenContext.Provider value={{ isOpen, toggleOpen }}>
            {children}
        </IsOpenContext.Provider>
    );
}

export function useIsOpen() {
    const context = useContext(IsOpenContext);
    if (context === undefined) {
        throw new Error('useIsOpen must be used within an IsOpenProvider');
    }
    return context;
}
