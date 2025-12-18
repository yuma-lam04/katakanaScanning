import { useState } from 'react';
import './App.css';
import { Home } from './views/Home';
import { Setup } from './views/Setup';
import { TestRunner } from './views/TestRunner';
import { Results } from './views/Results';
import type { TestConfig, TrialResult } from './types';

type View = 'home' | 'setup' | 'test' | 'results';

export const DEFAULT_CONFIG: TestConfig = {
  fontFamily: 'system',
  fontSize: 32,
  letterSpacing: '0',
  contrast: 'high',
  duration: 500,
  wordLengthLevel: 'medium',
  vocabularyLevel: 'easy',
  questionCount: 10,
  inputMode: 'direct',
  seed: '',
};

function App() {
  const [view, setView] = useState<View>('setup');
  const [config, setConfig] = useState<TestConfig>(DEFAULT_CONFIG);
  const [sessionResults, setSessionResults] = useState<TrialResult[]>([]);
  const [isPractice, setIsPractice] = useState(false);

  const handleStartSetup = () => setView('setup');

  const handleStartTest = (newConfig: TestConfig) => {
    setConfig(newConfig);
    setSessionResults([]);
    setIsPractice(false);
    setView('test');
  };

  const handleStartPractice = (newConfig: TestConfig) => {
    setConfig(newConfig);
    setSessionResults([]);
    setIsPractice(true);
    setView('test');
  };

  const handleTestComplete = (results: TrialResult[]) => {
    if (isPractice) {
      alert('練習モード終了です。設定画面に戻ります。');
      setView('setup');
    } else {
      setSessionResults(results);
      setView('results');
    }
  };

  const handleRestart = () => setView('setup');
  const handleHome = () => setView('setup');

  return (
    <div className="container" style={{
      fontFamily:
        config.fontFamily === 'ud' ? 'var(--font-family-ud)' :
          config.fontFamily === 'yu-gothic' ? 'var(--font-family-yugothic)' :
            config.fontFamily === 'noto-sans-jp' ? 'var(--font-family-noto)' :
              config.fontFamily === 'ms-mincho' ? 'var(--font-family-mincho)' :
                'var(--font-family-system)',
      backgroundColor: config.contrast === 'high' ? 'var(--color-bg-high)' : (config.contrast === 'low' ? 'var(--color-bg-low)' : 'var(--color-bg-medium)'),
      color: config.contrast === 'high' ? 'var(--color-text-high)' : (config.contrast === 'low' ? 'var(--color-text-low)' : 'var(--color-text-medium)'),
    }}>
      {view === 'home' && <Home onStart={handleStartSetup} />}
      {view === 'setup' && <Setup initialConfig={config} onStart={handleStartTest} onPractice={handleStartPractice} />}
      {view === 'test' && <TestRunner config={config} onComplete={handleTestComplete} onAbort={handleHome} isPractice={isPractice} />}
      {view === 'results' && <Results results={sessionResults} config={config} onRestart={handleRestart} />}
    </div>
  );
}

export default App;
