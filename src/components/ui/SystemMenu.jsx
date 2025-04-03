import React from 'react';
import styled from 'styled-components';

// スタイル付きコンポーネント
const MenuOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
`;

const MenuContainer = styled.div`
  width: 80%;
  max-width: 500px;
  background-color: rgba(10, 30, 50, 0.9);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(100, 180, 255, 0.3);
`;

const MenuTitle = styled.h2`
  color: #a0e0ff;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 150, 255, 0.5);
  
  @media (max-width: 767px) {
    font-size: 1.4rem;
  }
`;

const MenuButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MenuButton = styled.button`
  background-color: rgba(0, 80, 150, 0.7);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 120, 200, 0.9);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 767px) {
    font-size: 1rem;
    padding: 0.7rem 1.2rem;
  }
`;

const CloseButton = styled(MenuButton)`
  background-color: rgba(100, 100, 100, 0.7);
  margin-top: 1rem;
  
  &:hover {
    background-color: rgba(150, 150, 150, 0.9);
  }
`;

const WarningButton = styled(MenuButton)`
  background-color: rgba(150, 50, 50, 0.7);
  
  &:hover {
    background-color: rgba(200, 70, 70, 0.9);
  }
`;

const SystemMenu = ({ onSave, onLoad, onConfig, onBackToTitle, onClose }) => {
  return (
    <MenuOverlay className="fade-in">
      <MenuContainer className="slide-up">
        <MenuTitle>メニュー</MenuTitle>
        
        <MenuButtonsContainer>
          <MenuButton onClick={onSave}>セーブ</MenuButton>
          <MenuButton onClick={onLoad}>ロード</MenuButton>
          <MenuButton onClick={onConfig}>設定</MenuButton>
          <WarningButton onClick={onBackToTitle}>タイトルに戻る</WarningButton>
          <CloseButton onClick={onClose}>閉じる</CloseButton>
        </MenuButtonsContainer>
      </MenuContainer>
    </MenuOverlay>
  );
};

export default SystemMenu;
