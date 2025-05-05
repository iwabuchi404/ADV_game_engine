import React from 'react';
import TitleScreen from './components/screens/TitleScreen.tsx';
import TestScreen from './components/screens/TestScreen.jsx';
import GameScreen from './components/screens/GameScreen.tsx';
import SaveScreen from './components/screens/saveScreen.tsx';
import AppProvider from './components/common/AppProvider.tsx';
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
  const { gameState, updateGameState, startNewGame } = useGame();

  const handleBackToTitle = () => {
    // GameContextの状態を更新して画面を切り替える
    updateGameState({
      hasStarted: false,
      isLoading: false,
    });
    console.log('Back to Title Screen');
  };

  // 現在表示する画面を選択
  const renderScreen = () => {
    if (!gameState.hasStarted) {
      return (
        <TitleScreen
          onStartGame={() => startNewGame('prologue_v5')}
          onShowConfigMenu={() => console.log('ConfigMenu')}
        />
      );
    }
    if (gameState.scrennState == 'save') {
      console.log('Save Screen');
      return <SaveScreen onBackToTitle={handleBackToTitle} />;
    }
    return <GameScreen onBackToTitle={handleBackToTitle} />;
    // return <TestScreen />;
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.gameContainer}>{renderScreen()}</div>
    </div>
  );
};

export default App;
