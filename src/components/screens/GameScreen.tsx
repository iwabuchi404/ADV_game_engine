import React, { useState, useEffect, useRef } from 'react';
import Background from '../game/Background.tsx';
import Character from '../game/Character.tsx';
import TextBox from '../game/TextBox.tsx';
import ChoiceMenu from '../game/ChoiceMenu.tsx';
import SystemMenu from '../ui/SystemMenu.js';
import { useGame } from '../../contexts/GameContext.tsx';
import { useAudio } from '../../contexts/AudioContext.js';
import BGMPlayer from '../game/BGMPlayer.tsx';
import * as styles from './GameScreen.css.ts';

/**
 * ゲーム画面コンポーネント
 * ビジュアルノベルの主要ゲームプレイ画面を表示する
 */
const GameScreen = ({ onBackToTitle }) => {
  // GameContextからゲーム状態と関数を取得
  const { gameState, nextScene, selectChoice, loadScenario, nextTextBlock, startNewGame } =
    useGame();

  // オーディオコンテキスト
  const audio = useAudio();

  // UIの状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTextComplete, setIsTextComplete] = useState(true);
  const completeTextFn = useRef(null); // テキスト完了関数の参照
  const currentBgmRef = useRef(null); // 現在のBGMを保持する参照

  // // シーンの変更を監視してBGMとSFXを再生
  // useEffect(() => {
  //   if (!gameState.currentScene) return;
  //   if (gameState.currentScene.bgm) {
  //     // BGMが指定されている場合、BGMを再生
  //   }

  // }, [gameState.currentScene, audio]);

  //トランジション効果の適用
  useEffect(() => {
    if (!gameState.transition) return;
    //  トランジション効果がある場合、現在の背景を保存
    const previousBackground = gameState.background;
  }, [gameState.transition, gameState.isTransition]);

  // コンポーネントのクリーンアップ
  useEffect(() => {
    return () => {
      if (currentBgmRef.current) {
        audio.stopBGM();
        currentBgmRef.current = null;
      }
    };
  }, [audio]);

  // コンポーネント初期化時にシナリオを読み込む
  useEffect(() => {
    // ゲームが開始されていない場合は、シナリオを読み込む
    if (!gameState.hasStarted) {
      startNewGame('prologue_v3');
    }
  }, [gameState.hasStarted, startNewGame]);

  /**
   * 選択肢が選ばれたときの処理
   * @param {Object} choice - 選択された選択肢オブジェクト
   * @param {number} index - 選択肢のインデックス
   */
  const handleChoiceSelected = (choice, index) => {
    console.log(`選択: ${choice.text}, インデックス: ${index}`);
    selectChoice(index);
  };

  /**
   * メニューの表示/非表示を切り替える
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * テキスト完了時のコールバック
   */
  const handleTextComplete = () => {
    setIsTextComplete(true);
  };

  /**
   * テキスト強制完了関数を保存
   * @param {Function} completeFn - テキスト表示を完了させる関数
   */
  const handleRequestComplete = (completeFn) => {
    completeTextFn.current = completeFn;
  };

  /**
   * テキストの進行を管理する統合関数
   */
  const handleTextProgress = () => {
    // 選択肢表示中は何もしない
    if (gameState.choices?.length > 0) {
      return;
    }

    // メニュー表示中は閉じる
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }

    // テキスト表示中は完了させる
    if (!isTextComplete && completeTextFn.current) {
      completeTextFn.current();
      return;
    }

    // テキスト完了時は次のテキストブロックを試し、なければ次のシーンへ
    if (isTextComplete) {
      setIsTextComplete(false);
      // シーンが終了している場合は次のシーンへ
      if (!gameState.currentScene || !gameState.currentScene.textBlocks) {
        return;
      }
      if (gameState.currentTextBlockIndex >= gameState.currentScene.textBlocks.length - 1) {
        nextScene();
        return;
      }
      // そうでなければ次のテキストブロックへ
      nextTextBlock();
    }
  };

  /**
   * 画面クリック時のハンドラ
   */
  const handleScreenClick = () => {
    handleTextProgress();
  };

  /**
   * TextBoxコンポーネントからの進行要求
   */
  const handleAdvance = () => {
    handleTextProgress();
  };

  // キャラクターが存在するかチェック
  const hasCharacters =
    gameState.currentScene &&
    gameState.currentScene.characters &&
    gameState.currentScene.characters.length > 0;

  return (
    <div className={styles.gameScreen} onClick={handleScreenClick} data-img={gameState.background}>
      {/* オーディオプレイヤーコンポーネント */}
      <BGMPlayer
        bgm={gameState.currentScene?.bgm}
        isActive={gameState.hasStarted && !gameState.isLoading}
      />
      <Background
        image={gameState.currentScene.background || ''}
        transition={gameState.currentScene.transition || null}
      />

      {hasCharacters &&
        gameState.currentScene.characters.map((char, index) => (
          <Character
            key={`${char.id || char.name}-${index}`}
            id={char.id}
            name={char.name}
            image={char.image}
            position={char.position}
            expression={char.expression}
          />
        ))}

      <TextBox
        speaker={gameState.speaker}
        text={gameState.text}
        typingSpeed={30}
        onAdvance={handleAdvance}
        onComplete={handleTextComplete}
        onRequestComplete={handleRequestComplete}
      />

      {gameState.currentScene &&
        gameState.currentScene.choices &&
        gameState.currentScene.choices.length > 0 && (
          <ChoiceMenu
            choices={gameState.currentScene.choices}
            onChoiceSelected={handleChoiceSelected}
          />
        )}

      <button className={styles.menuButton.default} onClick={toggleMenu}>
        メニュー
      </button>

      {isMenuOpen && (
        <SystemMenu
          onSave={() => console.log('セーブ')}
          onLoad={() => console.log('ロード')}
          onConfig={() => console.log('設定')}
          onBackToTitle={onBackToTitle}
          onClose={toggleMenu}
        />
      )}
    </div>
  );
};

export default GameScreen;
