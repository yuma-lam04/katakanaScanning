import { useState, useEffect, useRef, useCallback, type FC, type KeyboardEvent } from 'react';
import { TrialGenerator } from '../core/generator';
import { convertInput } from '../core/converter';
import type { Stimulus, TestConfig, TrialResult } from '../types';

interface TestRunnerProps {
    config: TestConfig;
    onComplete: (results: TrialResult[]) => void;
    onAbort: () => void;
    isPractice?: boolean;
}

type Phase = 'fixation' | 'stimulus' | 'mask' | 'response' | 'feedback';

export const TestRunner: FC<TestRunnerProps> = ({ config, onComplete, onAbort, isPractice = false }) => {
    const [trials, setTrials] = useState<Stimulus[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [phase, setPhase] = useState<Phase>('fixation');
    const [results, setResults] = useState<TrialResult[]>([]);
    const [inputValue, setInputValue] = useState('');

    // Refs
    const displayStartTimeRef = useRef<number>(0);
    const timerRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize
    useEffect(() => {
        const gen = new TrialGenerator(config.seed || Math.random().toString());
        const t = isPractice ? gen.generatePractice() : gen.generateSession(config);
        setTrials(t);
    }, [config, isPractice]);

    // Focus input on response phase
    useEffect(() => {
        if (phase === 'response' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [phase]);

    // Phase Controller
    const startTrial = useCallback(() => {
        setPhase('fixation');
        setInputValue('');
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

    // Start first trial when trials are ready
    useEffect(() => {
        if (trials.length > 0 && currentIdx === 0 && !timerRef.current) {
            startTrial();
        }
    }, [trials, startTrial]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleSubmit = () => {
        if (phase !== 'response') return;

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
            if (timerRef.current) clearTimeout(timerRef.current);
            startTrial();
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
            if (!/^[a-zA-Z\-]$/.test(e.key)) {
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

    return (
        <div className="screen">
            <div className="mb-4 text-small">
                Trial {currentIdx + 1} / {trials.length} {isPractice ? '(練習)' : ''}
            </div>

            <div className="stimulus-area" style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${config.fontSize}px`,
                letterSpacing: config.letterSpacing,
                fontFamily:
                    config.fontFamily === 'ud' ? 'var(--font-family-ud)' :
                        config.fontFamily === 'yu-gothic' ? 'var(--font-family-yugothic)' :
                            config.fontFamily === 'noto-sans-jp' ? 'var(--font-family-noto)' :
                                config.fontFamily === 'ms-mincho' ? 'var(--font-family-mincho)' :
                                    'var(--font-family-system)',
                userSelect: 'none'
            }}>
                {phase === 'fixation' && '・'}
                {phase === 'stimulus' && currentTrial.displayString}
                {phase === 'mask' && '###'}
                {phase === 'response' && (
                    <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        {/* Real-time Preview for Romaji Mode */}
                        {config.inputMode === 'romaji' && (
                            <div style={{
                                minHeight: '1.5em',
                                fontSize: '1.5rem',
                                color: '#007bff',
                                fontWeight: 'bold',
                                marginBottom: '4px'
                            }}>
                                {convertInput(inputValue).converted || '\u00A0'}
                            </div>
                        )}
                        <input
                            ref={inputRef}
                            type={config.inputMode === 'romaji' ? 'text' : 'text'}
                            inputMode={config.inputMode === 'romaji' ? 'url' : undefined} // 'url' forces latin keyboard on many devices
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            placeholder={config.inputMode === 'romaji' ? "ローマ字で入力 ( - for ー )" : "見えた単語を入力"}
                            style={{
                                fontSize: '1.2rem',
                                padding: '0.5rem',
                                width: '100%',
                                textAlign: 'center',
                                borderRadius: '8px',
                                border: '2px solid #ccc',
                                imeMode: config.inputMode === 'romaji' ? 'disabled' : 'auto' // Old IE/Firefox support, good hint
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="response-area" style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={handleSubmit}
                    disabled={phase !== 'response' || inputValue.length === 0}
                    style={{
                        padding: '1rem 3rem',
                        fontSize: '1.2rem',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        opacity: phase === 'response' ? 1 : 0.5
                    }}
                >
                    次へ
                </button>
            </div>

            <div className="mt-4">
                <button className="text-small" onClick={onAbort}>中断して戻る</button>
            </div>
        </div>
    );
};
