export type WordLengthLevel = 'short' | 'medium' | 'long' | 'super-long';
export type VocabularyLevel = 'easy' | 'normal' | 'hard' | 'info';

export interface TestConfig {
    fontFamily: string;
    fontSize: number; // px
    letterSpacing: string; // em
    contrast: 'high' | 'medium' | 'low';
    duration: 200 | 500 | 1000; // ms
    wordLengthLevel: WordLengthLevel;
    vocabularyLevel: VocabularyLevel;
    questionCount: number;
    inputMode: 'direct' | 'romaji';
    seed: string;
}

export interface Stimulus {
    id: string;
    word: string;
    displayString: string;
}

export interface TrialResult {
    stimulusId: string;
    targetWord: string;
    inputWord: string;
    inputRaw?: string; // Raw input (e.g. Romaji)
    isCorrect: boolean;
    reactionTime: number; // ms
    config: TestConfig;
    timestamp: number;
}

export type ConfusionMatrix = Record<string, number>;
