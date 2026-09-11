import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface DictionaryEntry {
    word: string;
    level: string;
}

const loadDictionaryEntries = (): DictionaryEntry[] => {
    const source = readFileSync(new URL('./generator.ts', import.meta.url), 'utf-8');
    const entryPattern = /\{\s*word:\s*'([^']+)',\s*level:\s*'(easy|normal|hard|info)'\s*\}/g;

    return [...source.matchAll(entryPattern)].map(match => ({
        word: match[1],
        level: match[2],
    }));
};

describe('Katakana word dictionary', () => {
    const entries = loadDictionaryEntries();

    it('contains only katakana words', () => {
        const invalid = entries
            .filter(({ word }) => !/^[\u30A0-\u30FF]+$/u.test(word))
            .map(({ word, level }) => `${level}:${word}`);

        expect(invalid).toEqual([]);
    });

    it('does not contain duplicate words within the same vocabulary level', () => {
        const seen = new Set<string>();
        const duplicates = new Set<string>();

        entries.forEach(({ word, level }) => {
            const key = `${level}:${word}`;
            if (seen.has(key)) duplicates.add(key);
            seen.add(key);
        });

        expect([...duplicates].sort()).toEqual([]);
    });
});
