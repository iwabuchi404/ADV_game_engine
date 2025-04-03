import React, { useState, useEffect ,useRef} from 'react';
import styled from 'styled-components';
import processText from '../../utils/TextProcessor';

// スタイル付きコンポーネント
const TextBoxContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1000px;
  background-color: rgba(0, 20, 40, 0.85);
  border-radius: 8px;
  padding: 1rem 2rem;
  z-index: 10;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(100, 180, 255, 0.3);
  white-space: pre-wrap;
`;

const SpeakerNameBox = styled.div`
  position: absolute;
  top: -20px;
  left: 20px;
  background-color: rgba(0, 100, 200, 0.9);
  padding: 0.3rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const SpeakerName = styled.span`
  color: white;
  font-size: 1.1rem;
`;

const TextContent = styled.div`
  color: white;
  font-size: 1rem;
  line-height: 1.6;
  margin-top: ${props => props.hasName ? '0.5rem' : '0'};
  min-height: 5rem;
  
  @media (max-width: 767px) {
    font-size: 0.9rem;
    line-height: 1.5;
    min-height: 4rem;
  }
`;

const ContinueIndicator = styled.div`
  position: absolute;
  bottom: 10px;
  right: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
`;

// テキストを一文字ずつ表示する処理のカスタムフック
const useTypewriterEffect = (text, typingSpeed = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef(null);
  const textRef = useRef('');

  const processedText = processText(text || '');
  console.log('processedText:', processedText); // デバッグ用
  // 文字を一つずつ表示する関数
  const typeNextChar = (currentText, index) => {
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
  }, [text, typingSpeed , processedText]);
  
  return { displayedText, isComplete, completeText  };
};

const TextBox = ({ 
    speaker, 
    text, 
    typingSpeed = 30 ,
    onAdvance, 
    effects = {},
    onComplete, // テキスト完了時のコールバック
    onRequestComplete // テキスト強制完了のリクエスト関数を渡すコールバック
  }) => {

  const { displayedText, isComplete, completeText  } = useTypewriterEffect(text, typingSpeed);
  
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
  
  const handleClick = () => {
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
    ...(effects?.textStyle === 'italic' && { fontStyle: 'italic' })
  };

  return (
    <TextBoxContainer className={effects?.shake ? "shake-animation" : ""} onClick={handleClick}>
      {speaker && (
        <SpeakerNameBox>
          <SpeakerName>{speaker}</SpeakerName>
        </SpeakerNameBox>
      )}
      
      <TextContent hasName={!!speaker}>
        {displayedText}
      </TextContent>
      
      {isComplete && <ContinueIndicator>▼</ContinueIndicator>}
    </TextBoxContainer>
  );
};

export default TextBox;
