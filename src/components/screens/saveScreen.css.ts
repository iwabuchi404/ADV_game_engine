import { style, styleVariants } from '@vanilla-extract/css';

export const saveContainer = style({
  width: '100%',
  height: '100%',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000',
  position: 'relative',
});

export const saveContent = style({
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
  height: '100%',
});

export const saveTitle = style({
  fontSize: '3.5rem',
  paddingTop: '20px',
  paddingBottom: '20px',
  fontWeight: 700,
  color: '#fff',
  textShadow: '0 0 10px rgba(0, 150, 255, 0.7)',

  '@media': {
    'screen and (max-width: 767px)': {
      fontSize: '2rem',
    },
  },
});

export const closeButton = style({
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '40px',
  height: '40px',
  backgroundColor: 'rgba(0, 100, 200, 0.9)',
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: '#fff',
  textAlign: 'center',
  lineHeight: '40px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  ':after': {
    content: '"✕"',
    fontSize: '1.5rem',
    color: '#fff',
  },
});

export const saveDataList = style({
  display: 'flex',
  flexDirection: 'column',
  width: 'calc(100% - 40px)',
  height: 'calc(100% - 140px)',
  margin: 'auto',
  padding: '1rem',
  overflow: 'auto',
  scrollbarColor: 'rgba(74, 178, 253, 0.7) rgba(21, 55, 80, 0.7)',
  scrollbarWidth: 'thin',
  borderRadius: '5px',
  border: '1px solid rgba(0, 150, 255, 0.5)',
});

export const saveDataButtons = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  justifyContent: 'center',
  alignItems: 'center',
  width: '120px',
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

export const saveDataItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  color: 'white',
  borderRadius: '5px',
  border: '1px solid rgba(0, 150, 255, 0.5)',
  marginBottom: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',

  ':hover': {
    backgroundColor: 'rgba(39, 82, 112, 0.9)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  },
});

export const saveDataText = style({
  fontSize: '1.2rem',
  fontWeight: 500,
  color: 'white',
  textShadow: '0 0 5px rgba(0, 100, 200, 0.5)',
  textAlign: 'left',
  padding: '0 16px',
  width: 'calc(100% - 120px)',
});
