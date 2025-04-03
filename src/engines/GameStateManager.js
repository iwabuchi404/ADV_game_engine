/**
 * ゲーム状態マネージャー
 * セーブデータの管理を行うクラス
 */
class GameStateManager {
  constructor() {
    // ローカルストレージのキー
    this.storageKey = 'ai-mirror-visual-novel-saves';
  }

  /**
   * ゲーム状態を保存
   * @param {string} slotId - セーブスロットID
   * @param {Object} gameState - ゲーム状態
   * @returns {boolean} 保存成功したかどうか
   */
  saveGame(slotId, gameState) {
    try {
      // 既存のセーブデータを取得
      const saves = JSON.parse(localStorage.getItem(this.storageKey)) || {};
      
      // 現在時刻を取得
      const saveDate = new Date().toISOString();
      
      // スロットにゲーム状態を保存
      saves[slotId] = {
        ...gameState,
        saveDate
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
   * @param {string} slotId - セーブスロットID
   * @returns {Object|null} ゲーム状態またはnull
   */
  loadGame(slotId) {
    try {
      // セーブデータを取得
      const saves = JSON.parse(localStorage.getItem(this.storageKey)) || {};
      
      // 指定されたスロットのデータを返す
      return saves[slotId] || null;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  /**
   * 全セーブスロットのメタデータを取得
   * @returns {Array} セーブスロットのメタデータ配列
   */
  getSaveSlots() {
    try {
      // 全てのセーブスロットのメタデータを返す
      const saves = JSON.parse(localStorage.getItem(this.storageKey)) || {};
      
      return Object.keys(saves).map(slotId => ({
        id: slotId,
        date: saves[slotId].saveDate,
        sceneName: saves[slotId].currentScene,
        // サムネイルなど他の情報も追加可能
      }));
    } catch (error) {
      console.error('Failed to get save slots:', error);
      return [];
    }
  }

  /**
   * セーブスロットを削除
   * @param {string} slotId - セーブスロットID
   * @returns {boolean} 削除成功したかどうか
   */
  deleteSave(slotId) {
    try {
      // セーブデータを取得
      const saves = JSON.parse(localStorage.getItem(this.storageKey)) || {};
      
      // 指定されたスロットを削除
      if (saves[slotId]) {
        delete saves[slotId];
        localStorage.setItem(this.storageKey, JSON.stringify(saves));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }

  /**
   * 自動セーブ
   * @param {Object} gameState - ゲーム状態
   * @returns {boolean} 保存成功したかどうか
   */
  autoSave(gameState) {
    return this.saveGame('auto', gameState);
  }

  /**
   * 自動セーブをロード
   * @returns {Object|null} ゲーム状態またはnull
   */
  loadAutoSave() {
    return this.loadGame('auto');
  }

  /**
   * クイックセーブ
   * @param {Object} gameState - ゲーム状態
   * @returns {boolean} 保存成功したかどうか
   */
  quickSave(gameState) {
    return this.saveGame('quick', gameState);
  }

  /**
   * クイックセーブをロード
   * @returns {Object|null} ゲーム状態またはnull
   */
  loadQuickSave() {
    return this.loadGame('quick');
  }
}

export default GameStateManager;
