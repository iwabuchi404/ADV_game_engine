// Background.css.ts の修正
import { style, keyframes, createVar } from '@vanilla-extract/css';

// アニメーション時間とイージング関数の変数
export const animationDurationVar = createVar();
export const animationEasingVar = createVar();

// キーフレーム定義
const fadeInKeyframes = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const fadeOutKeyframes = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

// 基本コンテナ
export const backgroundContainer = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: '#000', // デフォルトの背景色（必要に応じて）
  // zIndex は子要素で管理するため、ここでは不要
});

// 背景共通スタイル
const backgroundBase = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  // アニメーションの共通設定を変数経由で行う
  animationDuration: animationDurationVar,
  animationTimingFunction: animationEasingVar,
  animationFillMode: 'forwards', // アニメーション終了時の状態を維持
  willChange: 'opacity', // ブラウザに最適化のヒントを与える
});

// 現在の背景
export const currentBackground = style([
  backgroundBase,
  {
    zIndex: 2, // 手前に表示
    opacity: 1, // 通常状態（アニメーションがない場合）は不透明
  },
]);

// 前の背景
export const previousBackground = style([
  backgroundBase,
  {
    zIndex: 1, // 奥に表示
    opacity: 0, // アニメーション終了後は透明になる (fadeOut + forwards)
  },
]);

// transitionActive スタイルは削除

// アニメーションスタイル (animationName のみを指定)
const fadeInAnimation = style({
  animationName: fadeInKeyframes,
  // opacity: 0; // キーフレームの 0% で指定されているため、ここで初期値を設定する必要はない
});

const fadeOutAnimation = style({
  animationName: fadeOutKeyframes,
  // opacity: 1; // キーフレームの 0% で指定されているため、ここで初期値を設定する必要はない
});

// トランジション用クラス (変更なし)
export const transitionTypes = {
  fade: {
    current: fadeInAnimation,
    previous: fadeOutAnimation,
  },
  crossFade: {
    // fade と同じ効果になる
    current: fadeInAnimation,
    previous: fadeOutAnimation,
  },
  fadeToBlack: {
    // これを実現するには異なるアニメーション/ロジックが必要
    current: fadeInAnimation,
    previous: fadeOutAnimation,
  },
};
