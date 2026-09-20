import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Setup } from './Setup';
import type { TestConfig } from '../types';

const config: TestConfig = {
    fontFamily: 'system', fontSize: 32, letterSpacing: '0', contrast: 'high', duration: 500,
    wordLengthLevel: 'medium', vocabularyLevel: 'easy', questionCount: 10, inputMode: 'direct', seed: '',
};

describe('Setup', () => {
    afterEach(cleanup);

    it('高度な設定を初期状態で閉じ、開いた値を開始時の設定に反映する', () => {
        const onStart = vi.fn();
        const { container } = render(<Setup initialConfig={config} onStart={onStart} onPractice={vi.fn()} onHistory={vi.fn()} />);
        const details = container.querySelector('details');

        expect(details?.open).toBe(false);
        fireEvent.click(screen.getByText('高度な設定'));
        expect(details?.open).toBe(true);

        const fontSelect = details?.querySelector('select');
        expect(fontSelect).toBeTruthy();
        fireEvent.change(fontSelect!, { target: { value: 'noto-sans-jp' } });
        fireEvent.click(screen.getByRole('button', { name: 'テスト開始' }));

        expect(onStart).toHaveBeenCalledWith({ ...config, fontFamily: 'noto-sans-jp' });
    });
});
