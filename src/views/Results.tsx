import { useMemo, type FC } from 'react';
import type { TestConfig, TrialResult } from '../types';
import { exportHistory } from '../core/storage';

interface ResultsProps {
    results: TrialResult[];
    config: TestConfig;
    onRestart: () => void;
}

export const Results: FC<ResultsProps> = ({ results, config, onRestart }) => {
    const stats = useMemo(() => {
        const total = results.length;
        const correct = results.filter(r => r.isCorrect).length;
        const accuracy = total === 0 ? 0 : correct / total;
        const meanRt = total === 0 ? 0 : results.reduce((sum, r) => sum + r.reactionTime, 0) / total;
        return { total, correct, accuracy, meanRt };
    }, [results]);

    return (
        <div className="screen" style={{ justifyContent: 'flex-start' }}>
            <h2 style={{ textAlign: 'center' }}>結果サマリ</h2>
            <p className="meta-label mb-4" style={{ textAlign: 'center' }}>
                {config.vocabularyLevel} / {config.wordLengthLevel} / {config.duration}ms / {config.inputMode}
            </p>

            <div className="stat-row">
                <div className="stat">
                    <div className="stat-sub">正答率</div>
                    <div className="stat-value">{(stats.accuracy * 100).toFixed(0)}%</div>
                    <div className="stat-sub">{stats.correct} / {stats.total}</div>
                </div>
                <div className="stat">
                    <div className="stat-sub">平均反応時間</div>
                    <div className="stat-value">{(stats.meanRt / 1000).toFixed(2)}<span style={{ fontSize: '1rem' }}> s</span></div>
                    <div className="stat-sub">提示開始から</div>
                </div>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', textAlign: 'left' }}>
                <h3>詳細</h3>
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>正解</th>
                            <th>あなたの入力</th>
                            <th>判定</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, i) => (
                            <tr key={i}>
                                <td>{r.targetWord}</td>
                                <td>
                                    {r.inputWord}
                                    {r.inputRaw && r.inputRaw !== r.inputWord && (
                                        <div className="input-raw">({r.inputRaw})</div>
                                    )}
                                </td>
                                <td className={r.isCorrect ? 'judge-ok' : 'judge-ng'}>
                                    {r.isCorrect ? '〇' : '×'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 mb-4 flex-col gap-2">
                <button onClick={exportHistory}>全履歴をCSV出力</button>
                <div className="flex-row gap-2 justify-center">
                    <button className="btn-primary" onClick={onRestart}>設定へ戻る</button>
                </div>
            </div>
        </div>
    );
};
