import { describe, it, expect } from 'vitest';
import { convertInput } from './converter';

describe('Romaji Converter', () => {
    it('should sanitize non-ascii characters', () => {
        const { sanitized } = convertInput('a b c!@#');
        expect(sanitized).toBe('abc');
    });

    it('should convert basic romaji', () => {
        const { converted } = convertInput('banana');
        expect(converted).toBe('バナナ');
    });

    it('should handle long vowels with hyphen', () => {
        const { converted } = convertInput('ko-hi-');
        expect(converted).toBe('コーヒー');
    });

    it('should handle mixed case', () => {
        const { converted } = convertInput('KaMeRa');
        expect(converted).toBe('カメラ');
    });

    it('should handle small tsu (sokuon)', () => {
        const { converted } = convertInput('netto');
        expect(converted).toBe('ネット');
    });

    it('should handle chouon inside word', () => {
        const { converted } = convertInput('no-to');
        expect(converted).toBe('ノート');
    });

    it('should handle "n" and "nn" correctly', () => {
        // "pan" -> "パン"
        expect(convertInput('pan').converted).toBe('パン');
        // "pann" -> "パン" (User expectation)
        expect(convertInput('pann').converted).toBe('パン');

        // Mid-word: nn + Consonant -> n (ん)
        // "kannta" -> "カンタ"
        expect(convertInput('kannta').converted).toBe('カンタ');

        // Mid-word: nn + Vowel -> nn (ん+Vowel line)
        // "kanna" -> "カンナ"
        expect(convertInput('kanna').converted).toBe('カンナ');

        // "kinniku" -> "キンニク"
        expect(convertInput('kinniku').converted).toBe('キンニク');

        // "kannyuu" -> "カンニュウ" (nn followed by y should be preserved)
        expect(convertInput('kannyuu').converted).toBe('カンニュウ');
    });
});
