import { style, styleVariants, keyframes } from '@vanilla-extract/css';

export const TextBoxContainer = style({
  position: 'absolute',
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '90%',
  maxWidth: '1200px',
  backgroundColor: 'rgba(0, 20, 40, 0.85)',
  borderRadius: '8px',
  padding: '1.2rem 2.4rem',
  zIndex: '10',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(100, 180, 255, 0.3)',
  whiteSpace: 'pre-wrap',
});

export const SpeakerNameBox = style({
  position: 'absolute',
  top: '-20px',
  left: '20px',
  backgroundColor: 'rgba(12, 104, 196, 0.77)',
  padding: '0.3rem 1rem',
  borderRadius: '5px',
  fontWeight: 'bold',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
});

export const SpeakerName = style({
  color: 'white',
  fontSize: '1.1rem',
});

export const TextContent = style({
  color: 'white',
  fontSize: '1.2rem',
  lineHeight: '1.7',
  marginTop: '0.5rem',
  minHeight: '6rem',

  '@media': {
    'screen and (max-width: 767px)': {
      fontSize: '0.9rem',
      lineHeight: '1.5',
      minHeight: '4rem',
    },
  },
});

const blinkAnimation = keyframes({
  '0%': { opacity: 0.3 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.3 },
});

export const ContinueIndicator = style({
  position: 'absolute',
  bottom: '10px',
  right: '20px',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '1.5rem',
  animation: `${blinkAnimation} 1s infinite`,
});
