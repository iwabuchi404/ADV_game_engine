import { style } from '@vanilla-extract/css';

export const CharacterContainer = style({
  position: 'absolute',
  bottom: 0,
  zIndex: 5,
  height: '90%',
  maxHeight: '90vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  transition: 'all 0.5s ease-in-out',
});

export const CharacterImage = style({
  maxHeight: '100%',
  maxWidth: '100%',
  objectFit: 'contain',
  filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))',
});

export const ChoiceMenuContainer = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '600px',
  zIndex: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const ChoiceButton = style({
  backgroundColor: 'rgba(0, 30, 60, 0.85)',
  color: 'white',
  border: '1px solid rgba(100, 180, 255, 0.5)',
  borderRadius: '5px',
  padding: '1rem 2rem',
  // padding: '12px 20px',
  fontSize: '1.2rem',
  textAlign: 'left',
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
