import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import ScenarioEngine from '../engines/ScenarioEngine';
import GameStateManager from '../engines/GameStateManager';
import AssetLoader from '../engines/AssetLoader';

/**
 * ゲームコンテキスト
 * ゲーム全体の状態と機能を管理
 */
const GameContext = createContext(null);

/**
 * GameProviderコンポーネント
 * アプリケーション全体でゲームの状態を提供する
 */
export const GameProvider = ({ children }) => {
  // ゲームエンジンのインスタンスを作成（メモ化）
  const scenarioEngine = useMemo(() => new ScenarioEngine(), []);
  const gameStateManager = useMemo(() => new GameStateManager(), []);
  const assetLoader = useMemo(() => new AssetLoader(), []);

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
    hasStarted: false,

    // プレイヤー情報
    playerName: '',
    playerChoices: {},

    // パーソナリティ特性
    personalityTraits: {
      technologyView: null, // 'tool', 'partner', 'extension'
      decisionStyle: null, // 'principle', 'balance', 'empathy'
      changeAttitude: null, // 'conservative', 'adaptive', 'innovative'
      pastRelationship: null, // 'forward', 'integrated', 'preservative'
    },

    // 関係性パラメータ
    relationships: {
      trustLevel: 0, // 信頼度: 0-100
      dependencyLevel: 0, // 依存度: 0-100
      developmentLevel: 0, // ミラーの感情発達レベル: 0-100
      boundaryClarity: 100, // 境界明確度: 0-100 (高いほど境界が明確)
    },

    // 記憶バンク
    memoryBank: {
      reiMemories: [], // レイに関する記憶
      caseStudies: [], // ケース記録
      mirrorDialogues: [], // ミラーとの対話
    },

    // イベントフラグと変数
    flags: {},
    variables: {},
  });

  // ゲーム設定
  const [gameSettings, setGameSettings] = useState({
    textSpeed: 30, // テキスト表示速度（ms/文字）
    autoSpeed: 2000, // オート時の次のテキストまでの待ち時間（ms）
    isAutoMode: false, // オートモード
    isSkipMode: false, // スキップモード
    isFastForward: false, // 早送りモード
    showAlreadyRead: true, // 既読テキストの表示
  });

  // エラー状態の管理
  const [error, setError] = useState(null);

  /**
   * シナリオを読み込む
   * @param {string} scenarioId - シナリオID
   * @returns {Promise<boolean>} 読み込み成功したかどうか
   */
  const loadScenario = useCallback(
    async (scenarioId) => {
      setGameState((prev) => ({ ...prev, isLoading: true }));
      setError(null);

      try {
        // シナリオを読み込む
        const loadResult = await scenarioEngine.loadScenario(scenarioId);
        if (!loadResult) {
          throw new Error(`Failed to load scenario: ${scenarioId}`);
        }

        // 初期状態を取得
        const initialState = scenarioEngine.getInitialState();

        // ゲーム状態を更新
        setGameState((prev) => ({
          ...prev,
          ...initialState,
          isLoading: false,
          hasStarted: true,
        }));

        return true;
      } catch (error) {
        console.error('Failed to load scenario:', error);
        setError(`シナリオの読み込みに失敗しました: ${error.message}`);
        setGameState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
    },
    [scenarioEngine]
  );

  /**
   * テキストを次に進める
   * @returns {boolean} 進行に成功したかどうか
   */
  const advanceText = useCallback(() => {
    setError(null);

    // 選択肢がある場合は進めない
    if (gameState.choices && gameState.choices.length > 0) {
      return false;
    }

    // 次のシーンを取得
    const nextState = scenarioEngine.advance();

    if (!nextState) {
      return false;
    }

    // エラーチェック
    if (nextState.error) {
      setError(nextState.error);
      return false;
    }

    // ゲーム状態を更新
    setGameState((prev) => ({
      ...prev,
      ...nextState,
    }));

    // 自動セーブ
    gameStateManager.autoSave({
      ...nextState,
      scenarioId: scenarioEngine.scenario?.id,
      variables: scenarioEngine.state.variables,
      flags: scenarioEngine.state.flags,
    });

    return true;
  }, [gameState.choices, scenarioEngine, gameStateManager]);

  /**
   * 選択肢を選択
   * @param {number} choiceIndex - 選択肢のインデックス
   * @returns {boolean} 選択に成功したかどうか
   */
  const selectChoice = useCallback(
    (choiceIndex) => {
      setError(null);

      const nextState = scenarioEngine.selectChoice(choiceIndex);

      if (!nextState) {
        return false;
      }

      // エラーチェック
      if (nextState.error) {
        setError(nextState.error);
        return false;
      }

      // プレイヤーの選択を記録
      const choiceText = gameState.choices?.[choiceIndex]?.text;
      const sceneId = gameState.currentScene;

      // ゲーム状態を更新
      setGameState((prev) => ({
        ...prev,
        ...nextState,
        playerChoices: {
          ...prev.playerChoices,
          [sceneId]: { index: choiceIndex, text: choiceText },
        },
      }));

      // 自動セーブ
      gameStateManager.autoSave({
        ...nextState,
        scenarioId: scenarioEngine.scenario?.id,
        variables: scenarioEngine.state.variables,
        flags: scenarioEngine.state.flags,
        playerChoices: {
          ...gameState.playerChoices,
          [sceneId]: { index: choiceIndex, text: choiceText },
        },
      });

      return true;
    },
    [gameState, scenarioEngine, gameStateManager]
  );

  /**
   * ゲームをセーブ
   * @param {string} slotId - セーブスロットID
   * @returns {boolean} セーブに成功したかどうか
   */
  const saveGame = useCallback(
    (slotId) => {
      setError(null);

      try {
        return gameStateManager.saveGame(slotId, {
          ...gameState,
          scenarioId: scenarioEngine.scenario?.id,
          variables: scenarioEngine.state.variables,
          flags: scenarioEngine.state.flags,
        });
      } catch (error) {
        console.error('Failed to save game:', error);
        setError(`ゲームの保存に失敗しました: ${error.message}`);
        return false;
      }
    },
    [gameState, scenarioEngine, gameStateManager]
  );

  /**
   * ゲームをロード
   * @param {string} slotId - セーブスロットID
   * @returns {Promise<boolean>} ロードに成功したかどうか
   */
  const loadGame = useCallback(
    async (slotId) => {
      setError(null);
      const savedState = gameStateManager.loadGame(slotId);

      if (!savedState) {
        setError('セーブデータが見つかりませんでした');
        return false;
      }

      setGameState((prev) => ({ ...prev, isLoading: true }));

      try {
        // シナリオを読み込む
        if (savedState.scenarioId) {
          await scenarioEngine.loadScenario(savedState.scenarioId);
        } else {
          throw new Error('セーブデータにシナリオIDがありません');
        }

        // シーンの位置とゲーム状態を復元
        scenarioEngine.setState({
          currentScene: savedState.currentScene,
          variables: savedState.variables || {},
          flags: savedState.flags || {},
        });

        // ゲーム状態を更新
        setGameState((prev) => ({
          ...prev,
          ...savedState,
          isLoading: false,
          hasStarted: true,
        }));

        return true;
      } catch (error) {
        console.error('Failed to load game:', error);
        setError(`ゲームの読み込みに失敗しました: ${error.message}`);
        setGameState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
    },
    [scenarioEngine, gameStateManager]
  );

  /**
   * ゲーム状態を更新
   * @param {Object} updates - 更新するプロパティと値
   */
  const updateGameState = useCallback((updates) => {
    setGameState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  /**
   * 特定のプロパティの一部を更新
   * @param {string} property - 更新するプロパティ名
   * @param {Object} value - 更新する値
   */
  const updateProperty = useCallback((property, value) => {
    setGameState((prev) => ({
      ...prev,
      [property]: {
        ...prev[property],
        ...value,
      },
    }));
  }, []);

  /**
   * ゲーム設定を更新
   * @param {Object} newSettings - 新しい設定
   */
  const updateSettings = useCallback((newSettings) => {
    setGameSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  /**
   * プレイヤー名を設定
   * @param {string} name - プレイヤー名
   */
  const setPlayerName = useCallback(
    (name) => {
      updateGameState({ playerName: name });
    },
    [updateGameState]
  );

  /**
   * 新しいゲームを開始
   * @param {string} scenarioId - シナリオID
   * @param {Object} options - 開始オプション
   * @returns {Promise<boolean>} 開始に成功したかどうか
   */
  const startNewGame = useCallback(
    async (scenarioId = 'prologue', options = {}) => {
      const { playerName = '' } = options;

      // デフォルト設定に戻す
      updateSettings({
        textSpeed: 30,
        autoSpeed: 2000,
        isAutoMode: false,
        isSkipMode: false,
        isFastForward: false,
        showAlreadyRead: true,
      });

      // プレイヤー情報を初期化
      updateGameState({
        playerName,
        playerChoices: {},
        personalityTraits: {
          technologyView: null,
          decisionStyle: null,
          changeAttitude: null,
          pastRelationship: null,
        },
        relationships: {
          trustLevel: 0,
          dependencyLevel: 0,
          developmentLevel: 0,
          boundaryClarity: 100,
        },
        memoryBank: {
          reiMemories: [],
          caseStudies: [],
          mirrorDialogues: [],
        },
        flags: {},
        variables: {},
      });

      // シナリオを読み込む
      return await loadScenario(scenarioId);
    },
    [updateSettings, updateGameState, loadScenario]
  );

  /**
   * エラー状態をクリア
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // GameContextの値
  const value = useMemo(
    () => ({
      gameState,
      gameSettings,
      scenarioEngine,
      gameStateManager,
      assetLoader,
      error,
      loadScenario,
      advanceText,
      selectChoice,
      saveGame,
      loadGame,
      updateGameState,
      updateProperty,
      updateSettings,
      setPlayerName,
      startNewGame,
      clearError,
    }),
    [
      gameState,
      gameSettings,
      scenarioEngine,
      gameStateManager,
      assetLoader,
      error,
      loadScenario,
      advanceText,
      selectChoice,
      saveGame,
      loadGame,
      updateGameState,
      updateProperty,
      updateSettings,
      setPlayerName,
      startNewGame,
      clearError,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
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
