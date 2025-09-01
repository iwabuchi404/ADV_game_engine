import { style } from '@vanilla-extract/css';
import { BREAKPOINTS } from '../../data/config';

// コンテナ
export const configContainer = style({
  width: '100%',
  height: '100%',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(0, 20, 40, 0.9)',
  color: 'white',
  overflowY: 'auto',
});

// ヘッダーコンテナ
export const headerContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
});

// タイトル
export const title = style({
  fontSize: '1.8rem',
  color: '#a0e0ff',
  margin: 0,
  '@media': {
    [`(max-width: ${BREAKPOINTS.MOBILE}px)`]: {
      fontSize: '1.4rem',
    },
  },
});

// 閉じるボタン
export const closeButton = style({
  backgroundColor: 'rgba(100, 100, 100, 0.7)',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'rgba(150, 150, 150, 0.9)',
  },
});

// 設定セクション
export const configSection = style({
  marginBottom: '2rem',
  borderBottom: '1px solid rgba(100, 180, 255, 0.3)',
  paddingBottom: '1.5rem',
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
      marginBottom: 0,
      paddingBottom: 0,
    },
  },
});

// セクションタイトル
export const sectionTitle = style({
  fontSize: '1.3rem',
  color: '#a0e0ff',
  margin: '0 0 1rem 0',
  '@media': {
    [`(max-width: ${BREAKPOINTS.MOBILE}px)`]: {
      fontSize: '1.1rem',
    },
  },
});

// 設定行
export const settingRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',
  '@media': {
    [`(max-width: ${BREAKPOINTS.MOBILE}px)`]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.5rem',
    },
  },
});

// 設定ラベル
export const settingLabel = style({
  fontSize: '1rem',
  '@media': {
    [`(max-width: ${BREAKPOINTS.MOBILE}px)`]: {
      fontSize: '0.9rem',
    },
  },
});

// 設定コントロール
export const settingControl = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  '@media': {
    [`(max-width: ${BREAKPOINTS.MOBILE}px)`]: {
      width: '100%',
    },
  },
});

// スライダー
export const slider = style({
  width: '200px',
  '@media': {
    [`(max-width: ${BREAKPOINTS.MOBILE}px)`]: {
      width: '100%',
    },
  },
});

// トグルボタン
export const toggleButton = style({
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  minWidth: '80px',
  transition: 'background-color 0.2s',
  backgroundColor: 'rgba(70, 70, 70, 0.7)',
  ':hover': {
    backgroundColor: 'rgba(100, 100, 100, 0.9)',
  },
});

// 選択ボタン
export const selectButton = style({
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  minWidth: '80px',
  transition: 'all 0.2s',
  backgroundColor: 'rgba(30, 30, 50, 0.7)',
  border: '1px solid rgba(100, 100, 100, 0.3)',
  ':hover': {
    backgroundColor: 'rgba(50, 50, 80, 0.9)',
    borderColor: 'rgba(100, 180, 255, 0.5)',
  },
});

// ボタングループ
export const buttonGroup = style({
  display: 'flex',
  gap: '0.5rem',
  '@media': {
    [`(max-width: ${BREAKPOINTS.MOBILE}px)`]: {
      width: '100%',
      justifyContent: 'space-between',
    },
  },
});

// スライダー値
export const sliderValue = style({
  minWidth: '40px',
  textAlign: 'center',
});
