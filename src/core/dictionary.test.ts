import { describe, expect, it } from 'vitest';
import { RAW_WORDS } from './words';

describe('Katakana word dictionary', () => {
    it('contains only katakana words', () => {
        const invalid = RAW_WORDS
            .filter(({ word }) => !/^[\u30A0-\u30FF]+$/u.test(word))
            .map(({ word, level }) => `${level}:${word}`);

        expect(invalid).toEqual([]);
    });

    it('does not contain duplicate words within the same vocabulary level', () => {
        const seen = new Set<string>();
        const duplicates = new Set<string>();

        RAW_WORDS.forEach(({ word, level }) => {
            const key = `${level}:${word}`;
            if (seen.has(key)) duplicates.add(key);
            seen.add(key);
        });

        expect([...duplicates].sort()).toEqual([]);
    });
});
