import type { FC } from 'react';
import { exportHistory } from '../core/storage';
import type { TrialResult } from '../types';

interface HistoryProps {
    history: TrialResult[];
    loadFailed: boolean;
    clearFailed: boolean;
    onClear: () => void;
    onBack: () => void;
}

export const History: FC<HistoryProps> = ({ history, loadFailed, clearFailed, onClear, onBack }) => {
    const displayedHistory = [...history].reverse();

    return (
        <div className="screen" style={{ justifyContent: 'flex-start' }}>
            <h2 style={{ textAlign: 'center' }}>保存済みの履歴</h2>

            {loadFailed ? (
                <div className="notice">
                    <strong>履歴を読み込めませんでした。</strong>
                    <br />
                    ブラウザの保存領域を利用できないか、保存内容が壊れています。
                </div>
            ) : history.length === 0 ? (
                <p className="text-small" style={{ textAlign: 'center' }}>保存済みの履歴はありません。</p>
            ) : (
                <>
                    <p className="text-small" style={{ textAlign: 'center' }}>{history.length}件の試行を保存しています。</p>
                    <div className="history-table-wrap">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>日時</th>
                                    <th>正解</th>
                                    <th>入力</th>
                                    <th>判定</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedHistory.map((result, index) => (
                                    <tr key={`${result.timestamp}-${result.stimulusId}-${index}`}>
                                        <td>{new Date(result.timestamp).toLocaleString('ja-JP')}</td>
                                        <td>{result.targetWord}</td>
                                        <td>{result.isUnrecognized ? '未認識' : result.inputWord}</td>
                                        <td className={result.isCorrect ? 'judge-ok' : result.isUnrecognized ? 'judge-unrecognized' : 'judge-ng'}>
                                            {result.isCorrect ? '〇' : result.isUnrecognized ? '未認識' : '×'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {clearFailed && (
                <div className="notice mt-4">
                    <strong>履歴を削除できませんでした。</strong>
                    <br />
                    ブラウザの保存領域を確認してから、もう一度お試しください。
                </div>
            )}

            <div className="mt-4 mb-4 flex-col gap-2">
                <button onClick={exportHistory} disabled={loadFailed || history.length === 0}>全履歴をCSV出力</button>
                <button className="btn-danger" onClick={onClear} disabled={loadFailed || history.length === 0}>
                    保存済みの{history.length}件を削除
                </button>
                <button className="btn-primary" onClick={onBack}>設定へ戻る</button>
            </div>
        </div>
    );
};
