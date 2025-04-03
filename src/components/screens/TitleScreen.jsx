import React from 'react';
import styled from 'styled-components';

// スタイル付きコンポーネント
const TitleContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)),
                url('/assets/images/backgrounds/title_bg.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.6;
    z-index: 0;
  }
`;

const TitleContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
`;

const GameTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 10px rgba(0, 150, 255, 0.7);
  
  @media (max-width: 767px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  font-weight: 400;
  color: #a0e0ff;
  text-shadow: 0 0 5px rgba(0, 100, 200, 0.5);
  
  @media (max-width: 767px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
  max-width: 100%;
  margin: auto;
`;

const Button = styled.button`
  background-color: rgba(0, 100, 200, 0.7);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 150, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 767px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
`;

const CreditsButton = styled(Button)`
  background-color: rgba(50, 50, 70, 0.7);
  
  &:hover {
    background-color: rgba(70, 70, 100, 0.9);
  }
`;

const TitleScreen = ({ onStartGame, onShowCredits }) => {
  return (
    <TitleContainer>
      <TitleContent className="fade-in">
        <GameTitle>AIの鏡像</GameTitle>
        <Subtitle>「あなたは私を映す鏡か、それとも私があなたを映す鏡か？」</Subtitle>
        <ButtonContainer className="slide-up">
          <Button onClick={onStartGame}>ゲーム開始</Button>
          <Button onClick={onStartGame}>続きから</Button>
          <CreditsButton onClick={onShowCredits}>クレジット</CreditsButton>
        </ButtonContainer>
      </TitleContent>
    </TitleContainer>
  );
};

export default TitleScreen;
