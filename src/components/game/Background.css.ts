import { style, styleVariants } from '@vanilla-extract/css';

export const BackgroundWrapper = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  backgroundColor: '#000',
  transition: 'background-image 0.5s ease-in-out',
});

export const BackgroundImage = style({
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: '1', // デフォルトの不透明度
  transition: 'opacity 0.5s ease-in-out',
});
