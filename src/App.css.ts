// styles/App.css.ts
import { style } from '@vanilla-extract/css';

export const appContainer = style({
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#111',
  overflow: 'hidden',
});

export const gameContainer = style({
  width: '100%',
  height: '100%',
  maxWidth: '1920px',
  maxHeight: '1080px',
  position: 'relative',
  aspectRatio: '16 / 9',

  '@media': {
    'screen and (max-width: 767px)': {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  },
});
