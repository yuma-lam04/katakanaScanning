import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { TestRunner } from './TestRunner';
import type { TestConfig, TrialResult } from '../types';

const config: TestConfig = {
    fontFamily: 'system', fontSize: 32, letterSpacing: '0', contrast: 'high', duration: 200,
    wordLengthLevel: 'short', vocabularyLevel: 'easy', questionCount: 5, inputMode: 'direct', seed: 'screen-test',
};

const advanceToResponse = () => {
    act(() => { vi.advanceTimersByTime(1000); });
    act(() => { vi.advanceTimersByTime(config.duration); });
    act(() => { vi.advanceTimersByTime(150); });
};

describe('TestRunner', () => {
    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    it('注視点、単語、マスク、回答欄の順に表示する', () => {
        vi.useFakeTimers();
        render(<TestRunner config={config} onComplete={vi.fn()} onAbort={vi.fn()} />);
        expect(screen.getByText('・')).toBeTruthy();

        act(() => { vi.advanceTimersByTime(1000); });
        expect(screen.queryByText('・')).toBeNull();
        expect(screen.queryByPlaceholderText('見えた単語を入力')).toBeNull();

        act(() => { vi.advanceTimersByTime(config.duration); });
        expect(screen.getByText('###')).toBeTruthy();

        act(() => { vi.advanceTimersByTime(150); });
        expect(screen.getByPlaceholderText('見えた単語を入力')).toBeTruthy();
    });

    it('IME変換中のEnterでは回答を送信しない', () => {
        vi.useFakeTimers();
        const onComplete = vi.fn<(results: TrialResult[]) => void>();
        render(<TestRunner config={config} onComplete={onComplete} onAbort={vi.fn()} />);
        advanceToResponse();

        const input = screen.getByPlaceholderText('見えた単語を入力');
        fireEvent.change(input, { target: { value: 'テスト' } });
        fireEvent.keyDown(input, { key: 'Enter', isComposing: true });

        expect(onComplete).not.toHaveBeenCalled();
        expect(screen.getByPlaceholderText('見えた単語を入力')).toBeTruthy();
    });

    it('通常回答で次の問題へ進み、最終回答で結果を返す', () => {
        vi.useFakeTimers();
        const onComplete = vi.fn<(results: TrialResult[]) => void>();
        render(<TestRunner config={config} onComplete={onComplete} onAbort={vi.fn()} />);

        for (let index = 0; index < config.questionCount; index += 1) {
            advanceToResponse();
            const input = screen.getByPlaceholderText('見えた単語を入力');
            fireEvent.change(input, { target: { value: `回答${index}` } });
            fireEvent.keyDown(input, { key: 'Enter', isComposing: false });

            if (index < config.questionCount - 1) {
                expect(screen.getByText(`Trial ${String(index + 2).padStart(2, '0')} / 05`)).toBeTruthy();
            }
        }

        expect(onComplete).toHaveBeenCalledOnce();
        expect(onComplete.mock.calls[0][0]).toHaveLength(config.questionCount);
    });
});
