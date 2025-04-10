import React, { useState, useEffect, useRef } from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import * as styles from './Background.css';

interface TransitionEffect {
  type?: 'fade' | 'crossFade' | 'fadeToBlack' | 'none';
  duration?: number; // ミリ秒単位
  easing?: string;
}

interface BackgroundProps {
  image: string | null;
  transition?: TransitionEffect;
}

const Background: React.FC<BackgroundProps> = ({
  image,
  transition = { type: 'fade', duration: 500, easing: 'ease-in-out' },
}) => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const processImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    return `/assets/images/backgrounds/${imageUrl}`; // 環境に合わせて調整
  };

  useEffect(() => {
    if (!image || image === currentImage) {
      // 画像が null になった場合などの処理は省略 (必要なら追加)
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setPreviousImage(null);
      setIsAnimating(false);
      console.log('Previous transition cancelled.');
    }

    const duration = transition?.duration || 500;
    const transitionType = transition?.type || 'fade';

    if (isInitialMount.current) {
      setCurrentImage(image);
      isInitialMount.current = false;
      console.log('Initial image set (no transition):', image);
    } else if (transitionType !== 'none') {
      console.log('Starting transition:', { type: transitionType, duration });
      setPreviousImage(currentImage);
      setCurrentImage(image);
      setIsAnimating(true);

      timeoutRef.current = setTimeout(() => {
        setPreviousImage(null);
        setIsAnimating(false);
        timeoutRef.current = null;
        console.log('Transition completed to:', image);
      }, duration);
    } else {
      console.log('Setting image directly (transition: none):', image);
      setPreviousImage(null);
      setCurrentImage(image);
      setIsAnimating(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [image, transition, currentImage]);

  const getTransitionStyles = () => {
    const type = transition?.type || 'fade';
    if (type === 'none' || !styles.transitionTypes[type]) {
      console.log('TransitionStyles 不明なTransitionStyles', type);
      return null;
    }
    return styles.transitionTypes[type];
  };

  const transitionStyles = getTransitionStyles();
  const duration = transition?.duration || 500;
  const easing = transition?.easing || 'ease-in-out';

  // CSS変数の定義
  const cssVars = {
    [styles.animationDurationVar]: `${duration}ms`,
    [styles.animationEasingVar]: easing,
  };

  const currentImageUrl = processImageUrl(currentImage);
  const previousImageUrl = processImageUrl(previousImage);

  useEffect(() => {
    console.log('Background render state:', {
      currentImage,
      currentImageUrl,
      previousImage,
      previousImageUrl,
      isAnimating,
    });
  }, [currentImage, currentImageUrl, previousImage, previousImageUrl, isAnimating]);

  return (
    // コンテナから assignInlineVars を削除
    <div className={styles.backgroundContainer}>
      {/* 前の背景 */}
      {previousImage && transitionStyles && (
        <div
          key={`prev-${previousImage}`}
          className={`${styles.previousBackground} ${transitionStyles.previous}`}
          style={{
            backgroundImage: `url("${previousImageUrl}")`,
            // 変数を previousBackground に適用
            ...assignInlineVars(cssVars),
          }}
        />
      )}

      {/* 現在の背景 */}
      {currentImage && (
        <div
          key={`curr-${currentImage}`}
          className={`${styles.currentBackground} ${
            // アニメーションクラスの適用条件: アニメーション中かつ前の画像が存在する場合
            isAnimating && previousImage && transitionStyles ? transitionStyles.current : ''
          }`}
          style={{
            backgroundImage: `url("${currentImageUrl}")`,
            ...assignInlineVars(cssVars),
          }}
        />
      )}
    </div>
  );
};

export default Background;
