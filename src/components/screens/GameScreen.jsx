import React, { useState, useEffect, useRef } from 'react';
// import styled from 'styled-components';
import Background from '../game/Background';
import Character from '../game/Character';
import TextBox from '../game/TextBox';
import ChoiceMenu from '../game/ChoiceMenu';
import SystemMenu from '../ui/SystemMenu';
import { useGame } from '../../contexts/GameContext';
import { useAudio } from '../../contexts/AudioContext';

// スタイル付きコンポーネント
// const GameScreenContainer = styled.div`
//   width: 100%;
//   height: 100%;
//   position: relative;
//   overflow: hidden;
// `;

// const MenuButton = styled.button`
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   background-color: rgba(0, 0, 0, 0.5);
//   border-radius: 4px;
//   border: 1px solid rgb(51, 68, 87);
//   color: white;
//   border: none;
//   padding: 8px 16px;
//   border-radius: 4px;
//   cursor: pointer;
//   z-index: 100;

//   &:hover {
//     background-color: rgba(0, 0, 0, 0.7);
//   }
// `;

const GameScreen = ({ onBackToTitle }) => {
  // GameContextからゲーム状態と関数を取得
  const { gameState, advanceText, selectChoice, loadScenario, startNewGame } = useGame();

  const audio = useAudio();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTextComplete, setIsTextComplete] = useState(true);
  const completeTextFn = useRef(null);
  const currentBgmRef = useRef(null);

  // シーンの変更を監視してBGMとSFXを再生
  useEffect(() => {
    if (!gameState.currentScene) return;

    const playSceneAudio = async () => {
      try {
        // BGMの処理
        if (gameState.currentScene.bgm) {
          const newBgm = gameState.currentScene.bgm;
          if (newBgm !== currentBgmRef.current) {
            await audio.playBGM(newBgm, {
              fadeIn: true,
              fadeInDuration: 2000,
            });
            currentBgmRef.current = newBgm;
          }
        }

        // SFXの処理
        if (gameState.currentScene.sfx) {
          await audio.playSFX(gameState.currentScene.sfx);
        }
      } catch (error) {
        console.error('オーディオの再生に失敗しました:', error);
      }
    };

    playSceneAudio();
  }, [gameState.currentScene, audio]);

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
      startNewGame('prologue');
    }
  }, [gameState.hasStarted, startNewGame]);

  // 選択肢が選ばれたときの処理
  const handleChoiceSelected = (choice, index) => {
    console.log(`選択: ${choice.text}, インデックス: ${index}`);
    selectChoice(index);
  };

  // メニューの表示/非表示を切り替える
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // テキスト完了時のコールバック
  const handleTextComplete = () => {
    setIsTextComplete(true);
  };

  // テキスト強制完了関数を保存
  const handleRequestComplete = (completeFn) => {
    completeTextFn.current = completeFn;
  };

  // テキストの進行を管理する統合関数
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

    // テキスト完了時は次のシーンへ
    if (isTextComplete) {
      setIsTextComplete(false);
      advanceText();
    }
  };

  // 画面クリック時のハンドラ
  const handleScreenClick = () => {
    handleTextProgress();
  };

  // TextBoxコンポーネントからの進行要求
  const handleAdvance = () => {
    handleTextProgress();
  };

  return (
    <GameScreenContainer onClick={handleScreenClick}>
      <Background image={gameState.background} />

      {gameState.characters &&
        gameState.characters.map((char, index) => (
          <Character
            key={index}
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

      {gameState.choices && gameState.choices.length > 0 && (
        <ChoiceMenu
          choices={gameState.choices}
          onChoiceSelected={(choice, index) => handleChoiceSelected(choice, index)}
        />
      )}

      <MenuButton onClick={toggleMenu}>メニュー</MenuButton>

      {isMenuOpen && (
        <SystemMenu
          onSave={() => console.log('セーブ')}
          onLoad={() => console.log('ロード')}
          onConfig={() => console.log('設定')}
          onBackToTitle={onBackToTitle}
          onClose={toggleMenu}
        />
      )}
    </GameScreenContainer>
  );
};

export default GameScreen;
