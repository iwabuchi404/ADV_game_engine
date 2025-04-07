import React from 'react';
import { CharacterContainer, CharacterImage } from './Character.css';

// 位置に応じたスタイルを計算する関数
const getPositionStyle = (position: string) => {
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

const Character = ({ id, name, image, position = 'center', expression = 'neutral' }) => {
  // 画像パスの生成
  const imagePath = image
    ? `/assets/images/characters/${image}`
    : `/assets/images/characters/${id}_${expression}.png`;

  return (
    <div className={CharacterContainer} style={getPositionStyle(position)}>
      <img className={CharacterImage} src={imagePath} alt={name} />
    </div>
  );
};

export default Character;
