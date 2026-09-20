import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import type { TrialResult } from './types';

const storage = vi.hoisted(() => ({
    saveResult: vi.fn(() => true),
    clearHistory: vi.fn(() => true),
    loadHistory: vi.fn(() => ({ history: [], success: true })),
    exportHistory: vi.fn(),
}));

vi.mock('./core/storage', () => ({
    ...storage,
}));

vi.mock('./views/TestRunner', () => ({
    TestRunner: ({ onComplete, onAbort, isPractice }: {
        onComplete: (results: TrialResult[]) => void;
        onAbort: () => void;
        isPractice?: boolean;
    }) => (
        <div>
            <span>{isPractice ? '練習中' : '本番中'}</span>
            <button onClick={() => onComplete([sampleResult])}>完了</button>
            <button onClick={onAbort}>中断</button>
        </div>
    ),
}));

const sampleResult: TrialResult = {
    stimulusId: 'easy-short-1', targetWord: 'テスト', inputWord: 'テスト', isCorrect: true, reactionTime: 1000,
    config: { fontFamily: 'system', fontSize: 32, letterSpacing: '0', contrast: 'high', duration: 500, wordLengthLevel: 'short', vocabularyLevel: 'easy', questionCount: 5, inputMode: 'direct', seed: 'app-test' },
    timestamp: 0,
};

const openSetup = () => fireEvent.click(screen.getByRole('button', { name: '同意して開始する' }));

describe('App', () => {
    afterEach(() => {
        cleanup();
        storage.saveResult.mockClear();
        vi.restoreAllMocks();
    });

    it('本番の最終回答では結果画面へ遷移し、履歴を一度だけ保存する', () => {
        render(<App />);
        openSetup();
        fireEvent.click(screen.getByRole('button', { name: 'テスト開始' }));
        expect(screen.getByText('本番中')).toBeTruthy();

        fireEvent.click(screen.getByRole('button', { name: '完了' }));

        expect(screen.getByRole('heading', { name: '結果サマリ' })).toBeTruthy();
        expect(storage.saveResult).toHaveBeenCalledTimes(1);
        expect(storage.saveResult).toHaveBeenCalledWith([sampleResult]);
    });

    it('練習の完了と中断はいずれも設定画面へ戻り、履歴を保存しない', () => {
        const alert = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
        render(<App />);
        openSetup();
        fireEvent.click(screen.getByRole('button', { name: '練習 (固定5問)' }));
        expect(screen.getByText('練習中')).toBeTruthy();

        fireEvent.click(screen.getByRole('button', { name: '完了' }));
        expect(screen.getByRole('heading', { name: '測定条件' })).toBeTruthy();
        expect(alert).toHaveBeenCalledOnce();
        expect(storage.saveResult).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: 'テスト開始' }));
        fireEvent.click(screen.getByRole('button', { name: '中断' }));
        expect(screen.getByRole('heading', { name: '測定条件' })).toBeTruthy();
        expect(storage.saveResult).not.toHaveBeenCalled();
    });
});
