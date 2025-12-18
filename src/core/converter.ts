import { toKatakana } from 'wanakana';

/**
 * Sanitizes and converts Romaji input to Katakana.
 * 
 * Rules:
 * 1. Allow [a-zA-Z\-] only.
 * 2. Convert to Katakana using wanakana.
 * 3. Normalize: Ensure prolonged sound marks are consistent.
 *    User is instructed to use hyphen '-' for long vowels.
 *    wanakana.toKatakana may convert '-' to 'ー' or keep it depending on context.
 *    We force normalization to 'ー' for consistency.
 */
export const convertInput = (raw: string): { sanitized: string; converted: string } => {
    // 1. Sanitize: Remove non-alphanumeric/non-hyphen
    let sanitized = raw.replace(/[^a-zA-Z\-]/g, '').toLowerCase();

    // Fix: Handle 'nn' -> 'n' if NOT followed by a vowel or 'y'.
    // Logic: 
    // - 'pann' -> 'pan' (EOF) -> 'パン'
    // - 'kannta' -> 'kanta' (Consonant) -> 'カンタ'
    // - 'kanna' -> 'kanna' (Vowel) -> 'カンナ' (Preserved)
    // - 'kannyuu' -> 'kannyuu' (Y) -> 'カンニュウ' (Preserved)
    // - 'kinniku' -> 'kinniku' (Vowel) -> 'キンニク' (Preserved)
    sanitized = sanitized.replace(/nn(?![aiueoy])/g, 'n');

    // 2. Convert
    // passRomaji: false -> forcibly convert even if incomplete
    let converted = toKatakana(sanitized, { customKanaMapping: { '-': 'ー' } });

    // 3. Normalize
    // Ensure any remaining hyphens are valid prolonged marks if intended
    // wanakana usually handles this, but just in case of edge cases or simple replacement:
    // If wanakana didn't convert a hyphen (e.g. standalone?), force it.
    converted = converted.replace(/-/g, 'ー');

    return { sanitized, converted };
};
