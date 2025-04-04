import React from 'react';
// import styled from 'styled-components';

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: #000;
  transition: background-image 0.5s ease-in-out;
`;

const BackgroundImage = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${(props) => props.opacity || 1};
  transition: opacity 0.5s ease-in-out;
`;

const Background = ({ image, opacity = 1 }) => {
  // 画像パスの生成
  const imagePath = image ? `/assets/images/backgrounds/${image}` : null;

  return (
    <BackgroundWrapper>
      {imagePath && (
        <BackgroundImage
          style={{ backgroundImage: `url(${imagePath})` }}
          opacity={opacity}
          className="fade-in"
        />
      )}
    </BackgroundWrapper>
  );
};

export default Background;
