import { style, styleVariants } from '@vanilla-extract/css';

export const QuickMenuContainer = style({
  position: 'absolute',
  zIndex: 50,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  transition: 'all 0.5s ease-in-out',
  bottom: '176px',
  left: 'calc(50% + 200px)',
  gap: '4px',
});

export const ChoiceMenuButton = style({
  backgroundColor: 'rgba(0, 30, 60, 0.85)',
  color: 'white',
  border: '1px solid rgba(100, 180, 255, 0.5)',
  borderRadius: '5px',
  padding: '8px 18px',
  fontSize: '0.8rem',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backdropFilter: 'blur(5px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  // hoverの設定
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(0, 80, 150, 0.9)',
      borderColor: 'rgba(150, 200, 255, 0.8)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
  },

  // レスポンシブ対応
  '@media': {
    '(max-width: 767px)': {
      fontSize: '0.9rem',
      padding: '10px 16px',
    },
  },
});
