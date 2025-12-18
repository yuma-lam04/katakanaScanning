import { useEffect, useMemo, type FC } from 'react';
import type { TestConfig, TrialResult } from '../types';
import { saveResult, exportHistory } from '../core/storage';

interface ResultsProps {
    results: TrialResult[];
    config: TestConfig;
    onRestart: () => void;

}

export const Results: FC<ResultsProps> = ({ results, config, onRestart }) => {
    useEffect(() => {
        saveResult(results);
    }, [results]);

    const stats = useMemo(() => {
        const total = results.length;
        const correct = results.filter(r => r.isCorrect).length;
        const accuracy = total === 0 ? 0 : correct / total;
        return { total, correct, accuracy };
    }, [results]);

    return (
        <div className="screen" style={{ justifyContent: 'flex-start', paddingTop: '2rem', textAlign: 'center' }}>
            <h2>結果サマリ</h2>
            <p className="text-small">設定: {config.vocabularyLevel.toUpperCase()} / Length={config.wordLengthLevel} / Time={config.duration}ms</p>

            <div className="flex-row gap-2 justify-center mb-4">
                <div className="p-4" style={{ background: '#f8f9fa', borderRadius: '8px', minWidth: '150px' }}>
                    <h3>正答率</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{(stats.accuracy * 100).toFixed(0)}%</p>
                    <p>({stats.correct} / {stats.total})</p>
                </div>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', textAlign: 'left' }}>
                <h3>詳細</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px' }}>正解</th>
                            <th style={{ padding: '8px' }}>あなたの入力</th>
                            <th style={{ padding: '8px' }}>判定</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>{r.targetWord}</td>
                                <td style={{ padding: '8px' }}>
                                    {r.inputWord}
                                    {r.inputRaw && r.inputRaw !== r.inputWord && (
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                            ({r.inputRaw})
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '8px', color: r.isCorrect ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {r.isCorrect ? '〇' : '×'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 mb-4 flex-col gap-2">
                <button onClick={exportHistory} style={{ background: '#6c757d', color: 'white' }}>全履歴をCSV出力</button>
                <div className="flex-row gap-2 justify-center">
                    <button onClick={onRestart}>設定へ戻る</button>
                </div>
            </div>
        </div>
    );
};
