import { describe, expect, it } from 'vitest';
import { RAW_WORDS } from './generator';

describe('word dictionary', () => {
    it('contains dictionary entries', () => {
        expect(RAW_WORDS.length).toBeGreaterThan(0);
    });

    it('contains only katakana words', () => {
        const invalid = RAW_WORDS
            .filter(({ word }) => !/^[ァ-ヶー]+$/u.test(word))
            .map(({ word, level }) => `${level}: ${word}`);

        expect(invalid, `Non-katakana entries:\n${invalid.join('\n')}`).toEqual([]);
    });

    it('contains only words that fit a UI length category', () => {
        const tooShort = RAW_WORDS
            .filter(({ word }) => word.length < 3)
            .map(({ word, level }) => `${level}: ${word} (${word.length})`);

        expect(tooShort, `Words shorter than the UI minimum of 3 characters:\n${tooShort.join('\n')}`).toEqual([]);
    });

    it('does not contain duplicate entries within the same vocabulary level', () => {
        const seen = new Set<string>();
        const duplicates: string[] = [];

        for (const { word, level } of RAW_WORDS) {
            const key = `${level}\u0000${word}`;
            if (seen.has(key)) duplicates.push(`${level}: ${word}`);
            seen.add(key);
        }

        expect(duplicates, `Duplicate entries:\n${duplicates.join('\n')}`).toEqual([]);
    });
});
