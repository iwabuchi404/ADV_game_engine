import { style } from '@vanilla-extract/css';

// コンテナ
export const saveLoadContainer = style({
  width: '100%',
  height: '100%',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(0, 20, 40, 0.9)',
  color: 'white',
  overflowY: 'auto',
});

// ヘッダーコンテナ
export const headerContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
});

// タイトル
export const title = style({
  fontSize: '1.8rem',
  color: '#a0e0ff',
  margin: 0,
  '@media': {
    '(max-width: 767px)': {
      fontSize: '1.4rem',
    },
  },
});

// 閉じるボタン
export const closeButton = style({
  backgroundColor: 'rgba(100, 100, 100, 0.7)',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'rgba(150, 150, 150, 0.9)',
  },
});

// スロットコンテナ
export const slotsContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1rem',
  '@media': {
    '(max-width: 767px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

// セーブスロット
export const saveSlot = style({
  borderRadius: '5px',
  padding: '1rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  borderStyle: 'solid',
  borderColor: 'rgba(100, 180, 255, 0.3)',
  backgroundColor: 'rgba(0, 30, 60, 0.6)',
  ':hover': {
    backgroundColor: 'rgba(0, 50, 100, 0.6)',
    borderColor: 'rgba(100, 180, 255, 0.6)',
  },
});

// スロットヘッダー
export const slotHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '0.5rem',
});

// スロットタイトル
export const slotTitle = style({
  margin: 0,
  fontSize: '1.2rem',
  color: 'white',
});

// スロット日付
export const slotDate = style({
  color: '#a0e0ff',
  fontSize: '0.8rem',
});

// スロットコンテンツ
export const slotContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

// スロット情報
export const slotInfo = style({
  fontSize: '0.9rem',
  color: '#ddd',
});

// スロットボタンコンテナ
export const slotButtons = style({
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.5rem',
});

// スロットボタン
export const slotButton = style({
  flex: 1,
  backgroundColor: 'rgba(0, 80, 150, 0.7)',
  color: 'white',
  border: 'none',
  padding: '0.5rem',
  borderRadius: '4px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: 'rgba(0, 120, 200, 0.9)',
  },
});

// 空スロットテキスト
export const emptySlotText = style({
  textAlign: 'center',
  padding: '2rem 0',
  color: '#888',
});
