import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import ScenarioEngine from '../core/ScenarioEngine';
import SaveState from '../core/SaveState.ts';
import AssetLoader from '../core/AssetLoader.ts';
import { GameState, GameSettings } from '../types/game';

// GameContextの型を定義
interface GameContextType {
  gameState: GameState;
  gameSettings: GameSettings;
  scenarioEngine: ScenarioEngine;
  gameStateManager: SaveState;
  assetLoader: AssetLoader;
  loadScenario: (scenarioId: string) => Promise<boolean>;
  nextScene: () => boolean;
  selectChoice: (choiceIndex: number) => boolean;
  saveGame: (slotId: number) => boolean;
  loadGame: (slotId: number) => Promise<boolean>;
  updateGameState: (updates: Partial<GameState>) => void;
  updateProperty: <K extends keyof GameState>(property: K, value: any) => void;
  updateSettings: (newSettings: GameSettings) => void;
  setPlayerName: (name: string) => void;
  startNewGame: (scenarioId?: string, options?: { playerName: string }) => Promise<boolean>;
}

/**
 * ゲームコンテキスト
 * ゲーム全体の状態と機能を管理
 */
const GameContext = createContext<GameContextType | null>(null);

/**
 * GameProviderコンポーネント
 * アプリケーション全体でゲームの状態を提供する
 */
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ゲームエンジンのインスタンスを作成（メモ化）
  const scenarioEngine = useMemo(() => new ScenarioEngine(), []);
  const gameStateManager = useMemo(() => new SaveState(), []);
  const assetLoader = useMemo(() => new AssetLoader(), []);

  // ゲームの状態
  const [gameState, setGameState] = useState<GameState>({
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
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    textSpeed: 30, // テキスト表示速度（ms/文字）
    autoSpeed: 2000, // オート時の次のテキストまでの待ち時間（ms）
    isAutoMode: false, // オートモード
    isSkipMode: false, // スキップモード
    isFastForward: false, // 早送りモード
    showAlreadyRead: true, // 既読テキストの表示
  });

  /**
   * シナリオを読み込む
   * @param {string} scenarioId - シナリオID
   * @returns {Promise<boolean>} 読み込み成功したかどうか
   */
  const loadScenario = useCallback(
    async (scenarioId: string) => {
      setGameState((prev) => ({ ...prev, isLoading: true }));

      try {
        // シナリオを読み込む
        const loadResult = await scenarioEngine.loadScenario(scenarioId);
        if (!loadResult) {
          throw new Error(`Failed to load scenario: ${scenarioId}`);
        }

        // 初期状態を取得（型ガードを追加）
        if (typeof loadResult === 'boolean') {
          throw new Error(`Unexpected boolean result from loadScenario: ${scenarioId}`);
        }

        // 初期状態を取得
        const initialState = loadResult;

        // ゲーム状態を更新
        setGameState((prev) => {
          const newState = {
            ...prev,
            ...initialState,
            currentScene: initialState.id || scenarioId, // idがない場合はシナリオIDを使用
            isLoading: false,
            hasStarted: true,
          };
          console.log('New state being set:', newState); // デバッグ追加
          return newState;
        });
        return true;
      } catch (error) {
        console.error('Failed to load scenario:', error);
        setGameState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
    },
    [scenarioEngine]
  );

  useEffect(() => {
    if (gameState.currentScene) {
      console.log('Current scene:', gameState.currentScene);
      const currentScene = scenarioEngine.getCurrentScene(); // シーンを取得
      if (currentScene?.textBlocks) {
        currentScene?.textBlocks.forEach((textBlock) => {
          console.log('Text block:', textBlock); // デバッグ追加
          // シーンのテキストを更新
          setGameState((prev) => ({
            ...prev,
            text: currentScene?.textBlocks[0]?.text || '', // 最初のテキストブロックを表示
            speaker: currentScene?.textBlocks[0]?.speaker || '', // スピーカーを設定
            choices: currentScene?.choices || [], // 選択肢を設定
          }));
        });
      }
    }
  }, [gameState.currentScene, gameState]);

  /**
   * テキストを次に進める
   * @returns {boolean} 進行に成功したかどうか
   */
  const nextScene = useCallback(() => {
    // 選択肢がある場合は進めない
    if (gameState.choices?.length > 0) {
      return false;
    }

    // 次のシーンを取得
    const nextState = scenarioEngine.nextScene();
    console.log('Next state:', nextState); // デバッグ追加
    if (!nextState) {
      console.error('No next scene found');
      return false;
    }

    // ゲーム状態を更新
    setGameState((prev) => ({
      ...prev,
      ...nextState,
    }));
    console.log('Next scene:', nextState);
    // 自動セーブ
    gameStateManager.autoSave(gameState);

    return true;
  }, [gameState.choices, scenarioEngine, gameStateManager]);

  /**
   * 選択肢を選択
   * @param {number} choiceIndex - 選択肢のインデックス
   * @returns {boolean} 選択に成功したかどうか
   */
  const selectChoice = useCallback(
    (choiceIndex: number) => {
      const nextState = scenarioEngine.selectChoice(choiceIndex);

      if (!nextState) {
        console.error('No next state found after choice selection');
        return false;
      }

      // プレイヤーの選択を記録
      const choiceText = gameState.choices?.[choiceIndex]?.text;
      const sceneId = gameState.currentScene;

      if (!sceneId) {
        console.error('No scene ID found for choice selection');
        return false;
      }

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
      gameStateManager.autoSave(gameState);

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
    (slotId: number) => {
      try {
        return gameStateManager.saveGame(slotId, {
          ...gameState,
          variables: gameState.variables,
          flags: gameState.flags,
        });
      } catch (error) {
        console.error('Failed to save game:', error);
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
    async (slotId: number) => {
      const savedState = gameStateManager.loadGame(slotId);

      if (!savedState) {
        console.error('No saved state found for the given slot ID');
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
        scenarioEngine.setCurrentScene(savedState.scenarioId);

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
  const updateGameState = useCallback((updates: Partial<GameState>) => {
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
  const updateProperty = useCallback(<K extends keyof GameState>(property: K, value: any) => {
    setGameState((prev) => {
      // プロパティの型をチェック
      if (typeof prev[property] === 'object' && prev[property] !== null) {
        // オブジェクト型の場合はスプレッド演算子を使用
        return {
          ...prev,
          [property]: {
            ...prev[property],
            ...value,
          },
        };
      } else {
        // プリミティブ型の場合は直接値を設定
        return {
          ...prev,
          [property]: value,
        };
      }
    });
  }, []);

  /**
   * ゲーム設定を更新
   * @param {Object} newSettings - 新しい設定
   */
  const updateSettings = useCallback((newSettings: GameSettings) => {
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
    (name: string) => {
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
    async (scenarioId: string, options = { playerName: '' }) => {
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

  // GameContextの値
  const value = useMemo(
    () => ({
      gameState,
      gameSettings,
      scenarioEngine,
      gameStateManager,
      assetLoader,
      loadScenario,
      nextScene,
      selectChoice,
      saveGame,
      loadGame,
      updateGameState,
      updateProperty,
      updateSettings,
      setPlayerName,
      startNewGame,
    }),
    [
      gameState,
      gameSettings,
      scenarioEngine,
      gameStateManager,
      assetLoader,
      loadScenario,
      nextScene,
      selectChoice,
      saveGame,
      loadGame,
      updateGameState,
      updateProperty,
      updateSettings,
      setPlayerName,
      startNewGame,
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
