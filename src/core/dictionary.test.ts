import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

interface DictionaryEntry {
    word: string;
    level: string;
}

const generatorPath = fileURLToPath(new URL('./generator.ts', import.meta.url));
const generatorSource = readFileSync(generatorPath, 'utf8');
const entryPattern = /\{ word: '([^']+)', level: '(easy|normal|hard|info)' \}/g;
const entries: DictionaryEntry[] = Array.from(generatorSource.matchAll(entryPattern), match => ({
    word: match[1],
    level: match[2],
}));

describe('word dictionary', () => {
    it('contains parseable dictionary entries', () => {
        expect(entries.length).toBeGreaterThan(0);
    });

    it('contains only katakana words', () => {
        const invalid = entries
            .filter(({ word }) => !/^[ァ-ヶー]+$/u.test(word))
            .map(({ word, level }) => `${level}: ${word}`);

        expect(invalid, `Non-katakana entries:\n${invalid.join('\n')}`).toEqual([]);
    });

    it('contains only words that fit a UI length category', () => {
        const tooShort = entries
            .filter(({ word }) => word.length < 3)
            .map(({ word, level }) => `${level}: ${word} (${word.length})`);

        expect(tooShort, `Words shorter than the UI minimum of 3 characters:\n${tooShort.join('\n')}`).toEqual([]);
    });

    it('does not contain duplicate entries within the same vocabulary level', () => {
        const seen = new Set<string>();
        const duplicates: string[] = [];

        for (const { word, level } of entries) {
            const key = `${level}\u0000${word}`;
            if (seen.has(key)) duplicates.push(`${level}: ${word}`);
            seen.add(key);
        }

        expect(duplicates, `Duplicate entries:\n${duplicates.join('\n')}`).toEqual([]);
    });
});
