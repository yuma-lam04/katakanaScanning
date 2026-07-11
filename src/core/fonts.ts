const FONT_VAR_MAP: Record<string, string> = {
    ud: 'var(--font-family-ud)',
    'yu-gothic': 'var(--font-family-yugothic)',
    'noto-sans-jp': 'var(--font-family-noto)',
    'ms-mincho': 'var(--font-family-mincho)',
};

export const getFontFamily = (fontFamily: string): string =>
    FONT_VAR_MAP[fontFamily] ?? 'var(--font-family-system)';
