import { describe, it, expect } from 'vitest';

function canonicalPair(a: string, b: string) {
    return [a, b].sort();
}

describe('canonicalPair', () => {
    it('orders ids deterministically', () => {
        const a = 'b';
        const b = 'a';
        const [x, y] = canonicalPair(a, b);
        expect(x).toBe('a');
        expect(y).toBe('b');
    });
});
