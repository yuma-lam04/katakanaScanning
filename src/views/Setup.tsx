import { useState, type FC } from 'react';
import type { TestConfig, VocabularyLevel } from '../types';

interface SetupProps {
    initialConfig: TestConfig;
    onStart: (config: TestConfig) => void;
    onPractice: (config: TestConfig) => void;

}

export const Setup: FC<SetupProps> = ({ initialConfig, onStart, onPractice }) => {
    const [config, setConfig] = useState<TestConfig>(initialConfig);

    const handleChange = <K extends keyof TestConfig>(key: K, value: TestConfig[K]) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="screen" style={{ textAlign: 'left', overflowY: 'auto', padding: '1rem 0' }}>
            <h2>設定</h2>

            <div className="flex-col gap-2 mb-4">
                <label>
                    <strong>入力モード:</strong><br />
                    <select value={config.inputMode} onChange={e => handleChange('inputMode', e.target.value as any)} style={{ fontSize: '1rem', padding: '0.5rem', width: '100%' }}>
                        <option value="direct">直接入力 (IME有効)</option>
                        <option value="romaji">ローマ字モード (IME無効)</option>
                    </select>
                    {config.inputMode === 'romaji' && (
                        <p className="text-small" style={{ color: '#d9534f', marginTop: '4px' }}>
                            ※英数字のみ許可。長音「ー」は「-」キーで入力。
                        </p>
                    )}
                </label>

                <label>
                    <strong>問題数:</strong><br />
                    <select value={config.questionCount} onChange={e => handleChange('questionCount', Number(e.target.value) as any)} style={{ fontSize: '1rem', padding: '0.5rem', width: '100%' }}>
                        <option value={5}>5問 (サクッと)</option>
                        <option value={10}>10問 (標準)</option>
                        <option value={20}>20問 (じっくり)</option>
                    </select>
                </label>

                <label>
                    <strong>単語の難しさ:</strong><br />
                    <select value={config.vocabularyLevel} onChange={e => handleChange('vocabularyLevel', e.target.value as VocabularyLevel)} style={{ fontSize: '1rem', padding: '0.5rem', width: '100%' }}>
                        <option value="easy">易しい (日常単語)</option>
                        <option value="normal">普通 (ビジネス・一般)</option>
                        <option value="hard">難しい (学術・専門)</option>
                        <option value="info">情報 (IT・ネットワーク)</option>
                    </select>
                </label>

                <label>
                    <strong>単語の長さ:</strong><br />
                    <select value={config.wordLengthLevel} onChange={e => handleChange('wordLengthLevel', e.target.value as any)} style={{ fontSize: '1rem', padding: '0.5rem', width: '100%' }}>
                        <option value="short">短い (3-5文字)</option>
                        <option value="medium">普通 (5-7文字)</option>
                        <option value="long">長い (7-10文字)</option>
                        <option value="super-long">めちゃ長 (11文字以上)</option>
                    </select>
                </label>

                <label>
                    <strong>提示時間 (フラッシュ):</strong><br />
                    <select value={config.duration} onChange={e => handleChange('duration', Number(e.target.value) as any)} style={{ fontSize: '1rem', padding: '0.5rem', width: '100%' }}>
                        <option value={200}>短 (200ms)</option>
                        <option value={500}>中 (500ms)</option>
                        <option value={1000}>長 (1000ms)</option>
                    </select>
                </label>

                <label>
                    <strong>フォント:</strong><br />
                    <select value={config.fontFamily} onChange={e => handleChange('fontFamily', e.target.value)} style={{ fontSize: '1rem', padding: '0.5rem', width: '100%' }}>
                        <option value="system">システム標準 (メイリオ/YuGothic)</option>
                        <option value="ud">UDフォント (あれば優先)</option>
                        <option value="yu-gothic">游ゴシック</option>
                        <option value="noto-sans-jp">Noto Sans JP</option>
                        <option value="ms-mincho">MS明朝</option>
                    </select>
                </label>

                <label>
                    <strong>文字サイズ:</strong><br />
                    <select value={config.fontSize} onChange={e => handleChange('fontSize', Number(e.target.value))} style={{ fontSize: '1rem', padding: '0.5rem', width: '100%' }}>
                        <option value={24}>小 (24px)</option>
                        <option value={32}>中 (32px)</option>
                        <option value={40}>大 (40px)</option>
                    </select>
                </label>

                <label>
                    <strong>Seed (任意):</strong><br />
                    <input
                        type="text"
                        value={config.seed}
                        placeholder="空白でランダム"
                        onChange={e => handleChange('seed', e.target.value)}
                        style={{ fontSize: '1rem', padding: '0.5rem', width: '100%' }}
                    />
                </label>
            </div>

            <div className="flex-row gap-2 justify-center mt-4">
                <button onClick={() => onPractice(config)} style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                    練習 (固定5問)
                </button>
                <button onClick={() => onStart(config)} style={{ backgroundColor: 'var(--color-primary)', color: 'white', flex: 1 }}>
                    テスト開始
                </button>
            </div>
        </div>
    );
};
