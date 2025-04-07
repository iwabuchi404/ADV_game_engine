import React from 'react';
import { BackgroundWrapper, BackgroundImage } from './Background.css';

const Background = (image: string) => {
  // 画像パスの生成
  const imagePath = image ? `/assets/images/backgrounds/${image.image}` : null;
  console.log('Background image path:', imimageagePath); // デバッグ用
  return (
    <div className={BackgroundWrapper}>
      {imagePath && (
        <div
          className={BackgroundImage}
          style={{ backgroundImage: `url(${imagePath})` }}
          data-img={imagePath}
        />
      )}
    </div>
  );
};

export default Background;
