import React, { useEffect, useRef } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { BgmInstruction } from '../../types/scenario';

interface BGMPlayerProps {
  bgm: string | BgmInstruction | null | undefined;
  isActive: boolean;
}

const BGMPlayer: React.FC<BGMPlayerProps> = ({ bgm, isActive }) => {
  const audio = useAudio();
  const currentBgmRef = useRef<string | null>(null);

  useEffect(() => {
    // コンポーネントがアンマウントされたときにBGMを停止
    return () => {
      if (currentBgmRef.current) {
        audio.stopBGM({ fadeOut: true });
        currentBgmRef.current = null;
      }
    };
  }, [audio]);

  useEffect(() => {
    if (!isActive) return;

    const handleBgm = async () => {
      try {
        // BGMの処理
        if (!bgm) {
          // BGMが指定されていない場合、現在のBGMを継続
          return;
        }
        // BgmInstruction型かどうかを確認
        if (typeof bgm === 'object') {
          // stop指定の場合
          if ('stop' in bgm && bgm.stop) {
            await audio.stopBGM({ fadeOut: true });
            currentBgmRef.current = null;
            return;
          }

          // continue指定の場合
          if ('continue' in bgm && bgm.continue) {
            return;
          }

          // track指定の場合
          if ('track' in bgm) {
            const track = bgm.track;
            if (track !== currentBgmRef.current) {
              await audio.playBGM(track, {
                fadeIn: bgm.fadeIn !== undefined ? (typeof bgm.fadeIn === 'boolean' ? bgm.fadeIn : true) : true,
                fadeInDuration: typeof bgm.fadeIn === 'number' ? bgm.fadeIn : 2000,
                loop: bgm.loop !== undefined ? bgm.loop : true,
                volume: bgm.volume,
              });
              currentBgmRef.current = track;
            }
            return;
          }
        }

        // 文字列の場合（トラック名として扱う）
        if (typeof bgm === 'string' && bgm !== currentBgmRef.current) {
          await audio.playBGM(bgm, {
            fadeIn: true,
            fadeInDuration: 2000,
            loop: true,
          });
          currentBgmRef.current = bgm;
        }
      } catch (error) {
        console.error('BGMの再生に失敗しました:', error);
      }
    };

    handleBgm();
  }, [bgm, isActive, audio]);

  // このコンポーネントは表示要素を持たないので、nullを返す
  return null;
};

export default BGMPlayer;
