import React from 'react';
import { GameProvider } from '../../contexts/GameContext.tsx';
import { AudioProvider } from '../../contexts/AudioContext';

/**
 * アプリケーションプロバイダー
 * すべてのコンテキストを一元的に提供するためのプロバイダーコンポーネント
 */
const AppProvider = ({ children }) => {
  return (
    <AudioProvider>
      <GameProvider>{children}</GameProvider>
    </AudioProvider>
  );
};

export default AppProvider;
