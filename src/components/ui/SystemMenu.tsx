import {
  menuOverlay,
  menuContainer,
  menuTitle,
  menuButtonsContainer,
  menuButton,
  closeButton,
} from './SystemMenu.css';

interface SystemMenuProps {
  onSave: () => void;
  onLoad: () => void;
  onConfig: () => void;
  onBackToTitle: () => void;
  onClose: () => void;
}

const SystemMenu = ({ onSave, onLoad, onConfig, onBackToTitle, onClose }: SystemMenuProps) => {
  return (
    <div className={`${menuOverlay} 'fade-in'`}>
      <div className={`${menuContainer} 'lide-up'`}>
        <p className={menuTitle}>メニュー</p>

        <div className={menuButtonsContainer}>
          <button className={menuButton} onClick={onSave}>
            セーブ
          </button>
          <button className={menuButton} onClick={onLoad}>
            ロード
          </button>
          <button className={menuButton} onClick={onConfig}>
            設定
          </button>
          <button className={menuButton} onClick={onBackToTitle}>
            タイトルに戻る
          </button>
          <button className={closeButton} onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemMenu;
