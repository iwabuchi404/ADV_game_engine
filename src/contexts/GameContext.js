import React, { createContext, useContext, useState, useEffect } from 'react';
import ScenarioEngine from '../engines/ScenarioEngine';
import GameStateManager from '../engines/GameStateManager';
import AssetLoader from '../engines/AssetLoader';

// GameContextを作成
const GameContext = createContext(null);

/**
 * GameProviderコンポーネント
 * アプリケーション全体でゲームの状態を提供する
 */
export const GameProvider = ({ children }) => {
  // ゲームエンジンのインスタンスを作成
  const [scenarioEngine] = useState(() => new ScenarioEngine());
  const [gameStateManager] = useState(() => new GameStateManager());
  const [assetLoader] = useState(() => new AssetLoader());
  
  // ゲームの状態
  const [gameState, setGameState] = useState({
    currentScene: null,
    background: null,
    bgm: null,
    characters: [],
    text: '',
    speaker: '',
    choices: [],
    isLoading: true,
    hasStarted: false
  });
  
  // ゲーム設定
  const [gameSettings, setGameSettings] = useState({
    textSpeed: 30, // テキスト表示速度（ms/文字）
    autoSpeed: 2000, // オート時の次のテキストまでの待ち時間（ms）
    isAutoMode: false, // オートモード
    isSkipMode: false, // スキップモード
    isFastForward: false, // 早送りモード
    showAlreadyRead: true // 既読テキストの表示
  });
  
  // シナリオを読み込む
  const loadScenario = async (scenarioId) => {
    setGameState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // シナリオを読み込む
      await scenarioEngine.loadScenario(scenarioId);
      
      // 初期状態を取得
      const initialState = scenarioEngine.getInitialState();
      
      // ゲーム状態を更新
      setGameState(prev => ({
        ...prev,
        ...initialState,
        isLoading: false,
        hasStarted: true
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to load scenario:', error);
      setGameState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };
  
  // テキストを次に進める
  const advanceText = () => {
    // 選択肢がある場合は進めない
    if (gameState.choices && gameState.choices.length > 0) {
      return false;
    }
    
    // 次のシーンを取得
    const nextState = scenarioEngine.advance();
    console.log('nextState', nextState);
    if (nextState) {
      // ゲーム状態を更新
      setGameState(prev => ({
        ...prev,
        ...nextState
      }));
      // 自動セーブ
      gameStateManager.autoSave({
        ...nextState,
        scenarioId: scenarioEngine.scenario?.id
      });
      console.log('gameState', gameState);
      
      return true;
    }
    
    return false;
  };
  
  // 選択肢を選択
  const selectChoice = (choiceIndex) => {
    const nextState = scenarioEngine.selectChoice(choiceIndex);
    
    if (nextState) {
      // ゲーム状態を更新
      setGameState(prev => ({
        ...prev,
        ...nextState
      }));
      
      // 自動セーブ
      gameStateManager.autoSave({
        ...nextState,
        scenarioId: scenarioEngine.scenario?.id
      });
      
      return true;
    }
    
    return false;
  };
  
  // ゲームをセーブ
  const saveGame = (slotId) => {
    return gameStateManager.saveGame(slotId, {
      ...gameState,
      gameVariables: scenarioEngine.state.variables,
      gameFlags: scenarioEngine.state.flags,
      scenarioId: scenarioEngine.scenario?.id
    });
  };
  
  // ゲームをロード
  const loadGame = async (slotId) => {
    const savedState = gameStateManager.loadGame(slotId);
    
    if (!savedState) return false;
    
    setGameState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // シナリオを読み込む
      if (savedState.scenarioId) {
        await scenarioEngine.loadScenario(savedState.scenarioId);
      }
      
      // シーンの位置を復元
      scenarioEngine.setState({
        currentScene: savedState.currentScene,
        variables: savedState.gameVariables || {},
        flags: savedState.gameFlags || {}
      });
      
      // ゲーム状態を更新
      setGameState(prev => ({
        ...prev,
        currentScene: savedState.currentScene,
        background: savedState.background,
        bgm: savedState.bgm,
        characters: savedState.characters || [],
        text: savedState.text || '',
        speaker: savedState.speaker || '',
        choices: savedState.choices || [],
        isLoading: false,
        hasStarted: true
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to load game:', error);
      setGameState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };
  
  // ゲーム設定を更新
  const updateSettings = (newSettings) => {
    setGameSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };
  
  // 新しいゲームを開始
  const startNewGame = async (scenarioId = 'prologue') => {
    // デフォルト設定に戻す
    updateSettings({
      textSpeed: 30,
      autoSpeed: 2000,
      isAutoMode: false,
      isSkipMode: false,
      isFastForward: false,
      showAlreadyRead: true
    });
    
    // シナリオを読み込む
    return await loadScenario(scenarioId);
  };
  
  // GameContextの値
  const value = {
    gameState,
    gameSettings,
    scenarioEngine,
    gameStateManager,
    assetLoader,
    loadScenario,
    advanceText,
    selectChoice,
    saveGame,
    loadGame,
    updateSettings,
    startNewGame
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

/**
 * useGameフック
 * コンポーネント内でゲームの状態を使用するためのカスタムフック
 */
export const useGame = () => {
  const context = useContext(GameContext);
  
  if (context === null) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
};

export default GameContext;
