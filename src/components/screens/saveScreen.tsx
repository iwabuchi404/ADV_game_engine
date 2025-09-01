import { useState, useEffect } from 'react';
import * as styles from './saveScreen.css';
import { useGame } from '../../contexts/GameContext.tsx';
import { GameState } from '../../types/game.ts';

interface SaveScreenProps {
  onBackToTitle: () => void;
}

const SaveScreen = ({ onBackToTitle }: SaveScreenProps) => {
  const { saveGame, loadGame, updateGameState } = useGame();
  const [saveData, setSaveData] = useState<(GameState | null)[]>(Array(10).fill(null)); // セーブデータの状態を管理するためのuseStateフック

  useEffect(() => {
    //ローカルストレージからセーブデータを取得
    const getSaveData = () => {
      let loadedSaves = Array(10).fill(null); // 新しい配列を作成
      let localStorageSaveData = localStorage.getItem('ai-mirror-visual-novel-saves');
      if (localStorageSaveData) {
        try {
          const parsedData: GameState[] = JSON.parse(localStorageSaveData);
          console.log('Parsed save data:', parsedData); // デバッグ用にコンソールに表示
          // localStorageのデータが配列であることを確認し、最大10個まで読み込む
          if (parsedData) {
            loadedSaves = loadedSaves.map((_, index) => parsedData[index] || null);
          }
        } catch (error) {
          console.error('Failed to parse save data from localStorage:', error);
          // パースに失敗した場合も初期状態（nullの配列）を維持
        }
      }

      setSaveData(loadedSaves); // 取得したデータでステートを更新
    };

    getSaveData(); // セーブデータを取得
  }, []); // 空の依存配列を指定して、マウント時にのみ実行

  const formatDate = (text: string) => {
    return text.replace('{br}', '');
  };

  const onSaveBtn = (slotId: number) => {
    saveGame(slotId);
    updateGameState({ scrennState: 'game' }); // ゲーム画面に戻る
  };

  const onLoadBtn = (slotId: number) => {
    loadGame(slotId);
    updateGameState({ scrennState: 'game' }); // ゲーム画面に戻る
  };

  const onClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateGameState({ scrennState: 'game' }); // ゲーム画面に戻る
  };

  return (
    <div className={styles.saveContainer}>
      <div className={styles.saveContent}>
        <div className={styles.saveTitle}>セーブデータ</div>
        <button className={styles.closeButton} onClick={(e) => onClose(e)}></button>
        <div className={styles.saveDataList}>
          {
            /* セーブデータのリストを表示 */
            saveData.map((data, index) => (
              <div key={index} className={styles.saveDataItem}>
                <div className={styles.saveDataText}>
                  {data
                    ? `セーブスロット${index + 1}: ${formatDate(
                        (data.currentScene &&
                          data.currentScene.textBlocks &&
                          data.currentScene.textBlocks[data.currentTextBlockIndex].text) ||
                          'ブランク'
                      )}`
                    : `セーブデータ${index + 1}: ブランク`}
                </div>
                <div className={styles.saveDataButtons}>
                  <button
                    className="game-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveBtn(index);
                    }}
                  >
                    セーブ
                  </button>
                  <button
                    className="game-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadBtn(index);
                    }}
                  >
                    ロード
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default SaveScreen;
