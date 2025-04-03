import React, { createContext, useContext, useState, useEffect } from 'react';

// ゲームの初期状態
const initialGameState = {
  currentScene: 'title',
  chapter: 'prologue',
  playerName: '',
  playerChoices: {},
  personalityTraits: {
    technologyView: null,    // 'tool', 'partner', 'extension'
    decisionStyle: null,     // 'principle', 'balance', 'empathy'
    changeAttitude: null,    // 'conservative', 'adaptive', 'innovative'
    pastRelationship: null,  // 'forward', 'integrated', 'preservative'
  },
  relationships: {
    trustLevel: 0,           // 信頼度: 0-100
    dependencyLevel: 0,      // 依存度: 0-100
    developmentLevel: 0,     // ミラーの感情発達レベル: 0-100
    boundaryClarity: 100,    // 境界明確度: 0-100 (高いほど境界が明確)
  },
  memoryBank: {
    reiMemories: [],         // レイに関する記憶
    caseStudies: [],         // ケース記録
    mirrorDialogues: [],     // ミラーとの対話
  },
  flags: {},                 // イベントフラグ
  saveData: [],              // セーブデータ配列
};

// コンテキスト作成
const GameContext = createContext();

// ゲームプロバイダーコンポーネント
export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(initialGameState);
  
  // ゲーム状態更新関数
  const updateGameState = (updates) => {
    setGameState(prevState => ({
      ...prevState,
      ...updates
    }));
  };
  
  // 特定のプロパティのみ更新する関数
  const updateProperty = (property, value) => {
    setGameState(prevState => ({
      ...prevState,
      [property]: {
        ...prevState[property],
        ...value
      }
    }));
  };
  
  // ゲームをロードする関数
  const loadGame = (saveData) => {
    setGameState(saveData);
  };
  
  // ゲームをリセットする関数
  const resetGame = () => {
    setGameState(initialGameState);
  };
  
  const value = {
    gameState,
    updateGameState,
    updateProperty,
    loadGame,
    resetGame
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// ゲームコンテキストを使用するためのカスタムフック
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;