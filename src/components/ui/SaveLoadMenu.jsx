import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';

// スタイル付きコンポーネント
const SaveLoadContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 20, 40, 0.9);
  color: white;
  overflow-y: auto;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #a0e0ff;
  margin: 0;
  
  @media (max-width: 767px) {
    font-size: 1.4rem;
  }
`;

const CloseButton = styled.button`
  background-color: rgba(100, 100, 100, 0.7);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(150, 150, 150, 0.9);
  }
`;

const SlotsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const SaveSlot = styled.div`
  border: 1px solid ${props => props.isSelected ? '#a0e0ff' : 'rgba(100, 180, 255, 0.3)'};
  border-radius: 5px;
  padding: 1rem;
  background-color: ${props => props.isSelected ? 'rgba(0, 50, 100, 0.6)' : 'rgba(0, 30, 60, 0.6)'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 50, 100, 0.6);
    border-color: rgba(100, 180, 255, 0.6);
  }
  
  ${props => props.isEmpty && `
    border-style: dashed;
    background-color: rgba(30, 30, 40, 0.6);
    
    &:hover {
      background-color: rgba(40, 40, 60, 0.6);
    }
  `}
`;

const SlotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const SlotTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${props => props.isEmpty ? '#888' : 'white'};
`;

const SlotDate = styled.span`
  color: #a0e0ff;
  font-size: 0.8rem;
`;

const SlotContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SlotInfo = styled.div`
  color: ${props => props.isEmpty ? '#888' : '#ddd'};
  font-size: 0.9rem;
`;

const SlotButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SlotButton = styled.button`
  flex: 1;
  background-color: rgba(0, 80, 150, 0.7);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 120, 200, 0.9);
  }
  
  &:disabled {
    background-color: rgba(70, 70, 70, 0.5);
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(SlotButton)`
  background-color: rgba(150, 50, 50, 0.7);
  
  &:hover {
    background-color: rgba(200, 70, 70, 0.9);
  }
`;

const EmptySlotText = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #888;
`;

// セーブデータがない場合のデフォルトスロット数
const DEFAULT_EMPTY_SLOTS = 6;

/**
 * 日付をフォーマット
 * @param {string} dateString - 日付文字列
 * @returns {string} フォーマットされた日付
 */
const formatDate = (dateString) => {
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
const SaveSlotItem = ({ 
  slot, 
  isSelected, 
  onSelect, 
  onSave, 
  onLoad, 
  onDelete,
  mode
}) => {
  const isEmpty = !slot.date;
  
  return (
    <SaveSlot 
      isEmpty={isEmpty} 
      isSelected={isSelected}
      onClick={() => onSelect(slot.id)}
    >
      <SlotHeader>
        <SlotTitle isEmpty={isEmpty}>
          {`スロット ${slot.id}`}
        </SlotTitle>
        {!isEmpty && <SlotDate>{formatDate(slot.date)}</SlotDate>}
      </SlotHeader>
      
      <SlotContent>
        {isEmpty ? (
          <EmptySlotText>空のスロット</EmptySlotText>
        ) : (
          <>
            <SlotInfo>シーン: {slot.sceneName || '不明'}</SlotInfo>
          </>
        )}
        
        <SlotButtons>
          {mode === 'save' && (
            <SlotButton onClick={(e) => {
              e.stopPropagation();
              onSave(slot.id);
            }}>
              保存
            </SlotButton>
          )}
          
          {mode === 'load' && (
            <SlotButton 
              onClick={(e) => {
                e.stopPropagation();
                onLoad(slot.id);
              }}
              disabled={isEmpty}
            >
              読み込み
            </SlotButton>
          )}
          
          {!isEmpty && (
            <DeleteButton onClick={(e) => {
              e.stopPropagation();
              onDelete(slot.id);
            }}>
              削除
            </DeleteButton>
          )}
        </SlotButtons>
      </SlotContent>
    </SaveSlot>
  );
};

/**
 * セーブ/ロード画面コンポーネント
 */
const SaveLoadMenu = ({ mode = 'save', onClose }) => {
  const { gameStateManager, saveGame, loadGame } = useGame();
  const [saveSlots, setSaveSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // セーブスロットを取得
  useEffect(() => {
    const slots = gameStateManager.getSaveSlots();
    
    // スロットIDを数値に変換してソート
    const sortedSlots = slots
      .filter(slot => slot.id !== 'auto' && slot.id !== 'quick')
      .sort((a, b) => {
        const aNum = parseInt(a.id, 10);
        const bNum = parseInt(b.id, 10);
        
        // 数値でない場合は文字列としてソート
        if (isNaN(aNum) || isNaN(bNum)) {
          return a.id.localeCompare(b.id);
        }
        
        return aNum - bNum;
      });
    
    // デフォルトのスロットを追加
    const maxSlotNum = sortedSlots.length > 0 
      ? Math.max(...sortedSlots.map(slot => parseInt(slot.id, 10) || 0))
      : 0;
    
    const totalSlots = Math.max(maxSlotNum, DEFAULT_EMPTY_SLOTS);
    
    const allSlots = [];
    for (let i = 1; i <= totalSlots; i++) {
      const existingSlot = sortedSlots.find(slot => parseInt(slot.id, 10) === i);
      
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
  const handleSelectSlot = (slotId) => {
    setSelectedSlot(slotId);
  };
  
  // ゲームをセーブ
  const handleSaveGame = (slotId) => {
    const success = saveGame(slotId);
    
    if (success) {
      // セーブスロットを更新
      const slots = gameStateManager.getSaveSlots();
      const updatedSlots = saveSlots.map(slot => {
        if (slot.id === slotId) {
          const updatedSlot = slots.find(s => s.id === slotId);
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
  const handleLoadGame = async (slotId) => {
    const success = await loadGame(slotId);
    
    if (success) {
      alert(`スロット ${slotId} からロードしました`);
      onClose();
    } else {
      alert('ロードに失敗しました');
    }
  };
  
  // セーブデータを削除
  const handleDeleteSave = (slotId) => {
    if (window.confirm(`スロット ${slotId} のセーブデータを削除しますか？`)) {
      const success = gameStateManager.deleteSave(slotId);
      
      if (success) {
        // セーブスロットを更新
        setSaveSlots(saveSlots.map(slot => {
          if (slot.id === slotId) {
            return { id: slot.id };
          }
          return slot;
        }));
        
        alert(`スロット ${slotId} のセーブデータを削除しました`);
      } else {
        alert('削除に失敗しました');
      }
    }
  };
  
  return (
    <SaveLoadContainer>
      <HeaderContainer>
        <Title>{mode === 'save' ? 'セーブ' : 'ロード'}</Title>
        <CloseButton onClick={onClose}>閉じる</CloseButton>
      </HeaderContainer>
      
      <SlotsContainer>
        {saveSlots.map(slot => (
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
      </SlotsContainer>
    </SaveLoadContainer>
  );
};

export default SaveLoadMenu;
