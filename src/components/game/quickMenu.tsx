import React from 'react';
import { QuickMenuContainer, ChoiceMenuButton } from './quickMenu.css';
import { useGame } from '../../contexts/GameContext.tsx';
import SaveManager from '../../core/SaveState.tsx';

const QuickMenu = ({}) => {
  const { gameState, gameSettings, updateSettings, saveGame, loadGame } = useGame();

  const toggleAuto = (e) => {
    e.stopPropagation();
    updateSettings({
      ...gameSettings, // 既存のゲーム設定をすべてコピー
      isAutoMode: !gameSettings.isAutoMode, // isAutoMode の値を更新
    });
    if (gameSettings.isAutoMode) {
      console.log('オートモードがONに切り替わりました。');
    } else {
      console.log('オートモードがOFF切り替わりました。');
    }
  };

  const quickSave = (e) => {
    e.stopPropagation();
    // クイックセーブの処理を実装
    console.log('クイックセーブが実行されました。');
    saveGame('auto'); // スロット0にセーブ
  };
  const quickLord = (e) => {
    e.stopPropagation();
    /// クイックロードの処理を実装
    console.log('クイックロードが実行されました。');
    loadGame('auto'); // スロット0からロード
  };

  const SkipMouseDown = (e) => {
    e.stopPropagation();
    updateSettings({
      ...gameSettings,
      isSkipMode: true,
    });
  };

  const SkipMouseUp = (e) => {
    e.stopPropagation();
    updateSettings({
      ...gameSettings,
      isSkipMode: false,
    });
  };

  return (
    <div className={QuickMenuContainer}>
      <button className={ChoiceMenuButton} onClick={(e) => toggleAuto(e)}>
        Auto:{gameSettings.isAutoMode ? 'ON' : 'OFF'}
      </button>
      <button
        className={ChoiceMenuButton}
        onMouseDown={(e) => SkipMouseDown(e)}
        onMouseUp={(e) => SkipMouseUp(e)}
        onMouseLeave={(e) => SkipMouseUp(e)}
      >
        Skip
      </button>
      <button className={ChoiceMenuButton} onClick={(e) => quickSave(e)}>
        Qsave
      </button>
      <button className={ChoiceMenuButton} onClick={(e) => quickLord(e)}>
        Qload
      </button>
    </div>
  );
};

export default QuickMenu;
