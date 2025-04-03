import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * オーディオ再生を管理するコンポーネント
 * BGMや効果音の再生、音量調整などを担当
 */
const AudioPlayer = ({ audioEnabled = true }) => {
  // BGM用のオーディオ要素
  const bgmRef = useRef(null);
  // 効果音用のオーディオ要素（複数同時再生のため配列で管理）
  const sfxRefs = useRef({});
  
  // 状態管理
  const [bgmVolume, setBgmVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.7);
  const [currentBgm, setCurrentBgm] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  
  /**
   * BGMを再生
   * @param {string} trackPath - BGMのパス
   * @param {Object} options - 再生オプション
   */
  const playBGM = useCallback((trackPath, options = {}) => {
    if (!audioEnabled) return;
    console.log('playBGM', trackPath, options);
    const { loop = true, volume = bgmVolume, fadeIn = true, fadeInDuration = 2000 } = options;
    
    try {
      // 既に同じBGMが再生中の場合は何もしない
      if (currentBgm === trackPath && bgmRef.current && !bgmRef.current.paused) {
        return;
      }
      
      // 新しいオーディオ要素を作成
      const audio = new Audio();
      audio.src = `/assets/audio/bgm/${trackPath}`; // .mp3拡張子を追加
      audio.loop = loop;
      audio.volume = fadeIn ? 0 : (isMuted ? 0 : volume);
      
      // 古いBGMを停止（フェードアウトさせる）
      if (bgmRef.current) {
        const oldAudio = bgmRef.current;
        fadeOutAudio(oldAudio, 1000, () => {
          oldAudio.pause();
          oldAudio.src = '';
        });
      }
      
      // 新しいBGMを設定
      bgmRef.current = audio;
      setCurrentBgm(trackPath);
      
      // プリロードして再生
      audio.load();
      audio.play().catch(error => {
        console.error('BGM playback failed:', error);
      });
      
      // フェードイン
      if (fadeIn) {
        fadeInAudio(audio, fadeInDuration, isMuted ? 0 : volume);
      }
    } catch (error) {
      console.error('Error playing BGM:', error);
    }
  }, [audioEnabled, bgmVolume, currentBgm, isMuted]);
  
  /**
   * 効果音を再生
   * @param {string} soundPath - 効果音のパス
   * @param {Object} options - 再生オプション
   */
  const playSFX = useCallback((soundPath, options = {}) => {
    if (!audioEnabled) return;
    
    const { volume = sfxVolume, loop = false } = options;
    
    // 新しいオーディオ要素を作成
    const audio = new Audio(`/assets/audio/sfx/${soundPath}`);
    audio.volume = isMuted ? 0 : volume;
    audio.loop = loop;
    
    // 一意のIDを生成
    const id = Date.now().toString();
    sfxRefs.current[id] = audio;
    
    // 再生完了時に削除するイベントリスナーを設定
    audio.addEventListener('ended', () => {
      delete sfxRefs.current[id];
    });
    
    // 再生開始
    audio.play().catch(error => {
      console.error('SFX playback failed:', error);
      delete sfxRefs.current[id];
    });
    
    // IDを返す（停止などに使用可能）
    return id;
  }, [audioEnabled, isMuted, sfxVolume]);
  
  /**
   * 効果音を停止
   * @param {string} id - 効果音のID
   */
  const stopSFX = useCallback((id) => {
    if (sfxRefs.current[id]) {
      const audio = sfxRefs.current[id];
      audio.pause();
      audio.currentTime = 0;
      delete sfxRefs.current[id];
    }
  }, []);
  
  /**
   * BGM再生/停止の切り替え
   */
  const toggleBGM = useCallback(() => {
    if (!bgmRef.current) return;
    
    if (bgmRef.current.paused) {
      bgmRef.current.play().catch(error => {
        console.error('BGM playback failed:', error);
      });
    } else {
      bgmRef.current.pause();
    }
  }, []);
  
  /**
   * ミュート切り替え
   */
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      
      // BGMの音量を調整
      if (bgmRef.current) {
        bgmRef.current.volume = newMuted ? 0 : bgmVolume;
      }
      
      // 効果音の音量を調整
      Object.values(sfxRefs.current).forEach(audio => {
        audio.volume = newMuted ? 0 : sfxVolume;
      });
      
      return newMuted;
    });
  }, [bgmVolume, sfxVolume]);
  
  /**
   * BGM音量の設定
   * @param {number} volume - 音量（0〜1）
   */
  const setBGMVolume = useCallback((volume) => {
    setBgmVolume(volume);
    if (bgmRef.current && !isMuted) {
      bgmRef.current.volume = volume;
    }
  }, [isMuted]);
  
  /**
   * 効果音音量の設定
   * @param {number} volume - 音量（0〜1）
   */
  const setSFXVolume = useCallback((volume) => {
    setSfxVolume(volume);
    if (!isMuted) {
      Object.values(sfxRefs.current).forEach(audio => {
        audio.volume = volume;
      });
    }
  }, [isMuted]);
  
  /**
   * 全てのオーディオを停止
   */
  const stopAll = useCallback(() => {
    // BGMを停止
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
    
    // 効果音を全て停止
    Object.values(sfxRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    // 効果音の参照をクリア
    sfxRefs.current = {};
  }, []);
  
  /**
   * オーディオのフェードイン
   * @param {HTMLAudioElement} audio - オーディオ要素
   * @param {number} duration - フェード時間（ミリ秒）
   * @param {number} targetVolume - 目標音量
   */
  const fadeInAudio = (audio, duration, targetVolume) => {
    const startTime = performance.now();
    const startVolume = 0;
    
    const updateVolume = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      audio.volume = startVolume + (targetVolume - startVolume) * progress;
      
      if (progress < 1) {
        requestAnimationFrame(updateVolume);
      }
    };
    
    requestAnimationFrame(updateVolume);
  };
  
  /**
   * オーディオのフェードアウト
   * @param {HTMLAudioElement} audio - オーディオ要素
   * @param {number} duration - フェード時間（ミリ秒）
   * @param {Function} callback - フェード完了時のコールバック
   */
  const fadeOutAudio = (audio, duration, callback) => {
    const startTime = performance.now();
    const startVolume = audio.volume;
    
    const updateVolume = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      audio.volume = startVolume * (1 - progress);
      
      if (progress < 1) {
        requestAnimationFrame(updateVolume);
      } else if (callback) {
        callback();
      }
    };
    
    requestAnimationFrame(updateVolume);
  };
  
  // コンポーネントのアンマウント時に全てのオーディオを停止
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);
  
  // AudioPlayer のパブリックAPIを返す
  return {
    playBGM,
    playSFX,
    stopSFX,
    toggleBGM,
    toggleMute,
    setBGMVolume,
    setSFXVolume,
    stopAll,
    isMuted,
    bgmVolume,
    sfxVolume,
    currentBgm
  };
};

export default AudioPlayer;
