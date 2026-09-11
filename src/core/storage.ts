import type { TrialResult } from '../types';

const STORAGE_KEY = 'katakana_screening_results_v1';

interface HistoryReadResult {
    history: TrialResult[];
    success: boolean;
}

const readHistory = (): HistoryReadResult => {
    try {
        const s = localStorage.getItem(STORAGE_KEY);
        if (!s) return { history: [], success: true };

        const parsed: unknown = JSON.parse(s);
        if (!Array.isArray(parsed)) {
            console.warn('Stored history is not an array.');
            return { history: [], success: false };
        }

        return { history: parsed as TrialResult[], success: true };
    } catch (error) {
        console.warn('Failed to read result history from localStorage.', error);
        return { history: [], success: false };
    }
};

export const saveResult = (results: TrialResult[]): boolean => {
    const { history: existing, success } = readHistory();
    if (!success) return false;

    try {
        const updated = [...existing, ...results];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.warn('Failed to save result history to localStorage.', error);
        return false;
    }
};

export const getHistory = (): TrialResult[] => readHistory().history;

export const clearHistory = (): boolean => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.warn('Failed to clear result history from localStorage.', error);
        return false;
    }
};

// RFC 4180: quote fields containing commas, quotes, or newlines
const csvField = (v: string | number | boolean): string => {
    const s = String(v);
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const exportHistory = () => {
    const history = getHistory();
    const csv = [
        'Timestamp,Config_Font,Config_Size,Config_Duration,Config_Length,Config_Vocab,Config_Mode,Config_Seed,StimulusID,Target,Input,InputRaw,Correct,RT',
        ...history.map(r =>
            [
                new Date(r.timestamp).toISOString(),
                r.config.fontFamily,
                r.config.fontSize,
                r.config.duration,
                r.config.wordLengthLevel,
                r.config.vocabularyLevel,
                r.config.inputMode || 'direct',
                r.config.seed || '',
                r.stimulusId,
                r.targetWord,
                r.inputWord,
                r.inputRaw || '',
                r.isCorrect,
                r.reactionTime.toFixed(2)
            ].map(csvField).join(',')
        )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `katakana_results_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
};
