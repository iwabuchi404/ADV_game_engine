import React from 'react';
// import styled from 'styled-components';

// 位置に応じたスタイルを計算する関数
const getPositionStyle = (position) => {
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

// スタイル付きコンポーネント
const CharacterContainer = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 5;
  height: 90%;
  max-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  transition: all 0.5s ease-in-out;

  ${(props) => getPositionStyle(props.position)}
`;

const CharacterImage = styled.img`
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
`;

const Character = ({ name, image, position = 'center', expression = 'neutral' }) => {
  // 画像パスの生成
  const imagePath = image
    ? `/assets/images/characters/${image}`
    : `/assets/images/characters/${name}_${expression}.png`;

  return (
    <CharacterContainer position={position} className="fade-in">
      <CharacterImage src={imagePath} alt={name} />
    </CharacterContainer>
  );
};

export default Character;
