import type { TrialResult } from '../types';

const STORAGE_KEY = 'katakana_screening_results_v1';

export const saveResult = (results: TrialResult[]) => {
    const existing = getHistory();
    const updated = [...existing, ...results];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getHistory = (): TrialResult[] => {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return [];
    try {
        return JSON.parse(s);
    } catch {
        return [];
    }
};

export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
};

export const exportHistory = () => {
    const history = getHistory();
    const csv = [
        'Timestamp,Config_Font,Config_Size,Config_Duration,Config_Length,Config_Mode,StimulusID,Target,Input,InputRaw,Correct,RT',
        ...history.map(r =>
            `${new Date(r.timestamp).toISOString()},${r.config.fontFamily},${r.config.fontSize},${r.config.duration},${r.config.wordLengthLevel},${r.config.inputMode || 'direct'},${r.stimulusId},${r.targetWord},${r.inputWord},${r.inputRaw || ''},${r.isCorrect},${r.reactionTime.toFixed(2)}`
        )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `katakana_results_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
};
