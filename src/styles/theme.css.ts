import { createTheme } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: {
    primary: '#0070d0',
    secondary: '#a0e0ff',
    accent: '#ff5a00',
    textPrimary: '#ffffff',
    textSecondary: '#dddddd',
    background: '#0a1020',
    backgroundLight: '#1a2a40',
    overlay: 'rgba(0, 20, 40, 0.85)',
  },
  font: {
    body: "'Noto Sans JP', sans-serif",
    display: "'M PLUS Rounded 1c', sans-serif",
  },
  space: {
    small: '4px',
    medium: '8px',
    large: '16px',
    xlarge: '24px',
    xxlarge: '32px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.5)',
    large: '0 8px 16px rgba(0, 0, 0, 0.7)',
  },
});
