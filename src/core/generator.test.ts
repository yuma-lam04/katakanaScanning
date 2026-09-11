import { describe, it, expect } from 'vitest';
import { TrialGenerator } from './generator';
import type { TestConfig } from '../types';

describe('TrialGenerator', () => {
    const config: TestConfig = {
        fontFamily: 'system',
        fontSize: 32,
        letterSpacing: '0',
        contrast: 'high',
        duration: 500,
        wordLengthLevel: 'medium',
        vocabularyLevel: 'easy',
        questionCount: 5,
        inputMode: 'direct',
        seed: 'test-seed'
    };

    it('should generate reproducible sequence with same seed', () => {
        const gen1 = new TrialGenerator('seed1');
        const t1 = gen1.generateSession(config);

        const gen2 = new TrialGenerator('seed1');
        const t2 = gen2.generateSession(config);

        expect(t1.length).toBeGreaterThan(0);
        expect(t1).toEqual(t2);
    });

    it('should generate different sequence with different seed', () => {
        const gen1 = new TrialGenerator('seed1');
        const t1 = gen1.generateSession(config);

        const gen2 = new TrialGenerator('seed2');
        const t2 = gen2.generateSession(config);

        expect(t1[0].id).not.toBe(t2[0].id);
    });

    it('should keep the requested length condition when enough words exist', () => {
        const gen = new TrialGenerator('test-seed');
        const session = gen.generateSession({
            ...config,
            wordLengthLevel: 'super-long',
            vocabularyLevel: 'normal',
            questionCount: 5
        });

        expect(session).toHaveLength(5);
        session.forEach(s => {
            expect(s.word.length).toBeGreaterThanOrEqual(11);
        });
    });

    it('should relax the length condition when the exact pool is too small', () => {
        const gen = new TrialGenerator('fallback-length');
        const session = gen.generateSession({
            ...config,
            vocabularyLevel: 'easy',
            wordLengthLevel: 'long',
            questionCount: 20
        });

        expect(session).toHaveLength(20);
        expect(new Set(session.map(s => s.word)).size).toBe(20);
        expect(session.some(s => s.word.length < 7 || s.word.length > 10)).toBe(true);
    });

    it('should relax the vocabulary level when one level cannot fill the request', () => {
        const gen = new TrialGenerator('fallback-vocabulary');
        const session = gen.generateSession({
            ...config,
            vocabularyLevel: 'easy',
            wordLengthLevel: 'long',
            questionCount: 200
        });

        expect(session).toHaveLength(200);
        expect(new Set(session.map(s => s.word)).size).toBe(200);
    });

    it('should generate stimuli for info level', () => {
        const gen = new TrialGenerator('test-seed');
        const infoConfig: TestConfig = {
            ...config,
            vocabularyLevel: 'info',
            questionCount: 5
        };

        const session = gen.generateSession(infoConfig);
        expect(session).toHaveLength(5);
        session.forEach(s => {
            expect(s.word.length).toBeGreaterThan(0);
        });
    });
});
