import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearHistory, createHistoryCsv, getHistory, loadHistory, saveResult } from './storage';
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
        expect(loadHistory().success).toBe(false);
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

    it('clears history when localStorage is available', () => {
        const removeItem = vi.fn();
        vi.stubGlobal('localStorage', { removeItem });

        expect(clearHistory()).toBe(true);
        expect(removeItem).toHaveBeenCalledOnce();
    });

    it('returns false when history cannot be cleared', () => {
        vi.stubGlobal('localStorage', {
            removeItem: vi.fn(() => { throw new Error('blocked'); })
        });
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        expect(clearHistory()).toBe(false);
    });

    it('exports every measurement setting', () => {
        const csv = createHistoryCsv([sampleResult]);
        const [header, row] = csv.split('\n');

        expect(header).toBe('Timestamp,Config_Font,Config_Size,Config_LetterSpacing,Config_Contrast,Config_Duration,Config_Length,Config_Vocab,Config_Mode,Config_QuestionCount,Config_Seed,StimulusID,Target,Input,InputRaw,Unrecognized,Correct,RT');
        expect(row).toContain('system,32,0,high,500,medium,easy,direct,5,seed,stim-1,カメラ,カメラ,,false,true');
    });

    it('exports legacy results without newer measurement settings', () => {
        const legacyResult = {
            ...sampleResult,
            config: {
                fontFamily: 'system',
                fontSize: 32,
                duration: 500,
                wordLengthLevel: 'medium',
                vocabularyLevel: 'easy',
                inputMode: 'direct',
                seed: 'seed'
            }
        } as TrialResult;

        const [, row] = createHistoryCsv([legacyResult]).split('\n');

        expect(row).toContain('system,32,,,500,medium,easy,direct,,seed,stim-1,カメラ,カメラ,,false,true');
    });

    it('exports unrecognized results separately from incorrect answers', () => {
        const unrecognizedResult: TrialResult = {
            ...sampleResult,
            inputWord: '',
            isUnrecognized: true,
            isCorrect: false
        };

        const [, row] = createHistoryCsv([unrecognizedResult]).split('\n');

        expect(row).toContain('カメラ,,,true,false');
    });
});
