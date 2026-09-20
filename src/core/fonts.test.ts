import { describe, expect, it } from 'vitest';
import { FONT_OPTIONS, getFontFamily, getFontLabel } from './fonts';

describe('font configuration', () => {
    it('provides a label and CSS family for every selectable font', () => {
        FONT_OPTIONS.forEach(option => {
            expect(getFontLabel(option.value)).toBe(option.label);
            expect(getFontFamily(option.value)).toContain('var(--font-family-');
        });
    });

    it('falls back to the system font for unknown saved settings', () => {
        expect(getFontLabel('legacy-font')).toBe('システム標準');
        expect(getFontFamily('legacy-font')).toBe('var(--font-family-system)');
    });
});
