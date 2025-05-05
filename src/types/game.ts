import {
  TransitionEffect,
  Scene,
  Character,
  Choice,
  BgmInstruction,
  Scenario,
  TextBlock,
} from './scenario';

export interface GameState {
  scrennState: 'title' | 'game' | 'save' | 'load' | 'config';
  scenarioId: string | null;
  scenario: Scenario | null;
  currentScene: Scene | null;
  currentSceneId: string | null;
  isLoading: boolean;
  hasStarted: boolean;
  currentTextBlocks: TextBlock[];
  currentTextBlockIndex: number;
  transition?: TransitionEffect | null;
  isTransition: boolean;

  // プレイヤー情報
  playerName: string;
  playerChoices: Record<string, { index: number; text: string }>;

  // パーソナリティ特性
  personalityTraits: PersonalityTraits;

  // 関係性パラメータ
  relationships: Relationships;

  // 記憶バンク
  memoryBank: MemoryBank;

  // イベントフラグと変数
  flags: Record<string, boolean>;
  variables: Record<string, number>;
}

export interface GameSettings {
  textSpeed: number; // テキスト表示速度（ms/文字）
  autoSpeed: number; // オート時の次のテキストまでの待ち時間（ms）
  isAutoMode: boolean; // オートモード
  isSkipMode: boolean; // スキップモード
  isFastForward: boolean; // 早送りモード
  showAlreadyRead: boolean; // 既読テキストの表示
}

export interface PersonalityTraits {
  technologyView: 'tool' | 'partner' | 'extension' | null;
  decisionStyle: 'principle' | 'balance' | 'empathy' | null;
  changeAttitude: 'conservative' | 'adaptive' | 'innovative' | null;
  pastRelationship: 'forward' | 'integrated' | 'preservative' | null;
}

export interface Relationships {
  trustLevel: number;
  dependencyLevel: number;
  developmentLevel: number;
  boundaryClarity: number;
}

export interface MemoryBank {
  reiMemories: Memory[];
  caseStudies: Memory[];
  mirrorDialogues: Memory[];
}

export interface Memory {
  id: string;
  type: 'event' | 'dialogue' | 'choice';
  content: string;
  timestamp: number;
  tags: string[];
  emotionalImpact: number;
}
