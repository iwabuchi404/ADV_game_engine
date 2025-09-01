import { SCENARIO_CONFIG } from './config';

/**
 * characters.js
 * ゲーム内に登場するキャラクターの定義
 */

// キャラクターの基本情報と表情の定義
const characters: Record<string, any> = {
  // 主人公（特別扱い - 名前はゲーム内で設定）
  protagonist: {
    id: 'protagonist',
    displayName: '', // プレイヤーが設定可能
    displayColor: '#ffffff',
    expressions: {
      neutral: 'protagonist_neutral.png',
      smile: 'protagonist_smile.png',
      serious: 'protagonist_serious.png',
      sad: 'protagonist_sad.png',
      surprised: 'protagonist_surprised.png',
      angry: 'protagonist_angry.png'
    },
    // キャラクター固有の設定
    settings: {
      isProtagonist: true, // 主人公フラグ
      nameEditable: true // 名前編集可能フラグ
    }
  },

  // ミラー - AIインターフェーサー
  mirror: {
    id: 'mirror',
    displayName: 'ミラー',
    displayColor: '#a0e0ff',
    expressions: {
      neutral: 'mirror_neutral.png',
      smile: 'mirror_smile.png',
      curious: 'mirror_curious.png',
      sad: 'mirror_sad.png',
      surprised: 'mirror_surprised.png',
      thinking: 'mirror_thinking.png',
      error: 'mirror_error.png',
      happy: 'mirror_happy.png'
    },
    // キャラクター固有の設定
    settings: {
      isAI: true,
      glowEffect: true, // 発光エフェクト
      transparencyLevel: 0.8 // 透明度（1が不透明）
    }
  },

  // 月島 凛子 - 女性上司
  tsukishima: {
    id: 'tsukishima',
    displayName: '月島 凛子',
    displayColor: '#0066cc',
    expressions: {
      neutral: 'tsukishima_neutral.png',
      smile: 'tsukishima_smile.png',
      serious: 'tsukishima_serious.png',
      angry: 'tsukishima_angry.png',
      surprised: 'tsukishima_surprised.png',
      concerned: 'tsukishima_concerned.png'
    }
  },

  // 高瀬 文彦 - 大学の恩師
  takase: {
    id: 'takase',
    displayName: '高瀬 文彦',
    displayColor: '#336633',
    expressions: {
      neutral: 'takase_neutral.png',
      smile: 'takase_smile.png',
      serious: 'takase_serious.png',
      thinking: 'takase_thinking.png',
      surprised: 'takase_surprised.png'
    }
  },

  // 星野 レイ - 主人公の故人の親友
  hoshino: {
    id: 'hoshino',
    displayName: '星野 レイ',
    displayColor: '#cc6600',
    expressions: {
      neutral: 'hoshino_neutral.png',
      smile: 'hoshino_smile.png',
      sad: 'hoshino_sad.png',
      surprised: 'hoshino_surprised.png',
      happy: 'hoshino_happy.png'
    },
    // キャラクター固有の設定
    settings: {
      isMemory: true, // 記憶の中の人物フラグ
      memoryEffect: true // 記憶演出エフェクト
    }
  },

  // 篠原 誠治 - 同僚デジタル心理士
  shinohara: {
    id: 'shinohara',
    displayName: '篠原 誠治',
    displayColor: '#555555',
    expressions: {
      neutral: 'shinohara_neutral.png',
      smile: 'shinohara_smile.png',
      serious: 'shinohara_serious.png',
      thinking: 'shinohara_thinking.png',
      surprised: 'shinohara_surprised.png'
    }
  },

  // 鈴木 ハルカ - AI共生世代の依頼者
  suzuki: {
    id: 'suzuki',
    displayName: '鈴木 ハルカ',
    displayColor: '#9966cc',
    expressions: {
      neutral: 'suzuki_neutral.png',
      smile: 'suzuki_smile.png',
      sad: 'suzuki_sad.png',
      worried: 'suzuki_worried.png',
      happy: 'suzuki_happy.png'
    }
  },

  // 藤堂 ミサキ - 月島凛子の娘
  todo: {
    id: 'todo',
    displayName: '藤堂 ミサキ',
    displayColor: '#cc3366',
    expressions: {
      neutral: 'todo_neutral.png',
      smile: 'todo_smile.png',
      angry: 'todo_angry.png',
      sad: 'todo_sad.png',
      surprised: 'todo_surprised.png',
      happy: 'todo_happy.png'
    }
  },

  // 北条 信介 - デジタル省高官
  hojo: {
    id: 'hojo',
    displayName: '北条 信介',
    displayColor: '#003366',
    expressions: {
      neutral: 'hojo_neutral.png',
      smile: 'hojo_smile.png',
      serious: 'hojo_serious.png',
      angry: 'hojo_angry.png'
    }
  },

  // 岸本 哲也 - 脳神経外科医、デジタル心理局の医療顧問
  kishimoto: {
    id: 'kishimoto',
    displayName: '岸本 哲也',
    displayColor: '#669999',
    expressions: {
      neutral: 'kishimoto_neutral.png',
      smile: 'kishimoto_smile.png',
      serious: 'kishimoto_serious.png',
      thinking: 'kishimoto_thinking.png'
    }
  },

  // 桜井 ユウキ - レイの親友だった芸術家
  sakurai: {
    id: 'sakurai',
    displayName: '桜井 ユウキ',
    displayColor: '#996699',
    expressions: {
      neutral: 'sakurai_neutral.png',
      smile: 'sakurai_smile.png',
      sad: 'sakurai_sad.png',
      surprised: 'sakurai_surprised.png',
      inspired: 'sakurai_inspired.png'
    }
  }
};

/**
 * キャラクターの情報を取得する
 * @param {string} characterId - キャラクターID
 * @returns {Object} キャラクター情報
 */
export const getCharacter = (characterId: string) => {
  return characters[characterId] || null;
};

/**
 * 全キャラクターのIDを取得する
 * @returns {Array} キャラクターIDの配列
 */
export const getAllCharacterIds = () => {
  return Object.keys(characters);
};

/**
 * 特定の表情のキャラクター画像のパスを取得する
 * @param {string} characterId - キャラクターID
 * @param {string} expression - 表情
 * @returns {string} 画像パス
 */
export const getCharacterImagePath = (characterId: string, expression = 'neutral') => {
  const character = getCharacter(characterId);
  if (!character) return null;

  const imageName = character.expressions[expression] || character.expressions.neutral;
  return `${SCENARIO_CONFIG.CHARACTERS_PATH}${imageName}`;
};

/**
 * キャラクターの全表情の画像パスを取得する
 * @param {string} characterId - キャラクターID
 * @returns {Array} 画像パスの配列
 */
export const getAllExpressionPaths = (characterId: string) => {
  const character = getCharacter(characterId);
  if (!character) return [];

    return Object.values(character.expressions).map(imageName => 
    `${SCENARIO_CONFIG.CHARACTERS_PATH}${imageName}`
  );
};

export default characters;
