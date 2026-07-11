import { useState, useEffect, useMemo, useRef, useCallback, type FC, type KeyboardEvent } from 'react';
import { TrialGenerator } from '../core/generator';
import { convertInput } from '../core/converter';
import { getFontFamily } from '../core/fonts';
import type { TestConfig, TrialResult } from '../types';

interface TestRunnerProps {
    config: TestConfig;
    onComplete: (results: TrialResult[]) => void;
    onAbort: () => void;
    isPractice?: boolean;
}

type Phase = 'fixation' | 'stimulus' | 'mask' | 'response' | 'feedback';

export const TestRunner: FC<TestRunnerProps> = ({ config, onComplete, onAbort, isPractice = false }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [phase, setPhase] = useState<Phase>('fixation');
    const [results, setResults] = useState<TrialResult[]>([]);
    const [inputValue, setInputValue] = useState('');

    // Refs
    const displayStartTimeRef = useRef<number>(0);
    const timerRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Trials are a pure function of the config (seed is resolved by App),
    // so derive them instead of syncing state in an effect
    const trials = useMemo(() => {
        const gen = new TrialGenerator(config.seed);
        return isPractice ? gen.generatePractice() : gen.generateSession(config);
    }, [config, isPractice]);

    // Focus input on response phase
    useEffect(() => {
        if (phase === 'response' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [phase]);

    // Phase Controller: schedules the fixation -> stimulus -> mask -> response
    // sequence. Callers are responsible for resetting phase/input state first,
    // which keeps this safe to call from an effect (no synchronous setState).
    const scheduleTrial = useCallback(() => {
        timerRef.current = window.setTimeout(() => {
            setPhase('stimulus');
            displayStartTimeRef.current = performance.now();

            timerRef.current = window.setTimeout(() => {
                setPhase('mask');
                timerRef.current = window.setTimeout(() => {
                    setPhase('response');
                }, 150); // MASK DURATION
            }, config.duration); // STIMULUS DURATION
        }, 1000); // FIXATION DURATION
    }, [config.duration]);

    // Start first trial when trials are ready (initial state is already fixation/empty)
    useEffect(() => {
        if (trials.length > 0 && currentIdx === 0 && !timerRef.current) {
            scheduleTrial();
        }
    }, [trials, currentIdx, scheduleTrial]);

    // Cleanup on unmount. Nulling the ref matters: StrictMode remounts the
    // component, and the start effect's !timerRef.current guard must pass again
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []);

    const handleSubmit = () => {
        // Empty guard also blocks Enter-key submits, not just the button
        if (phase !== 'response' || inputValue.trim().length === 0) return;

        const rt = performance.now() - displayStartTimeRef.current; // Approx, includes flash time
        const currentTrial = trials[currentIdx];

        let finalInput = inputValue.trim();
        let rawInput: string | undefined = undefined;

        if (config.inputMode === 'romaji') {
            rawInput = finalInput;
            const { converted } = convertInput(finalInput);
            finalInput = converted;
        }

        // Exact match check
        const isCorrect = finalInput === currentTrial.word;

        const result: TrialResult = {
            stimulusId: currentTrial.id,
            targetWord: currentTrial.word,
            inputWord: finalInput,
            inputRaw: rawInput,
            isCorrect,
            reactionTime: rt,
            config,
            timestamp: Date.now()
        };

        const newResults = [...results, result];
        setResults(newResults);

        if (currentIdx < trials.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setPhase('fixation');
            setInputValue('');
            if (timerRef.current) clearTimeout(timerRef.current);
            scheduleTrial();
        } else {
            onComplete(newResults);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
            return;
        }

        if (config.inputMode === 'romaji') {
            // Allow Control keys (Backspace, Tab, etc.)
            if (e.key.length > 1 || e.ctrlKey || e.metaKey || e.altKey) return;

            // Allow ASCII letters and hyphen only
            if (!/^[a-zA-Z-]$/.test(e.key)) {
                e.preventDefault();
            }
        }
    };

    // Paste prevention for strictness
    const handlePaste = (e: React.ClipboardEvent) => {
        if (config.inputMode === 'romaji') {
            e.preventDefault();
        }
    }

    if (trials.length === 0) return <div>Generating...</div>;

    const currentTrial = trials[currentIdx];
    const progress = (currentIdx + (phase === 'response' ? 0.5 : 0)) / trials.length;

    return (
        <div className="screen" style={{ justifyContent: 'center' }}>
            <div className="trial-meta">
                <span className="meta-label">
                    Trial {String(currentIdx + 1).padStart(2, '0')} / {String(trials.length).padStart(2, '0')}
                </span>
                {isPractice && <span className="meta-label">練習モード</span>}
            </div>
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
            </div>

            <div
                className={`display-panel contrast-${config.contrast}`}
                style={{
                    fontSize: `${config.fontSize}px`,
                    letterSpacing: config.letterSpacing,
                    fontFamily: getFontFamily(config.fontFamily),
                }}
            >
                {phase === 'fixation' && <span className="fixation-mark">・</span>}
                {phase === 'stimulus' && currentTrial.displayString}
                {phase === 'mask' && <span className="mask-mark">###</span>}
                {phase === 'response' && (
                    <div className="response-block">
                        {/* Real-time Preview for Romaji Mode */}
                        {config.inputMode === 'romaji' && (
                            <div className="romaji-preview">
                                {convertInput(inputValue).converted || ' '}
                            </div>
                        )}
                        <input
                            ref={inputRef}
                            type="text"
                            className="response-input"
                            inputMode={config.inputMode === 'romaji' ? 'url' : undefined} // 'url' forces latin keyboard on many devices
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            placeholder={config.inputMode === 'romaji' ? "ローマ字で入力 ( - for ー )" : "見えた単語を入力"}
                        />
                    </div>
                )}
            </div>

            <div className="test-actions">
                <button
                    className="btn-primary btn-lg"
                    onClick={handleSubmit}
                    disabled={phase !== 'response' || inputValue.length === 0}
                >
                    次へ
                </button>
            </div>

            <div className="mt-4" style={{ textAlign: 'center' }}>
                <button className="btn-quiet" onClick={onAbort}>中断して戻る</button>
            </div>
        </div>
    );
};
