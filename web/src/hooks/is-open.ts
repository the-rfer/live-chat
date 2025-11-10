import { IsOpenContext } from '@/context/is-open-context';
import { useContext } from 'react';

export function useIsOpen() {
    const context = useContext(IsOpenContext);
    if (context === undefined) {
        throw new Error('useIsOpen must be used within an IsOpenProvider');
    }
    return context;
}
