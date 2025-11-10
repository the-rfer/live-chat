import { useEffect, useState } from 'react';

export function applyInitialTheme() {
    const stored = localStorage.getItem('theme');

    if (stored) {
        document.body.classList.toggle('dark', stored === 'dark');
        return;
    }

    const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches;
    document.body.classList.toggle('dark', prefersDark);
}

export function useTheme() {
    const [isDark, setIsDark] = useState<boolean>(
        document.body.classList.contains('dark')
    );

    useEffect(() => {
        document.body.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDark(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => setIsDark((prev) => !prev);

    return { isDark, toggleTheme };
}
