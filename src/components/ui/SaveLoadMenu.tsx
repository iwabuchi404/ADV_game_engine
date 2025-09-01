import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import * as styles from './SaveLoadMenu.css';

// セーブデータがない場合のデフォルトスロット数
const DEFAULT_EMPTY_SLOTS = 6;

// 型定義
interface SaveSlot {
  id: string;
  date?: string;
  sceneName?: string;
  screenshot?: string;
}

interface SaveSlotItemProps {
  slot: SaveSlot;
  isSelected: boolean;
  onSelect: (slotId: string) => void;
  onSave: (slotId: string) => void;
  onLoad: (slotId: string) => void;
  onDelete: (slotId: string) => void;
  mode: 'save' | 'load';
}

interface SaveLoadMenuProps {
  mode?: 'save' | 'load';
  onClose: () => void;
}

/**
 * 日付をフォーマット
 * @param {string} dateString - 日付文字列
 * @returns {string} フォーマットされた日付
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * セーブスロットコンポーネント
 */
const SaveSlotItem: React.FC<SaveSlotItemProps> = ({
  slot,

  onSelect,
  onSave,
  onLoad,
  onDelete,
  mode,
}) => {
  const isEmpty = !slot.date;

  return (
    <div
      className={styles.saveSlot}
      onClick={() => onSelect(slot.id)}
    >
      <div className={styles.slotHeader}>
        <h3 className={styles.slotTitle}>{`スロット ${slot.id}`}</h3>
        {!isEmpty && <span className={styles.slotDate}>{formatDate(slot.date)}</span>}
      </div>

      <div className={styles.slotContent}>
        {isEmpty ? (
          <div className={styles.emptySlotText}>空のスロット</div>
        ) : (
          <div className={styles.slotInfo}>シーン: {slot.sceneName || '不明'}</div>
        )}

        <div className={styles.slotButtons}>
          {mode === 'save' && (
            <button
              className={styles.slotButton}
              onClick={(e) => {
                e.stopPropagation();
                onSave(slot.id);
              }}
            >
              保存
            </button>
          )}

          {mode === 'load' && (
            <button
              className={styles.slotButton}
              onClick={(e) => {
                e.stopPropagation();
                onLoad(slot.id);
              }}
              disabled={isEmpty}
            >
              読み込み
            </button>
          )}

          {!isEmpty && (
            <button
              className={styles.slotButton}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(slot.id);
              }}
            >
              削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * セーブ/ロード画面コンポーネント
 */
const SaveLoadMenu: React.FC<SaveLoadMenuProps> = ({ mode = 'save', onClose }) => {
  const { gameStateManager, saveGame, loadGame } = useGame();
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // セーブスロットを取得
  useEffect(() => {
    const slots = gameStateManager.getSaveSlots();

    // スロットIDを数値に変換してソート
    const sortedSlots = slots
      .filter((slot: any) => slot.id !== 'auto' && slot.id !== 'quick')
      .sort((a: any, b: any) => {
        const aNum = parseInt(a.id, 10);
        const bNum = parseInt(b.id, 10);

        // 数値でない場合は文字列としてソート
        if (isNaN(aNum) || isNaN(bNum)) {
          return a.id.localeCompare(b.id);
        }

        return aNum - bNum;
      });

    // デフォルトのスロットを追加
    const maxSlotNum =
      sortedSlots.length > 0
        ? Math.max(...sortedSlots.map((slot: any) => parseInt(slot.id, 10) || 0))
        : 0;

    const totalSlots = Math.max(maxSlotNum, DEFAULT_EMPTY_SLOTS);

    const allSlots: SaveSlot[] = [];
    for (let i = 1; i <= totalSlots; i++) {
      const existingSlot = sortedSlots.find((slot: any) => parseInt(slot.id, 10) === i);

      if (existingSlot) {
        allSlots.push(existingSlot);
      } else {
        allSlots.push({ id: String(i) });
      }
    }

    setSaveSlots(allSlots);

    // 最初のスロットを選択
    if (allSlots.length > 0 && !selectedSlot) {
      setSelectedSlot(allSlots[0].id);
    }
  }, [gameStateManager, selectedSlot]);

  // スロットを選択
  const handleSelectSlot = (slotId: string): void => {
    setSelectedSlot(slotId);
  };

  // ゲームをセーブ
  const handleSaveGame = (slotId: string): void => {
    const success = saveGame(slotId);

    if (success) {
      // セーブスロットを更新
      const slots = gameStateManager.getSaveSlots();
      const updatedSlots = saveSlots.map((slot) => {
        if (slot.id === slotId) {
          const updatedSlot = slots.find((s: any) => s.id === slotId);
          return updatedSlot || slot;
        }
        return slot;
      });

      setSaveSlots(updatedSlots);
      alert(`スロット ${slotId} にセーブしました`);
    } else {
      alert('セーブに失敗しました');
    }
  };

  // ゲームをロード
  const handleLoadGame = async (slotId: string): Promise<void> => {
    const success = await loadGame(slotId);

    if (success) {
      alert(`スロット ${slotId} からロードしました`);
      onClose();
    } else {
      alert('ロードに失敗しました');
    }
  };

  // セーブデータを削除
  const handleDeleteSave = (slotId: string): void => {
    if (window.confirm(`スロット ${slotId} のセーブデータを削除しますか？`)) {
      const success = gameStateManager.deleteSave(slotId);

      if (success) {
        // セーブスロットを更新
        setSaveSlots(
          saveSlots.map((slot) => {
            if (slot.id === slotId) {
              return { id: slot.id };
            }
            return slot;
          })
        );

        alert(`スロット ${slotId} のセーブデータを削除しました`);
      } else {
        alert('削除に失敗しました');
      }
    }
  };

  return (
    <div className={styles.saveLoadContainer}>
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>{mode === 'save' ? 'セーブ' : 'ロード'}</h2>
        <button className={styles.closeButton} onClick={onClose}>
          閉じる
        </button>
      </div>

      <div className={styles.slotsContainer}>
        {saveSlots.map((slot) => (
          <SaveSlotItem
            key={slot.id}
            slot={slot}
            isSelected={selectedSlot === slot.id}
            onSelect={handleSelectSlot}
            onSave={handleSaveGame}
            onLoad={handleLoadGame}
            onDelete={handleDeleteSave}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
};

export default SaveLoadMenu;
