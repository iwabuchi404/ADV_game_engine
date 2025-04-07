import React from 'react';
import TitleScreen from './components/screens/TitleScreen.tsx';
import TestScreen from './components/screens/TestScreen.jsx';
import GameScreen from './components/screens/GameScreen.tsx';
import AppProvider from './components/common/AppProvider';
import { useGame } from './contexts/GameContext.tsx';
import * as styles from './App.css';

/**
 * メインアプリケーションコンポーネント
 */
function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

/**
 * メインコンテンツ - アプリケーションのUIを表示するコンポーネント
 */
const MainContent = () => {
  // ゲームコンテキストを使用
  const { gameState, startNewGame } = useGame();

  // 現在表示する画面を選択
  const renderScreen = () => {
    if (!gameState.hasStarted) {
      return (
        <TitleScreen
          onStartGame={() => startNewGame('prologue_v2')}
          onShowCredits={() => console.log('Credit')}
        />
      );
    }

    return <GameScreen />;
    // return <TestScreen />;
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.gameContainer}>{renderScreen()}</div>
    </div>
  );
};

export default App;
