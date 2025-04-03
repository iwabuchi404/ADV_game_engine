import React from 'react';
import styled from 'styled-components';

// スタイル付きコンポーネント
const ChoiceMenuContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChoiceButton = styled.button`
  background-color: rgba(0, 30, 60, 0.85);
  color: white;
  border: 1px solid rgba(100, 180, 255, 0.5);
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background-color: rgba(0, 80, 150, 0.9);
    border-color: rgba(150, 200, 255, 0.8);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 767px) {
    font-size: 0.9rem;
    padding: 10px 16px;
  }
`;

const ChoiceMenu = ({ choices, onChoiceSelected }) => {
  return (
    <ChoiceMenuContainer>
      {choices.map((choice, index) => (
        <ChoiceButton
          key={index}
          onClick={() => onChoiceSelected(choice, index)} // インデックスも渡す
        >
          {choice.text}
        </ChoiceButton>
      ))}
    </ChoiceMenuContainer>
  );
};

export default ChoiceMenu;
