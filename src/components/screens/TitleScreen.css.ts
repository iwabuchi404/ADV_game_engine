import { style } from '@vanilla-extract/css';

export const titleContainer = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000',
  position: 'relative',
  overflow: 'hidden',

  // 疑似要素のスタイル
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)),
          url('${process.env.NODE_ENV === 'production' ? '/ADV_game_engine/assets/images/backgrounds/title_bg.jpg' : '/assets/images/backgrounds/title_bg.jpg'}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.6,
      zIndex: 0,
    },
  },
});

export const titleContent = style({
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
  padding: '2rem',
});

export const gameTitle = style({
  fontSize: '3.5rem',
  marginBottom: '1rem',
  fontWeight: 700,
  color: '#fff',
  textShadow: '0 0 10px rgba(0, 150, 255, 0.7)',

  '@media': {
    'screen and (max-width: 767px)': {
      fontSize: '2rem',
    },
  },
});

export const subtitle = style({
  fontSize: '1.5rem',
  marginBottom: '3rem',
  fontWeight: 400,
  color: '#a0e0ff',
  textShadow: '0 0 5px rgba(0, 100, 200, 0.5)',

  '@media': {
    'screen and (max-width: 767px)': {
      fontSize: '1rem',
      marginBottom: '2rem',
    },
  },
});

export const buttonContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '300px',
  maxWidth: '100%',
  margin: 'auto',
});

export const buttonBase = style({
  backgroundColor: 'rgba(0, 100, 200, 0.7)',
  color: 'white',
  border: 'none',
  padding: '1rem 2rem',
  borderRadius: '5px',
  fontSize: '1.2rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',

  ':hover': {
    backgroundColor: 'rgba(0, 150, 255, 0.9)',
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  },

  ':active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  },

  '@media': {
    'screen and (max-width: 767px)': {
      padding: '0.8rem 1.5rem',
      fontSize: '1rem',
    },
  },
});

export const creditsButton = style({
  backgroundColor: 'rgba(50, 50, 70, 0.7)',
  color: 'white',
  border: 'none',
  padding: '1rem 2rem',
  borderRadius: '5px',
  fontSize: '1.2rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',

  ':hover': {
    backgroundColor: 'rgba(70, 70, 100, 0.9)',
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  },

  ':active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  },

  '@media': {
    'screen and (max-width: 767px)': {
      padding: '0.8rem 1.5rem',
      fontSize: '1rem',
    },
  },
});
