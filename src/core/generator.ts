import seedrandom from 'seedrandom';
import type { Stimulus, TestConfig } from '../types';
import { RAW_WORDS, type WordEntry } from './words';

export class TrialGenerator {
    private rng: seedrandom.PRNG;

    constructor(seed: string) {
        this.rng = seedrandom(seed);
    }

    private shuffle<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(this.rng() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    generateSession(config: TestConfig): Stimulus[] {
        const levelWords = RAW_WORDS.filter(w => w.level === config.vocabularyLevel);

        let minLen = 0;
        let maxLen = 0;

        switch (config.wordLengthLevel) {
            case 'short': minLen = 3; maxLen = 5; break;
            case 'medium': minLen = 5; maxLen = 7; break;
            case 'long': minLen = 7; maxLen = 10; break;
            case 'super-long': minLen = 11; maxLen = 30; break;
            default: minLen = 3; maxLen = 30;
        }

        const dedupe = (words: WordEntry[]): WordEntry[] => {
            const seen = new Set<string>();
            return words.filter(w => !seen.has(w.word) && seen.add(w.word));
        };

        const eligibleWords = dedupe(
            levelWords.filter(w => w.word.length >= minLen && w.word.length <= maxLen)
        );
        const sameLevelWords = dedupe(levelWords);
        const allWords = dedupe(RAW_WORDS);

        const selected: WordEntry[] = [];
        const selectedWords = new Set<string>();

        const appendFrom = (candidates: WordEntry[]) => {
            const available = candidates.filter(w => !selectedWords.has(w.word));
            const needed = config.questionCount - selected.length;
            if (needed <= 0) return;

            this.shuffle(available).slice(0, needed).forEach(item => {
                selected.push(item);
                selectedWords.add(item.word);
            });
        };

        // Prefer the exact requested condition first.
        appendFrom(eligibleWords);

        // If there are too few words, relax only the length constraint.
        if (selected.length < config.questionCount) {
            console.warn(
                `Only ${selected.length} unique words found for Level=${config.vocabularyLevel}, ` +
                `Length=${config.wordLengthLevel}. Relaxing length.`
            );
            appendFrom(sameLevelWords);
        }

        // If the vocabulary level itself is still too small, use the full list.
        if (selected.length < config.questionCount) {
            console.warn(
                `Only ${selected.length} unique words found for Level=${config.vocabularyLevel}. ` +
                'Relaxing vocabulary level.'
            );
            appendFrom(allWords);
        }

        if (selected.length < config.questionCount) {
            console.warn(
                `Only ${selected.length} unique words are available for the requested ` +
                `${config.questionCount} questions.`
            );
        }

        return selected.map(item => ({
            id: this.rng().toString(36).substr(2, 9),
            word: item.word,
            displayString: item.word
        }));
    }

    generatePractice(): Stimulus[] {
        const practiceWords = ['テスト', 'レンシュウ', 'カタカナ', 'スタート', 'オワリ'];
        const stimuli: Stimulus[] = [];

        practiceWords.forEach(word => {
            stimuli.push({
                id: this.rng().toString(36).substr(2, 9),
                word,
                displayString: word
            });
        });

        return this.shuffle(stimuli);
    }
}
