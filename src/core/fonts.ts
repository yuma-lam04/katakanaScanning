export const FONT_OPTIONS = [
    { value: 'system', label: 'システム標準', description: '端末の標準フォント' },
    { value: 'ud', label: 'UDフォント', description: '端末にある場合に使用' },
    { value: 'yu-gothic', label: '游ゴシック', description: '端末にある場合に使用' },
    { value: 'noto-sans-jp', label: 'Noto Sans JP', description: '端末にある場合に使用' },
    { value: 'ms-mincho', label: 'MS明朝', description: '端末にある場合に使用' },
] as const;

const FONT_VAR_MAP: Record<string, string> = {
    ud: 'var(--font-family-ud)',
    'yu-gothic': 'var(--font-family-yugothic)',
    'noto-sans-jp': 'var(--font-family-noto)',
    'ms-mincho': 'var(--font-family-mincho)',
};

export const getFontFamily = (fontFamily: string): string =>
    FONT_VAR_MAP[fontFamily] ?? 'var(--font-family-system)';

export const getFontLabel = (fontFamily: string): string =>
    FONT_OPTIONS.find(option => option.value === fontFamily)?.label ?? 'システム標準';
