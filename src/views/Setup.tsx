import { useState, type FC } from 'react';
import type { TestConfig, VocabularyLevel, WordLengthLevel } from '../types';

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
        <div className="screen" style={{ textAlign: 'left' }}>
            <h2>測定条件</h2>

            <div className="mb-4">
                <label className="field">
                    <span className="field-label">入力モード</span>
                    <select value={config.inputMode} onChange={e => handleChange('inputMode', e.target.value as TestConfig['inputMode'])}>
                        <option value="direct">直接入力 (IME有効)</option>
                        <option value="romaji">ローマ字モード (IME無効)</option>
                    </select>
                    {config.inputMode === 'romaji' && (
                        <p className="field-hint warn">
                            ※英数字のみ許可。長音「ー」は「-」キーで入力。
                        </p>
                    )}
                </label>

                <label className="field">
                    <span className="field-label">問題数</span>
                    <select value={config.questionCount} onChange={e => handleChange('questionCount', Number(e.target.value))}>
                        <option value={5}>5問 (サクッと)</option>
                        <option value={10}>10問 (標準)</option>
                        <option value={20}>20問 (じっくり)</option>
                    </select>
                </label>

                <label className="field">
                    <span className="field-label">単語の難しさ</span>
                    <select value={config.vocabularyLevel} onChange={e => handleChange('vocabularyLevel', e.target.value as VocabularyLevel)}>
                        <option value="easy">易しい (日常単語)</option>
                        <option value="normal">普通 (ビジネス・一般)</option>
                        <option value="hard">難しい (学術・専門)</option>
                        <option value="info">情報 (IT・ネットワーク)</option>
                    </select>
                </label>

                <label className="field">
                    <span className="field-label">単語の長さ</span>
                    <select value={config.wordLengthLevel} onChange={e => handleChange('wordLengthLevel', e.target.value as WordLengthLevel)}>
                        <option value="short">短い (3-5文字)</option>
                        <option value="medium">普通 (5-7文字)</option>
                        <option value="long">長い (7-10文字)</option>
                        <option value="super-long">めちゃ長 (11文字以上)</option>
                    </select>
                </label>

                <label className="field">
                    <span className="field-label">提示時間 (フラッシュ)</span>
                    <select value={config.duration} onChange={e => handleChange('duration', Number(e.target.value) as TestConfig['duration'])}>
                        <option value={200}>短 (200ms)</option>
                        <option value={500}>中 (500ms)</option>
                        <option value={1000}>長 (1000ms)</option>
                    </select>
                </label>

                <label className="field">
                    <span className="field-label">フォント</span>
                    <select value={config.fontFamily} onChange={e => handleChange('fontFamily', e.target.value)}>
                        <option value="system">システム標準 (メイリオ/YuGothic)</option>
                        <option value="ud">UDフォント (あれば優先)</option>
                        <option value="yu-gothic">游ゴシック</option>
                        <option value="noto-sans-jp">Noto Sans JP</option>
                        <option value="ms-mincho">MS明朝</option>
                    </select>
                </label>

                <label className="field">
                    <span className="field-label">文字サイズ</span>
                    <select value={config.fontSize} onChange={e => handleChange('fontSize', Number(e.target.value))}>
                        <option value={24}>小 (24px)</option>
                        <option value={32}>中 (32px)</option>
                        <option value={40}>大 (40px)</option>
                    </select>
                </label>

                <label className="field">
                    <span className="field-label">Seed (任意)</span>
                    <input
                        type="text"
                        value={config.seed}
                        placeholder="空白でランダム"
                        onChange={e => handleChange('seed', e.target.value)}
                    />
                </label>
            </div>

            <div className="flex-row gap-2 justify-center mt-4">
                <button onClick={() => onPractice(config)}>
                    練習 (固定5問)
                </button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => onStart(config)}>
                    テスト開始
                </button>
            </div>
        </div>
    );
};
