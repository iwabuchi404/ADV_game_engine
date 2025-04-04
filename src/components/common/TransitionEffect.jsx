import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// フェードインアニメーション
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// フェードアウトアニメーション
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

// ワイプイン（左から右）アニメーション
const wipeIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

// ワイプアウト（左から右）アニメーション
const wipeOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

// フラッシュアニメーション
const flash = keyframes`
  0% { opacity: 0; }
  10% { opacity: 1; }
  100% { opacity: 0; }
`;

// スタイル付きコンポーネント
const TransitionOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: ${(props) => (props.blocking ? 'auto' : 'none')};

  /* トランジションタイプに応じたスタイル */
  ${(props) => {
    switch (props.type) {
      case 'fade':
        return `
          background-color: black;
          animation: ${props.state === 'in' ? fadeIn : fadeOut} ${props.duration}ms ease-in-out;
        `;
      case 'wipe':
        return `
          background-color: black;
          animation: ${props.state === 'in' ? wipeIn : wipeOut} ${props.duration}ms ease-in-out;
          transform-origin: left center;
        `;
      case 'flash':
        return `
          background-color: white;
          animation: ${flash} ${props.duration}ms ease-in-out;
        `;
      default:
        return `
          background-color: black;
          animation: ${props.state === 'in' ? fadeIn : fadeOut} ${props.duration}ms ease-in-out;
        `;
    }
  }}

  opacity: ${(props) => (props.state === 'complete' ? '0' : props.opacity || '1')};
`;

/**
 * 画面遷移エフェクトコンポーネント
 * @param {Object} props - プロパティ
 * @param {string} props.type - トランジションのタイプ（'fade', 'wipe', 'flash'）
 * @param {number} props.duration - エフェクトの持続時間（ミリ秒）
 * @param {Function} props.onComplete - エフェクト完了時のコールバック
 * @param {boolean} props.blocking - ユーザー入力をブロックするかどうか
 * @param {string} props.customColor - カスタム背景色（オプション）
 */
const TransitionEffect = ({
  type = 'fade',
  duration = 500,
  onComplete = () => {},
  blocking = true,
  customColor,
  active = true,
}) => {
  // トランジションの状態（'in', 'out', 'complete'）
  const [state, setState] = useState(active ? 'in' : 'complete');

  useEffect(() => {
    if (!active) {
      setState('complete');
      return;
    }

    // トランジション開始
    setState('in');

    // 指定した時間後にフェードアウト
    const inTimeout = setTimeout(() => {
      setState('out');

      // フェードアウト後に完了状態に
      const outTimeout = setTimeout(() => {
        setState('complete');
        onComplete();
      }, duration);

      return () => clearTimeout(outTimeout);
    }, duration);

    return () => clearTimeout(inTimeout);
  }, [active, duration, onComplete]);

  // 完了状態ならレンダリングしない
  if (state === 'complete' && !active) {
    return null;
  }

  return (
    <TransitionOverlay
      type={type}
      state={state}
      duration={duration}
      blocking={blocking}
      style={customColor ? { backgroundColor: customColor } : {}}
    />
  );
};

export default TransitionEffect;
