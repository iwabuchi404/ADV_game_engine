import React, { createContext, useContext, useState, useEffect } from 'react';

// オーディオコンテキストの作成
const AudioContext = createContext();

// オーディオプロバイダーコンポーネント
export const AudioProvider = ({ children }) => {
  const [bgm, setBgm] = useState(null);
  const [sfx, setSfx] = useState({});
  const [volume, setVolume] = useState({
    master: 0.7,
    bgm: 0.5,
    sfx: 0.8,
    voice: 0.9
  });
  const [isMuted, setIsMuted] = useState(false);
  
  // BGMを再生する関数
  const playBgm = (trackName) => {
    // 現在のBGMを停止
    if (bgm) {
      bgm.pause();
    }
    
    // 新しいBGMを設定して再生
    try {
      const audio = new Audio(`/assets/audio/bgm/${trackName}.mp3`);
      audio.loop = true;
      audio.volume = volume.master * volume.bgm * (isMuted ? 0 : 1);
      audio.play();
      setBgm(audio);
    } catch (error) {
      console.error("BGM playback error:", error);
    }
  };
  
  // 効果音を再生する関数
  const playSfx = (sfxName) => {
    if (isMuted) return;
    
    try {
      const audio = new Audio(`/assets/audio/sfx/${sfxName}.mp3`);
      audio.volume = volume.master * volume.sfx;
      audio.play();
      
      // 効果音コントロール用に保存
      const newSfx = { ...sfx };
      newSfx[sfxName] = audio;
      setSfx(newSfx);
    } catch (error) {
      console.error("SFX playback error:", error);
    }
  };
  
  // ボイスを再生する関数
  const playVoice = (character, voiceId) => {
    if (isMuted) return;
    
    try {
      const audio = new Audio(`/assets/audio/voice/${character}/${voiceId}.mp3`);
      audio.volume = volume.master * volume.voice;
      audio.play();
    } catch (error) {
      console.error("Voice playback error:", error);
    }
  };
  
  // ボリュームを設定する関数
  const setAudioVolume = (type, value) => {
    setVolume(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // ミュート切り替え関数
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // ボリューム変更時のエフェクト
  useEffect(() => {
    if (bgm) {
      bgm.volume = volume.master * volume.bgm * (isMuted ? 0 : 1);
    }
  }, [volume, isMuted, bgm]);
  
  // コンポーネントアンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      if (bgm) {
        bgm.pause();
        bgm.src = '';
      }
      
      Object.values(sfx).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);
  
  const value = {
    playBgm,
    playSfx,
    playVoice,
    setAudioVolume,
    toggleMute,
    volume,
    isMuted
  };
  
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

// オーディオコンテキストを使用するためのカスタムフック
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export default AudioContext;