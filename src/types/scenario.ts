export interface Scenario {
  id: string;
  title: string;
  scenes: Scene[];
}

export interface Scene {
  id: string;
  background?: string;
  bgm?: string | BgmInstruction;
  sfx?: string;
  characters?: Character[];
  textBlocks?: TextBlock[]; // dialogの代わりにtextBlocksを使用
  choices?: Choice[];
  next?: string;
}

export interface Character {
  name: string;
  position: 'left' | 'center' | 'right';
  expression?: string;
}

export interface TextBlock {
  speaker: string;
  text: string;
  expression?: string; // キャラクターの表情変更
  sfx?: string; // テキストブロック固有の効果音
}

export interface Choice {
  text: string;
  next: string;
  effects?: Effect[];
}

export type Effect = SetVariableEffect | SetFlagEffect;

export interface SetVariableEffect {
  type: 'setVariable';
  name: string;
  value: number;
}

export interface SetFlagEffect {
  type: 'setFlag';
  name: string;
  value: boolean;
}

export type BgmInstruction =
  | string
  | { track: string; volume?: number; fadeIn?: number; loop?: boolean }
  | { stop: true }
  | { continue: true };
