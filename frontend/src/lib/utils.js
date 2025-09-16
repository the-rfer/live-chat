import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function debounce(fn, delay) {
    let timer;

    function debounced(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    }

    debounced.cancel = () => {
        clearTimeout(timer);
    };

    return debounced;
}
