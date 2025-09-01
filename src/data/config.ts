/**
 * config.js
 * アプリケーション全体の設定と定数を定義
 */

// ゲーム基本設定
export const GAME_CONFIG = {
  VERSION: '0.1.0',
  TITLE: 'AIの鏡像',
  SUBTITLE: 'あなたは私を映す鏡か、それとも私があなたを映す鏡か？',
  DEFAULT_TEXT_SPEED: 30, // ms/文字
  DEFAULT_AUTO_SPEED: 2000, // ms
  MAX_SAVE_SLOTS: 20,
  SCREEN_RATIO: 16 / 9
};

// ベースパスを動的に設定
const getBasePath = () => {
  // 本番環境（GitHub Pages）かどうかを判定
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    console.log('Current pathname:', pathname);
    if (pathname.includes('/ADV_game_engine')) {
      console.log('Detected GitHub Pages environment');
      return '/ADV_game_engine';
    }
  }
  console.log('Using local development environment');
  return '';
};

// シナリオ関連の設定
export const SCENARIO_CONFIG = {
  DEFAULT_SCENARIO: 'prologue',
  get SCENARIO_PATH() {
    const base = getBasePath();
    const path = `${base}/assets/scenarios/`;
    console.log('SCENARIO_PATH:', path);
    return path;
  },
  get BACKGROUNDS_PATH() {
    const base = getBasePath();
    const path = `${base}/assets/images/backgrounds/`;
    console.log('BACKGROUNDS_PATH:', path);
    return path;
  },
  get CHARACTERS_PATH() {
    const base = getBasePath();
    const path = `${base}/assets/images/characters/`;
    console.log('CHARACTERS_PATH:', path);
    return path;
  },
  get AUDIO_BGM_PATH() {
    const base = getBasePath();
    const path = `${base}/assets/audio/bgm/`;
    console.log('AUDIO_BGM_PATH:', path);
    return path;
  },
  get AUDIO_SFX_PATH() {
    const base = getBasePath();
    const path = `${base}/assets/audio/sfx/`;
    console.log('AUDIO_SFX_PATH:', path);
    return path;
  }
};

// 画面サイズのブレイクポイント
export const BREAKPOINTS = {
  MOBILE: 767,
  TABLET: 1023,
  DESKTOP: 1024
};

// テーマカラー
export const THEME_COLORS = {
  PRIMARY: '#0070d0',
  SECONDARY: '#a0e0ff',
  BACKGROUND: '#000000',
  TEXT: '#ffffff',
  TEXT_SECONDARY: '#dddddd',
  ACCENT: '#ff5a00',
  DANGER: '#d02030',
  WARNING: '#ffcc00',
  SUCCESS: '#00cc70',
  OVERLAY: 'rgba(0, 20, 40, 0.85)'
};

// ストレージキー
export const STORAGE_KEYS = {
  SAVE_DATA: 'ai-mirror-visual-novel-saves',
  SETTINGS: 'ai-mirror-visual-novel-settings',
  HISTORY: 'ai-mirror-visual-novel-history'
};

// エフェクトタイプ
export const EFFECTS = {
  TRANSITION_TYPES: [
    'fade',
    'wipe',
    'flash'
  ],
  ANIMATION_TYPES: [
    'fadeIn',
    'fadeOut',
    'slideUp',
    'slideDown',
    'zoomIn',
    'zoomOut'
  ]
};

// テキスト表示スピードプリセット
export const TEXT_SPEED_PRESETS = [
  { name: '遅い', value: 50 },
  { name: '普通', value: 30 },
  { name: '速い', value: 15 }
];

// オート表示スピードプリセット
export const AUTO_SPEED_PRESETS = [
  { name: '遅い', value: 3000 },
  { name: '普通', value: 2000 },
  { name: '速い', value: 1000 }
];

// キャラクター位置プリセット
export const CHARACTER_POSITIONS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  FAR_LEFT: 'far-left',
  FAR_RIGHT: 'far-right'
};

/**
 * 指定されたミリ秒だけ待機するPromiseを返す
 * @param {number} ms - 待機時間（ミリ秒）
 * @returns {Promise} 指定時間後に解決するPromise
 */
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * パスを結合する
 * @param {string} base - ベースパス
 * @param {string} path - 追加するパス
 * @returns {string} 結合されたパス
 */
export const joinPaths = (base: string, path: string) => {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

/**
 * フォーマットされた日付文字列を返す
 * @param {Date|string} date - 日付オブジェクトまたは日付文字列
 * @param {Object} options - フォーマットオプション
 * @returns {string} フォーマットされた日付文字列
 */
export const formatDate = (date: Date, options: any = {}) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    }).format(dateObj);
  } catch (error) {
    console.error('Date formatting error:', error);
    return String(date);
  }
};

/**
 * シャローコピーでオブジェクトをマージする
 * @param {Object} target - ターゲットオブジェクト
 * @param {Object} source - ソースオブジェクト
 * @returns {Object} マージされたオブジェクト
 */
export const mergeObjects = (target: any, source: any) => {
  return { ...target, ...source };
};
