import { style, keyframes, createVar } from '@vanilla-extract/css';

// CSS 変数の作成
export const durationVar = createVar();
export const easingVar = createVar();
export const colorVar = createVar();

// キーフレームアニメーションの定義
export const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

export const wipeIn = keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' },
});

export const wipeOut = keyframes({
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(100%)' },
});

export const flash = keyframes({
  '0%': { opacity: 0 },
  '10%': { opacity: 1 },
  '100%': { opacity: 0 },
});

// ベーススタイル
export const transitionOverlay = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1000,
  backgroundColor: colorVar,
  animationDuration: durationVar,
  animationTimingFunction: easingVar,
  animationFillMode: 'forwards',
});

// トランジションタイプごとのスタイル
export const fadeInStyle = style({
  backgroundColor: 'black',
  animationName: fadeIn,
});

export const fadeOutStyle = style({
  backgroundColor: 'black',
  animationName: fadeOut,
});

export const wipeInStyle = style({
  backgroundColor: 'black',
  animationName: wipeIn,
  transformOrigin: 'left center',
});

export const wipeOutStyle = style({
  backgroundColor: 'black',
  animationName: wipeOut,
  transformOrigin: 'left center',
});

export const flashStyle = style({
  backgroundColor: 'white',
  animationName: flash,
});

// ポインターイベントスタイル
export const blocking = style({
  pointerEvents: 'auto',
});

export const nonBlocking = style({
  pointerEvents: 'none',
});
