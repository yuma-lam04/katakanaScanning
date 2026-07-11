import { useState } from 'react';
import { Home } from './views/Home';
import { Setup } from './views/Setup';
import { TestRunner } from './views/TestRunner';
import { Results } from './views/Results';
import { saveResult } from './core/storage';
import type { TestConfig, TrialResult } from './types';

type View = 'home' | 'setup' | 'test' | 'results';

const DEFAULT_CONFIG: TestConfig = {
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

// Fill in a random seed when the user left it blank, so the session
// is reproducible afterwards (the seed is saved with each result)
const resolveSeed = (config: TestConfig): TestConfig => ({
  ...config,
  seed: config.seed || Math.random().toString(36).slice(2, 10),
});

function App() {
  const [view, setView] = useState<View>('setup');
  const [config, setConfig] = useState<TestConfig>(DEFAULT_CONFIG);
  // Config actually used for the running test: same as `config` but with the
  // seed resolved. Kept separate so a blank seed stays blank in the setup form
  // and the next run gets a fresh seed.
  const [runConfig, setRunConfig] = useState<TestConfig>(DEFAULT_CONFIG);
  const [sessionResults, setSessionResults] = useState<TrialResult[]>([]);
  const [isPractice, setIsPractice] = useState(false);

  const handleStartSetup = () => setView('setup');

  const handleStartTest = (newConfig: TestConfig) => {
    setConfig(newConfig);
    setRunConfig(resolveSeed(newConfig));
    setSessionResults([]);
    setIsPractice(false);
    setView('test');
  };

  const handleStartPractice = (newConfig: TestConfig) => {
    setConfig(newConfig);
    setRunConfig(resolveSeed(newConfig));
    setSessionResults([]);
    setIsPractice(true);
    setView('test');
  };

  const handleTestComplete = (results: TrialResult[]) => {
    if (isPractice) {
      alert('練習モード終了です。設定画面に戻ります。');
      setView('setup');
    } else {
      // Save here (event handler runs once) rather than in a Results effect,
      // which double-fires under StrictMode and duplicated history entries
      saveResult(results);
      setSessionResults(results);
      setView('results');
    }
  };

  const handleRestart = () => setView('setup');
  const handleHome = () => setView('setup');

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">カタカナ視認スクリーニング</h1>
        <span className="app-note">簡易チェック / 非医療</span>
      </header>
      {view === 'home' && <Home onStart={handleStartSetup} />}
      {view === 'setup' && <Setup initialConfig={config} onStart={handleStartTest} onPractice={handleStartPractice} />}
      {view === 'test' && <TestRunner config={runConfig} onComplete={handleTestComplete} onAbort={handleHome} isPractice={isPractice} />}
      {view === 'results' && <Results results={sessionResults} config={runConfig} onRestart={handleRestart} />}
    </div>
  );
}

export default App;
