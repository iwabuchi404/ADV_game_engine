import React from 'react';
import { GameProvider } from '../../contexts/GameContext';
import { AudioProvider } from '../../contexts/AudioContext';

const AppProvider = ({ children }) => {
  console.log('AppProvider rendered'); // デバッグ用
  return (
    <AudioProvider>
      <GameProvider>
        {children}
      </GameProvider>
    </AudioProvider>
  );
};

export default AppProvider;