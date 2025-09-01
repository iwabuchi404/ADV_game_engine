import { CharacterContainer, CharacterImage } from './Character.css';
import { SCENARIO_CONFIG } from '../../data/config';

interface CharacterProps {
  id: string;
  name: string;
  image?: string;
  position?: 'left' | 'center' | 'right';
  expression?: string;
}

// 位置に応じたスタイルを計算する関数
const getPositionStyle = (position: 'left' | 'center' | 'right') => {
  switch (position) {
    case 'left':
      return {
        left: '25%',
        transform: 'translateX(-50%)',
      };
    case 'center':
      return {
        left: '50%',
        transform: 'translateX(-50%)',
      };
    case 'right':
      return {
        right: '25%',
        transform: 'translateX(50%)',
      };
    default:
      return {
        left: '50%',
        transform: 'translateX(-50%)',
      };
  }
};

const Character = ({ id, name, image, position = 'center', expression = 'neutral' }: CharacterProps) => {
  // 画像パスの生成
  const imagePath = image
    ? `${SCENARIO_CONFIG.CHARACTERS_PATH}${image}`
    : `${SCENARIO_CONFIG.CHARACTERS_PATH}${id}_${expression}.png`;

  return (
    <div className={CharacterContainer} style={getPositionStyle(position)}>
      <img className={CharacterImage} src={imagePath} alt={name} />
    </div>
  );
};

export default Character;
