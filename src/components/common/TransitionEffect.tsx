import React, { useEffect, useState, useMemo } from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import * as styles from './TransitionEffect.css';

interface TransitionEffectProps {
  type?: 'fade' | 'wipe' | 'flash';
  duration?: number;
  onComplete?: () => void;
  blocking?: boolean;
  customColor?: string;
  active?: boolean;
}

type TransitionState = 'in' | 'out' | 'complete';

const TransitionEffect: React.FC<TransitionEffectProps> = ({
  type = 'fade',
  duration = 500,
  onComplete = () => {},
  blocking = true,
  customColor,
  active = true,
}) => {
  const [state, setState] = useState<TransitionState>(active ? 'in' : 'complete');

  // トランジションスタイルの計算を純粋関数として分離
  const transitionStyle = useMemo(() => {
    if (state === 'in') {
      switch (type) {
        case 'wipe':
          return styles.wipeInStyle;
        case 'flash':
          return styles.flashStyle;
        default:
          return styles.fadeInStyle;
      }
    } else {
      switch (type) {
        case 'wipe':
          return styles.wipeOutStyle;
        case 'flash':
          return styles.flashStyle;
        default:
          return styles.fadeOutStyle;
      }
    }
  }, [state, type]);

  // CSS変数の計算もuseEffectの外に移動
  const cssVars = useMemo(
    () => ({
      [styles.durationVar]: `${duration}ms`,
      [styles.easingVar]: 'ease-in-out',
      [styles.colorVar]: customColor || (type === 'flash' ? 'white' : 'black'),
    }),
    [duration, customColor, type]
  );

  // このクラス名の計算もuseEffect外に移動
  const className = useMemo(
    () =>
      `${styles.transitionOverlay} ${transitionStyle} ${
        blocking ? styles.blocking : styles.nonBlocking
      }`,
    [transitionStyle, blocking]
  );

  // タイマー操作のみをuseEffect
  useEffect(() => {
    if (!active) {
      setState('complete');
      return;
    }

    setState('in');

    const inTimeout = setTimeout(() => {
      setState('out');

      const outTimeout = setTimeout(() => {
        setState('complete');
        onComplete();
      }, duration);

      return () => clearTimeout(outTimeout);
    }, duration);

    return () => clearTimeout(inTimeout);
  }, [active, duration, onComplete]);

  // 描画ロジックの簡素化
  if (state === 'complete' && !active) {
    return null;
  }

  return <div className={className} style={assignInlineVars(cssVars)} />;
};

export default TransitionEffect;
