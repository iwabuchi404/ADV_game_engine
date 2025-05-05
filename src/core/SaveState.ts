/**
 * ゲーム状態マネージャー
 * セーブデータの管理を行うクラス
 */
import { GameState } from '../types/game';

export default class SaveManager {
  private storageKey: string; // ローカルストレージのキー

  constructor() {
    // ローカルストレージのキー
    this.storageKey = 'ai-mirror-visual-novel-saves';
  }

  /**
   * ゲーム状態を保存
   * @param {number} slotId - セーブスロットID
   * @param {Object} gameState - ゲーム状態
   * @returns {boolean} 保存成功したかどうか
   */
  saveGame(slotId: number | string, gameState: GameState) {
    try {
      // セーブデータを取得
      const saves = JSON.parse(localStorage.getItem(this.storageKey) || '') || {};

      // 現在時刻を取得
      const saveDate = new Date().toISOString();

      // スロットにゲーム状態を保存
      saves[slotId] = {
        ...gameState,
        saveDate,
      };

      // ローカルストレージに保存
      localStorage.setItem(this.storageKey, JSON.stringify(saves));
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  /**
   * ゲーム状態を読み込み
   * @param {number} slotId - セーブスロットID
   * @returns {Object|null} ゲーム状態またはnull
   */
  loadGame(slotId: number | string) {
    try {
      // セーブデータを取得
      const saves = JSON.parse(localStorage.getItem(this.storageKey) || '') || {};

      // 指定されたスロットのデータを返す
      return saves[slotId] || null;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  /**
   * 自動セーブ
   * @param {Object} gameState - ゲーム状態
   * @returns {boolean} 保存成功したかどうか
   */
  autoSave(gameState: GameState) {
    return this.saveGame('auto', gameState);
  }

  /**
   * 自動セーブをロード
   * @returns {Object|null} ゲーム状態またはnull
   */
  loadAutoSave() {
    return this.loadGame('auto');
  }
}
