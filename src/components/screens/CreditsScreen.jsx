import React from 'react';
// import styled from 'styled-components';

// スタイル付きコンポーネント
// const CreditsContainer = styled.div`
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   align-items: center;
//   background-color: #000;
//   position: relative;
//   overflow-y: auto;
//   padding: 2rem;
//   color: #fff;

//   &::before {
//     content: '';
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)),
//       url('/assets/images/backgrounds/credits_bg.jpg');
//     background-size: cover;
//     background-position: center;
//     opacity: 0.4;
//     z-index: 0;
//   }
// `;

// const CreditsContent = styled.div`
//   position: relative;
//   z-index: 1;
//   width: 80%;
//   max-width: 800px;
// `;

// const CreditsTitle = styled.h1`
//   font-size: 2.5rem;
//   margin-bottom: 2rem;
//   text-align: center;
//   color: #a0e0ff;
//   text-shadow: 0 0 10px rgba(0, 150, 255, 0.7);

//   @media (max-width: 767px) {
//     font-size: 1.8rem;
//   }
// `;

// const CreditsSection = styled.div`
//   margin-bottom: 2rem;
// `;

// const SectionTitle = styled.h2`
//   font-size: 1.5rem;
//   margin-bottom: 1rem;
//   color: #a0e0ff;
//   border-bottom: 1px solid rgba(160, 224, 255, 0.3);
//   padding-bottom: 0.5rem;

//   @media (max-width: 767px) {
//     font-size: 1.2rem;
//   }
// `;

// const CreditsList = styled.ul`
//   list-style: none;
//   padding: 0;
// `;

// const CreditsItem = styled.li`
//   margin-bottom: 0.5rem;
//   display: flex;
//   justify-content: space-between;

//   @media (max-width: 767px) {
//     flex-direction: column;
//     margin-bottom: 1rem;
//   }
// `;

// const Role = styled.span`
//   font-weight: bold;
//   margin-right: 1rem;
// `;

// const Name = styled.span`
//   color: #ddd;
// `;

// const BackButton = styled.button`
//   position: fixed;
//   bottom: 2rem;
//   left: 50%;
//   transform: translateX(-50%);
//   background-color: rgba(0, 100, 200, 0.7);
//   color: white;
//   border: none;
//   padding: 0.75rem 1.5rem;
//   border-radius: 5px;
//   font-size: 1rem;
//   cursor: pointer;
//   transition: all 0.3s ease;
//   z-index: 10;

//   &:hover {
//     background-color: rgba(0, 150, 255, 0.9);
//   }
// `;

const CreditsScreen = ({ onBack }) => {
  return (
    <CreditsContainer className="fade-in">
      <CreditsContent>
        <CreditsTitle>AIの鏡像 クレジット</CreditsTitle>

        <CreditsSection>
          <SectionTitle>制作</SectionTitle>
          <CreditsList>
            <CreditsItem>
              <Role>企画・シナリオ</Role>
              <Name></Name>
            </CreditsItem>
            <CreditsItem>
              <Role>プログラミング</Role>
              <Name></Name>
            </CreditsItem>
            <CreditsItem>
              <Role>キャラクターデザイン</Role>
              <Name></Name>
            </CreditsItem>
            <CreditsItem>
              <Role>背景・UIデザイン</Role>
              <Name></Name>
            </CreditsItem>
            <CreditsItem>
              <Role>音楽</Role>
              <Name></Name>
            </CreditsItem>
          </CreditsList>
        </CreditsSection>

        <CreditsSection>
          <SectionTitle>使用素材</SectionTitle>
          <CreditsList>
            <CreditsItem>
              <Role>フォント</Role>
              <Name>Noto Sans JP (Google Fonts)</Name>
            </CreditsItem>
            <CreditsItem>
              <Role>効果音</Role>
              <Name></Name>
            </CreditsItem>
          </CreditsList>
        </CreditsSection>

        <CreditsSection>
          <SectionTitle>謝辞</SectionTitle>
          <p></p>
        </CreditsSection>

        <CreditsSection>
          <SectionTitle>著作権</SectionTitle>
          <p>© 2025 AIの鏡像 開発チーム All Rights Reserved.</p>
        </CreditsSection>
      </CreditsContent>

      <BackButton onClick={onBack}>戻る</BackButton>
    </CreditsContainer>
  );
};

export default CreditsScreen;
