import React, { useState, useEffect, useRef, useMemo } from 'react';
// import styled from 'styled-components';
import processText from '../../utils/TextProcessor.ts';
import { useGame } from '../../contexts/GameContext.tsx';
import {
  TextBoxContainer,
  SpeakerNameBox,
  SpeakerName,
  TextContent,
  ContinueIndicator,
} from './TextBox.css';

// テキストを一文字ずつ表示する処理のカスタムフック
const useTypewriterEffect = (text: string, typingSpeed = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef(null);
  const textRef = useRef('');

  const processedText = processText(text || '');
  // 文字を一つずつ表示する関数
  const typeNextChar = (currentText: string, index: number) => {
    if (index >= currentText.length) {
      setIsComplete(true);
      return;
    }

    setDisplayedText(currentText.substring(0, index + 1));

    timeoutRef.current = setTimeout(() => {
      typeNextChar(currentText, index + 1);
    }, typingSpeed);
  };

  // テキストを即座に全て表示する関数
  const completeText = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDisplayedText(textRef.current);
    setIsComplete(true);
  };

  useEffect(() => {
    // テキストが変更されたら初期化
    setDisplayedText('');
    setIsComplete(false);
    textRef.current = processedText;

    if (!text) return;

    // タイムアウトをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 最初の文字から表示開始
    typeNextChar(processedText, 0);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, typingSpeed, processedText]);

  return { displayedText, isComplete, completeText };
};

const TextBox = ({
  speaker = '',
  onAdvance = () => {},
  effects = {},
  onComplete = () => {}, // テキスト完了時のコールバック
  onRequestComplete = () => {}, // テキスト強制完了のリクエスト関数を渡すコールバック
}) => {
  const { gameState, gameSettings } = useGame();

  // gameState から現在のテキストブロックを取得
  const currentBlock = useMemo(() => {
    if (
      gameState.currentTextBlocks &&
      gameState.currentTextBlocks.length > gameState.currentTextBlockIndex
    ) {
      return gameState.currentTextBlocks[gameState.currentTextBlockIndex];
    }
    return null; // 対応するブロックがない場合は null
  }, [gameState.currentTextBlocks, gameState.currentTextBlockIndex]);

  // 現在のテキストとスピーカーを抽出 (存在しない場合のフォールバック)
  const currentText = currentBlock?.text || '';
  const currentSpeaker = currentBlock?.speaker || null;
  // typingSpeed を gameSettings から取得 (プロップより優先する場合は調整)
  const typingSpeed = gameSettings.textSpeed || 30;

  const { displayedText, isComplete, completeText } = useTypewriterEffect(currentText, typingSpeed);

  // テキスト完了時にコールバック
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  // 強制完了関数を親に提供
  useEffect(() => {
    if (onRequestComplete) {
      onRequestComplete(completeText);
    }
  }, [completeText, onRequestComplete]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isComplete) {
      // テキストが完全に表示されていない場合は、即座に全テキストを表示
      completeText();
    } else {
      // テキストが完全に表示されている場合は、次に進む
      if (onAdvance) {
        onAdvance();
      }
    }
  };

  // テキストのスタイルを適用
  const textStyle = {
    ...(effects?.textColor && { color: effects.textColor }),
    ...(effects?.textSize && { fontSize: `${effects.textSize}em` }),
    ...(effects?.textStyle === 'bold' && { fontWeight: 'bold' }),
    ...(effects?.textStyle === 'italic' && { fontStyle: 'italic' }),
  };

  return (
    <div
      className={`${TextBoxContainer} ${effects?.shake ? 'shake-animation' : ''}`}
      onClick={handleClick}
    >
      {speaker && (
        <div className={SpeakerNameBox}>
          <div className={SpeakerName}>{currentSpeaker}</div>
        </div>
      )}

      <div className={TextContent}>{displayedText}</div>

      {isComplete && <div className={ContinueIndicator}>▼</div>}
    </div>
  );
};

export default TextBox;
