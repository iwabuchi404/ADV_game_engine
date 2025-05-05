import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import ScenarioEngine from '../core/ScenarioEngine';
import AssetLoader from '../core/AssetLoader.ts';
import { GameState, GameSettings } from '../types/game';
import { TextBlock } from '../types/scenario.ts';
import SaveManager from '../core/SaveState.ts';

// GameContextの型を定義
interface GameContextType {
  gameState: GameState;
  gameSettings: GameSettings;
  scenarioEngine: ScenarioEngine;
  gameStateManager: any;
  assetLoader: AssetLoader;
  loadScenario: (scenarioId: string) => Promise<boolean>;
  nextScene: () => boolean;
  nextTextBlock: () => TextBlock;
  selectChoice: (choiceIndex: number) => boolean;
  saveGame: (slotId: number | string) => boolean;
  loadGame: (slotId: number | string) => Promise<boolean>;
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
  const gameStateManager = useMemo(() => new SaveManager(), []);
  const assetLoader = useMemo(() => new AssetLoader(), []);

  // ゲームの状態
  const [gameState, setGameState] = useState<GameState>({
    scrennState: 'title', // ゲームの状態（タイトル、ゲームプレイなど）
    // シナリオ情報
    scenarioId: null,
    scenario: null,
    currentSceneId: null,
    currentScene: null,
    isLoading: true, // シナリオの読み込み中かどうか
    hasStarted: false, // ゲームが開始されたかどうか
    currentTextBlocks: [], // 追加
    currentTextBlockIndex: 0, // 追加
    transition: null, // トランジション効果を追加
    isTransition: false, // トランジション中かどうかを追加

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
        const scenario = await scenarioEngine.loadScenario(scenarioId);
        if (!scenario) {
          throw new Error(`Failed to load scenario: ${scenarioId}`);
        }
        // 最初のシーンを取得
        const initialScene = scenarioEngine.getFirstScene(scenario);
        if (!initialScene) {
          throw new Error(`Scenario has no scenes: ${scenarioId}`);
        }

        // ゲーム状態を更新
        setGameState((prev) => {
          const newState = {
            ...prev,
            scenario, // シナリオ全体を保持
            scenarioId: scenarioId,
            currentScene: initialScene,
            currentSceneId: initialScene.id,
            currentTextBlockIndex: 0,
            currentTextBlocks: initialScene.textBlocks || [],
            isLoading: false,
            hasStarted: true,
          };
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

  /**
   * シーンを次に進める
   * @returns {boolean} 進行に成功したかどうか
   */
  const nextScene = useCallback(() => {
    // 選択肢がある場合は進めない
    if (
      gameState.currentScene &&
      gameState.currentScene.choices &&
      gameState.currentScene.choices?.length > 0
    ) {
      return false;
    }

    // トランジション中は操作を受け付けない
    if (gameState.isTransition) {
      console.log('トランジション中は操作を受け付けません');
      return false;
    }

    if (gameState.currentScene?.next && gameState.currentScene?.next.includes('.json')) {
      // シーンがJSONファイルを指している場合は、シナリオを読み込みする
      return loadScenario(gameState.currentScene.next.split('.json')[0]);
    }
    // 次のシーンを取得
    const nextState = scenarioEngine.getScene(
      gameState.scenario,
      gameState.currentScene?.next || ''
    );
    if (!nextState) {
      console.error('No next scene found');
      return false;
    }

    console.log('Next scene:', nextState);

    // 背景が変わる場合はトランジションを適用
    let background;
    if (gameState.currentScene?.transition) {
      background = gameState.currentScene.background;
    }

    // シーンに設定されたトランジションまたはデフォルト設定を使用
    const transition = nextState.transition || {
      type: 'fade',
      duration: 800,
      easing: 'ease-in-out',
    };

    if (background) {
      console.log('Background changed, applying transition:', transition);

      // トランジション中フラグを設定
      setGameState((prev) => ({
        ...prev,
        isTransition: true,
        transition: transition,
      }));

      // トランジションの所要時間後に完了処理
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          currentScene: nextState,
          currentSceneId: nextState.id,
          currentTextBlockIndex: 0,
          currentTextBlocks: nextState.textBlocks || [],
          isTransition: false,
        }));

        // 自動セーブはトランジション完了後に実行
        gameStateManager.autoSave({
          ...gameState,
          ...nextState,
          isTransition: false,
        });
      }, transition.duration || 800);
    } else {
      // 背景が変わらない場合は即時状態更新
      setGameState((prev) => ({
        ...prev,
        currentScene: nextState,
        currentSceneId: nextState.id,
        currentTextBlockIndex: 0,
        currentTextBlocks: nextState.textBlocks || [],
      }));
      console.log('No background change, updating state directly:', nextState, gameState);
      // 自動セーブ
      gameStateManager.autoSave({
        ...gameState,
        currentScene: nextState,
        currentSceneId: nextState.id,
        currentTextBlockIndex: 0,
        currentTextBlocks: nextState.textBlocks || [],
      });
      console.log('gameState', gameState);

      return true;
    }
  }, [
    gameState.currentScene,
    gameState.isTransition,
    gameState.currentTextBlockIndex,
    scenarioEngine,
    gameStateManager,
  ]);

  /**
   * 次のテキストブロックに進む
   * @returns {boolean} 進行に成功したかどうか
   */
  const nextTextBlock = useCallback(() => {
    // 現在のシーンのテキストブロックがある場合
    console.log('Next text block:', gameState.currentTextBlockIndex);
    if (
      !gameState.currentScene || // 現在のシーンが存在しない
      !gameState.currentScene.textBlocks || // シーンにテキストブロック配列がない
      gameState.currentScene.textBlocks.length === 0 || // テキストブロック配列が空
      typeof gameState.currentTextBlockIndex !== 'number' || // インデックスが数値でない
      gameState.currentTextBlockIndex < 0
    ) {
      console.error('No current text block index found');
      return false;
    }

    // 現在のテキストブロックインデックス
    const currentIndex = gameState.currentTextBlockIndex;
    const totalBlocksInScene = gameState.currentScene.textBlocks.length;
    // 次のテキストブロックがある場合
    console.log('Current text block index:', currentIndex, gameState.currentTextBlocks.length);
    console.log('Current text block index:', gameState.currentScene);

    if (currentIndex < totalBlocksInScene - 1) {
      // インデックスを進める
      const nextIndex = currentIndex + 1;

      // テキストとスピーカーを更新
      setGameState((prev) => ({
        ...prev,
        currentTextBlockIndex: nextIndex,
        currentTextBlocks: gameState.currentScene.textBlocks || [],
      }));

      return true;
    }
    console.log('Reached end of text blocks for this scene, proceeding to next scene.');
    // 次のテキストブロックがない場合は次のシーンに進む
    // return nextScene();
  }, [
    gameState.currentTextBlockIndex,
    gameState.currentScene, // currentScene オブジェクトの textBlocks を参照するため必要
    nextScene, // nextScene 関数自体に依存
  ]);

  /**
   * 選択肢を選択
   * @param {number} choiceIndex - 選択肢のインデックス
   * @returns {boolean} 選択に成功したかどうか
   */
  const selectChoice = useCallback(
    (choiceIndex: number) => {
      const nextSceneId = gameState.currentScene?.choices?.[choiceIndex]?.next;
      const nextScene = scenarioEngine.getScene(gameState.scenario, nextSceneId || '');

      if (!nextScene || !gameState.currentScene) {
        console.error('No next state found after choice selection');
        return false;
      }

      // プレイヤーの選択を記録
      const choiceText = gameState.currentScene.choices?.[choiceIndex]?.text;
      const sceneId = gameState.currentSceneId;

      if (!sceneId) {
        console.error('No scene ID found for choice selection');
        return false;
      }

      setGameState((prev) => ({
        ...prev,
        // playerChoices: {
        //   ...prev.playerChoices,
        //   [sceneId]: choiceText || null,
        // },
        currentScene: nextScene,
        currentSceneId: nextScene.id,
        currentTextBlockIndex: 0,
        currentTextBlocks: nextScene.textBlocks || [],
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
    (slotId: string) => {
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
    async (slotId: string) => {
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

  // デバッグ用のuseEffectフック
  useEffect(() => {
    // このログは gameState が更新され、コンポーネントが再レンダリングされた *後* に出力される
    console.log('--- GameState Updated ---');
    console.log('Current Scene ID:', gameState.currentSceneId);
    console.log('Current Scene Object:', gameState.currentScene); // オブジェクト全体も確認
    console.log('Current Text Block Index:', gameState.currentTextBlockIndex);
    console.log('Current Text Blocks:', gameState.currentTextBlocks);
    console.log('Is Transitioning:', gameState.isTransition);
    console.log('Transition Info:', gameState.transition);
    console.log('Player Name:', gameState.playerName); // 他に確認したい状態があれば追加
    console.log('-------------------------');
  }, [gameState]); // gameState オブジェクト全体を依存関係として指定
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
      nextTextBlock,
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
      nextTextBlock,
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

  // オートモード用の useEffect
  useEffect(() => {
    let autoAdvanceTimer: NodeJS.Timeout | null = null;

    // オートモードで進行する条件を確認
    const canAutoAdvance =
      gameSettings.isAutoMode && // オートモードが ON
      gameState.hasStarted && // ゲームが開始されている
      !gameState.isLoading && // ロード中でない
      !gameState.isTransition && // トランジション中でない
      gameState.currentScene && // 現在のシーンが存在する
      (!gameState.currentScene.choices || gameState.currentScene.choices.length === 0); // 選択肢が表示されていない

    if (canAutoAdvance) {
      // 設定された速度でタイマーを開始
      autoAdvanceTimer = setTimeout(() => {
        // 現在のシーンのテキストブロック数を取得 (存在しない場合は 0)
        const totalBlocksInScene = gameState.currentScene?.textBlocks?.length ?? 0;
        // 現在のインデックスが最後のテキストブロックか確認
        const isLastTextBlock = gameState.currentTextBlockIndex >= totalBlocksInScene - 1;

        if (isLastTextBlock) {
          // 最後のテキストブロックなら次のシーンへ
          nextScene();
        } else {
          // それ以外なら次のテキストブロックへ
          nextTextBlock();
        }
      }, gameSettings.autoSpeed); // gameSettings から autoSpeed を使用
    }

    // クリーンアップ関数: コンポーネントのアンマウント時や依存配列の値が変わった時にタイマーをクリア
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [
    // 依存配列: これらの値が変わると effect が再実行される
    gameSettings.isAutoMode,
    gameSettings.autoSpeed,
    gameState.hasStarted,
    gameState.isLoading,
    gameState.isTransition,
    gameState.currentScene, // シーンが変わった時
    gameState.currentTextBlockIndex, // テキストブロックが変わった時
    nextTextBlock, // effect内で使用する関数
    nextScene, // effect内で使用する関数
  ]);

  // skipモード用の useEffect
  useEffect(() => {
    let skipAdvanceTimer: NodeJS.Timeout | null = null;

    const canAutoAdvance =
      gameSettings.isSkipMode && // オートモードが ON
      gameState.hasStarted && // ゲームが開始されている
      !gameState.isLoading && // ロード中でない
      gameState.currentScene && // 現在のシーンが存在する
      (!gameState.currentScene.choices || gameState.currentScene.choices.length === 0); // 選択肢が表示されていない

    if (canAutoAdvance) {
      // 設定された速度でタイマーを開始
      skipAdvanceTimer = setTimeout(() => {
        // 現在のシーンのテキストブロック数を取得 (存在しない場合は 0)
        const totalBlocksInScene = gameState.currentScene?.textBlocks?.length ?? 0;
        // 現在のインデックスが最後のテキストブロックか確認
        const isLastTextBlock = gameState.currentTextBlockIndex >= totalBlocksInScene - 1;

        if (isLastTextBlock) {
          // 最後のテキストブロックなら次のシーンへ
          nextScene();
        } else {
          // それ以外なら次のテキストブロックへ
          nextTextBlock();
        }
      }, 200); // gameSettings から autoSpeed を使用
    }

    // クリーンアップ関数: コンポーネントのアンマウント時や依存配列の値が変わった時にタイマーをクリア
    return () => {
      if (skipAdvanceTimer) {
        clearTimeout(skipAdvanceTimer);
      }
    };
  }, [
    // 依存配列: これらの値が変わると effect が再実行される
    gameSettings.isSkipMode,
    gameState.hasStarted,
    gameState.isLoading,
    gameState.isTransition,
    gameState.currentScene, // シーンが変わった時
    gameState.currentTextBlockIndex, // テキストブロックが変わった時
    nextTextBlock, // effect内で使用する関数
    nextScene, // effect内で使用する関数
  ]);

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
