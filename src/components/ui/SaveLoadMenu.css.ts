import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

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
export const saveSlot = recipe({
  base: {
    borderRadius: '5px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  variants: {
    isEmpty: {
      true: {
        borderStyle: 'dashed',
        borderColor: 'rgba(100, 180, 255, 0.3)',
        backgroundColor: 'rgba(30, 30, 40, 0.6)',
        ':hover': {
          backgroundColor: 'rgba(40, 40, 60, 0.6)',
        },
      },
      false: {
        borderStyle: 'solid',
        borderColor: 'rgba(100, 180, 255, 0.3)',
        backgroundColor: 'rgba(0, 30, 60, 0.6)',
        ':hover': {
          backgroundColor: 'rgba(0, 50, 100, 0.6)',
          borderColor: 'rgba(100, 180, 255, 0.6)',
        },
      },
    },
    isSelected: {
      true: {
        borderColor: '#a0e0ff',
        backgroundColor: 'rgba(0, 50, 100, 0.6)',
      },
      false: {
        // デフォルトスタイルはbaseで定義済み
      },
    },
  },
  defaultVariants: {
    isEmpty: false,
    isSelected: false,
  },
});

// スロットヘッダー
export const slotHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '0.5rem',
});

// スロットタイトル
export const slotTitle = recipe({
  base: {
    margin: 0,
    fontSize: '1.2rem',
  },
  variants: {
    isEmpty: {
      true: { color: '#888' },
      false: { color: 'white' },
    },
  },
  defaultVariants: {
    isEmpty: false,
  },
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
export const slotInfo = recipe({
  base: {
    fontSize: '0.9rem',
  },
  variants: {
    isEmpty: {
      true: { color: '#888' },
      false: { color: '#ddd' },
    },
  },
  defaultVariants: {
    isEmpty: false,
  },
});

// スロットボタンコンテナ
export const slotButtons = style({
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.5rem',
});

// スロットボタン
export const slotButton = recipe({
  base: {
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
  },
  variants: {
    isDisabled: {
      true: {
        backgroundColor: 'rgba(70, 70, 70, 0.5)',
        cursor: 'not-allowed',
        ':hover': {
          backgroundColor: 'rgba(70, 70, 70, 0.5)',
        },
      },
      false: {},
    },
    isDelete: {
      true: {
        backgroundColor: 'rgba(150, 50, 50, 0.7)',
        ':hover': {
          backgroundColor: 'rgba(200, 70, 70, 0.9)',
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    isDisabled: false,
    isDelete: false,
  },
});

// 空スロットテキスト
export const emptySlotText = style({
  textAlign: 'center',
  padding: '2rem 0',
  color: '#888',
});
