import * as styles from './TitleScreen.css';

interface TitleScreenProps {
  onStartGame: () => void;
  onShowConfigMenu: () => void;
}

const TitleScreen = ({ onStartGame, onShowConfigMenu }: TitleScreenProps) => {
  return (
    <div className={styles.titleContainer}>
      <div className={styles.titleContent}>
        <div className={styles.gameTitle}>AIの鏡像</div>
        <div className={styles.subtitle}>
          「あなたは私を映す鏡か、それとも私があなたを映す鏡か？」
        </div>
        <div className={styles.buttonContainer}>
          <button className="game-button" onClick={onStartGame}>
            ゲーム開始
          </button>
          <button className="game-button" onClick={onStartGame}>
            続きから
          </button>
          <button className="game-button" onClick={onShowConfigMenu}>
            設定
          </button>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
