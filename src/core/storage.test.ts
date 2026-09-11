import { afterEach, describe, expect, it, vi } from 'vitest';
import { getHistory, saveResult } from './storage';
import type { TrialResult } from '../types';

const sampleResult: TrialResult = {
    stimulusId: 'stim-1',
    targetWord: 'カメラ',
    inputWord: 'カメラ',
    isCorrect: true,
    reactionTime: 1234,
    timestamp: 1,
    config: {
        fontFamily: 'system',
        fontSize: 32,
        letterSpacing: '0',
        contrast: 'high',
        duration: 500,
        wordLengthLevel: 'medium',
        vocabularyLevel: 'easy',
        questionCount: 5,
        inputMode: 'direct',
        seed: 'seed'
    }
};

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('storage', () => {
    it('returns an empty history when localStorage cannot be read', () => {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(() => { throw new Error('blocked'); })
        });
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        expect(getHistory()).toEqual([]);
    });

    it('returns false instead of throwing when localStorage cannot be written', () => {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(() => null),
            setItem: vi.fn(() => { throw new Error('quota'); })
        });
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        expect(saveResult([sampleResult])).toBe(false);
    });

    it('does not overwrite history when reading existing data fails', () => {
        const setItem = vi.fn();
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(() => { throw new Error('blocked'); }),
            setItem
        });
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        expect(saveResult([sampleResult])).toBe(false);
        expect(setItem).not.toHaveBeenCalled();
    });

    it('saves normally when localStorage is available', () => {
        const setItem = vi.fn();
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(() => null),
            setItem
        });

        expect(saveResult([sampleResult])).toBe(true);
        expect(setItem).toHaveBeenCalledOnce();
    });
});
