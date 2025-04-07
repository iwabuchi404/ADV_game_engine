import { style, styleVariants } from '@vanilla-extract/css';

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
