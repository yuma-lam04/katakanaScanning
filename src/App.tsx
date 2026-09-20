import { useState } from 'react';
import { Home } from './views/Home';
import { Setup } from './views/Setup';
import { TestRunner } from './views/TestRunner';
import { Results } from './views/Results';
import { History } from './views/History';
import { clearHistory, loadHistory, saveResult } from './core/storage';
import type { TestConfig, TrialResult } from './types';

type View = 'home' | 'setup' | 'test' | 'results' | 'history';

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

const resolveSeed = (config: TestConfig): TestConfig => ({
  ...config,
  seed: config.seed || Math.random().toString(36).slice(2, 10),
});

function App() {
  const [view, setView] = useState<View>('home');
  const [config, setConfig] = useState<TestConfig>(DEFAULT_CONFIG);
  const [runConfig, setRunConfig] = useState<TestConfig>(DEFAULT_CONFIG);
  const [sessionResults, setSessionResults] = useState<TrialResult[]>([]);
  const [historySaveFailed, setHistorySaveFailed] = useState(false);
  const [historyResults, setHistoryResults] = useState<TrialResult[]>([]);
  const [historyLoadFailed, setHistoryLoadFailed] = useState(false);
  const [historyClearFailed, setHistoryClearFailed] = useState(false);
  const [isPractice, setIsPractice] = useState(false);

  const handleStartSetup = () => setView('setup');

  const handleStartTest = (newConfig: TestConfig) => {
    setConfig(newConfig);
    setRunConfig(resolveSeed(newConfig));
    setSessionResults([]);
    setHistorySaveFailed(false);
    setIsPractice(false);
    setView('test');
  };

  const handleStartPractice = (newConfig: TestConfig) => {
    setConfig(newConfig);
    setRunConfig(resolveSeed(newConfig));
    setSessionResults([]);
    setHistorySaveFailed(false);
    setIsPractice(true);
    setView('test');
  };

  const handleTestComplete = (results: TrialResult[]) => {
    if (isPractice) {
      alert('練習モード終了です。設定画面に戻ります。');
      setView('setup');
    } else {
      const saved = saveResult(results);
      setSessionResults(results);
      setHistorySaveFailed(!saved);
      setView('results');
    }
  };

  const handleRestart = () => setView('setup');
  const handleHome = () => setView('setup');
  const handleOpenHistory = () => {
    const { history, success } = loadHistory();
    setHistoryResults(history);
    setHistoryLoadFailed(!success);
    setHistoryClearFailed(false);
    setView('history');
  };
  const handleClearHistory = () => {
    if (!window.confirm(`保存済みの${historyResults.length}件をすべて削除します。元に戻せません。`)) return;

    const cleared = clearHistory();
    setHistoryClearFailed(!cleared);
    if (cleared) setHistoryResults([]);
  };

  return (
    <div className="container">
        <header className="app-header">
          <h1 className="app-title">カタカナ視認スクリーニング</h1>
        </header>
      {view === 'home' && <Home onStart={handleStartSetup} />}
      {view === 'setup' && <Setup initialConfig={config} onStart={handleStartTest} onPractice={handleStartPractice} onHistory={handleOpenHistory} />}
      {view === 'test' && <TestRunner config={runConfig} onComplete={handleTestComplete} onAbort={handleHome} isPractice={isPractice} />}
      {view === 'results' && (
        <Results
          results={sessionResults}
          historySaveFailed={historySaveFailed}
          onRestart={handleRestart}
        />
      )}
      {view === 'history' && (
        <History
          history={historyResults}
          loadFailed={historyLoadFailed}
          clearFailed={historyClearFailed}
          onClear={handleClearHistory}
          onBack={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
