import React from 'react';
import styled from 'styled-components';
import TitleScreen from './components/screens/TitleScreen';
import GameScreen from './components/screens/GameScreen';
import CreditsScreen from './components/screens/CreditsScreen';
import AppProvider from './components/common/AppProvider';
import { useGame } from './contexts/GameContext';

// スタイル付きコンポーネント
const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #111;
  overflow: hidden;
`;

const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1280px;
  max-height: 720px;
  position: relative;
  aspect-ratio: 16 / 9;
  
  @media (max-width: 767px) {
    max-width: 100%;
    max-height: 100%;
  }
`;

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
      return <TitleScreen onStartGame={() => startNewGame('prologue')} />;
    }
    
    return <GameScreen />;
  };
  
  return (
    <AppContainer>
      <GameContainer>
        {renderScreen()}
      </GameContainer>
    </AppContainer>
  );
};

export default App;