import { style, styleVariants } from '@vanilla-extract/css';

export const menuOverlay = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 100,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backdropFilter: 'blur(5px)',
});

export const menuContainer = style({
  width: '80%',
  maxWidth: '500px',
  backgroundColor: 'rgba(10, 30, 50, 0.9)',
  borderRadius: '10px',
  padding: '2rem',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(100, 180, 255, 0.3)',
});

export const menuTitle = style({
  color: '#a0e0ff',
  fontSize: '1.8rem',
  marginBottom: '1.5rem',
  textAlign: 'center',
  textShadow: '0 0 5px rgba(0, 150, 255, 0.5)',

  '@media': {
    'screen and (max-width: 767px)': {
      fontSize: '1.4rem',
    },
  },
});

export const menuButtonsContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const menuButton = style({
  backgroundColor: 'rgba(0, 80, 150, 0.7)',
  color: 'white',
  border: 'none',
  padding: '0.8rem 1.5rem',
  borderRadius: '5px',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: 'rgba(0, 120, 200, 0.9)',
    transform: 'translateY(-2px)',
  },

  ':active': {
    transform: 'translateY(0)',
  },

  '@media': {
    'screen and (max-width: 767px)': {
      fontSize: '1rem',
      padding: '0.7rem 1.2rem',
    },
  },
});

export const closeButton = style([
  menuButton,
  {
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
    marginTop: '1rem',

    ':hover': {
      backgroundColor: 'rgba(150, 150, 150, 0.9)',
    },
  },
]);

export const warningButton = style([
  menuButton,
  {
    backgroundColor: 'rgba(150, 50, 50, 0.7)',

    ':hover': {
      backgroundColor: 'rgba(200, 70, 70, 0.9)',
    },
  },
]);

export const creditsButton = style([
  menuButton,
  {
    backgroundColor: 'rgba(50, 50, 70, 0.7)',

    ':hover': {
      backgroundColor: 'rgba(70, 70, 100, 0.9)',
    },
  },
]);

export const menuButtonVariants = styleVariants({
  default: [menuButton],
  close: [closeButton],
  warning: [warningButton],
  credits: [creditsButton],
});
