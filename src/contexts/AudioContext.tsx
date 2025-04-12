import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

// 音量設定の型定義
interface VolumeSettings {
  master: number;
  bgm: number;
  sfx: number;
  voice: number;
}

// BGM再生オプションの型定義
interface BGMOptions {
  loop?: boolean;
  fadeIn?: boolean;
  fadeInDuration?: number;
  volume?: number;
}

// 効果音再生オプションの型定義
interface SFXOptions {
  loop?: boolean;
  volume?: number;
}

// ボイス再生オプションの型定義
interface VoiceOptions {
  volume?: number;
}

// BGM停止オプションの型定義
interface StopBGMOptions {
  fadeOut?: boolean;
  fadeOutDuration?: number;
}

// オーディオコンテキストの型定義
interface AudioContextType {
  playBGM: (trackName: string, options?: BGMOptions) => Promise<HTMLAudioElement | undefined>;
  stopBGM: (options?: StopBGMOptions) => void;
  playSFX: (sfxName: string, options?: SFXOptions) => Promise<string>;
  stopSFX: (id: string) => void;
  playVoice: (character: string, voiceId: string, options?: VoiceOptions) => Promise<string>;
  setAudioVolume: (type: keyof VolumeSettings, value: number) => void;
  toggleMute: () => void;
  stopAll: () => void;
  volume: VolumeSettings;
  isMuted: boolean;
  currentBgm: string | null;
}

// AudioContext の作成
const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: React.ReactNode;
}

/**
 * オーディオプロバイダーコンポーネント
 * オーディオ機能へのアクセスを提供する
 */
export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  // BGM用のオーディオ要素
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  // 効果音用のオーディオ要素（複数同時再生のため辞書で管理）
  const sfxRefs = useRef<Record<string, HTMLAudioElement>>({});

  // 状態管理
  const [volume, setVolume] = useState<VolumeSettings>({
    master: 0.7,
    bgm: 0.5,
    sfx: 0.8,
    voice: 0.9,
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentBgm, setCurrentBgm] = useState<string | null>(null);

  /**
   * オーディオのフェードイン
   * @param audio - オーディオ要素
   * @param duration - フェード時間（ミリ秒）
   * @param targetVolume - 目標音量
   */
  const fadeInAudio = (audio: HTMLAudioElement, duration: number, targetVolume: number): void => {
    const startTime = performance.now();
    const startVolume = 0;

    const updateVolume = (): void => {
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
   * @param audio - オーディオ要素
   * @param duration - フェード時間（ミリ秒）
   * @param callback - フェード完了時のコールバック
   */
  const fadeOutAudio = (audio: HTMLAudioElement, duration: number, callback?: () => void): void => {
    const startTime = performance.now();
    const startVolume = audio.volume;

    const updateVolume = (): void => {
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

  /**
   * BGMを再生
   * @param trackName - BGMの名前
   * @param options - 再生オプション
   * @returns 生成されたオーディオ要素
   */
  const playBGM = useCallback(
    async (trackName: string, options: BGMOptions = {}): Promise<HTMLAudioElement | undefined> => {
      const { loop = true, fadeIn = false, fadeInDuration = 2000, volume: customVolume } = options;

      try {
        // 既に同じBGMが再生中の場合は何もしない
        if (currentBgm === trackName && bgmRef.current && !bgmRef.current.paused) {
          return bgmRef.current;
        }

        // 新しいオーディオ要素を作成
        const audio = new Audio();
        audio.src = `/assets/audio/bgm/${trackName}`;
        audio.loop = loop;
        const calculatedVolume = customVolume || volume.master * volume.bgm;
        audio.volume = fadeIn ? 0 : isMuted ? 0 : calculatedVolume;

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
        setCurrentBgm(trackName);

        // プリロードして再生
        audio.load();
        await audio.play().catch((error) => {
          console.error('BGM playback failed:', error);
        });

        // フェードイン
        if (fadeIn) {
          fadeInAudio(audio, fadeInDuration, isMuted ? 0 : calculatedVolume);
        }

        return audio;
      } catch (error) {
        console.error('Error playing BGM:', error);
        return undefined;
      }
    },
    [volume, isMuted, currentBgm]
  );

  /**
   * BGMを停止
   * @param options - 停止オプション
   */
  const stopBGM = useCallback((options: StopBGMOptions = {}): void => {
    const { fadeOut = false, fadeOutDuration = 1000 } = options;

    if (!bgmRef.current) return;

    if (fadeOut) {
      fadeOutAudio(bgmRef.current, fadeOutDuration, () => {
        if (bgmRef.current) {
          bgmRef.current.pause();
          bgmRef.current.src = '';
          bgmRef.current = null;
          setCurrentBgm(null);
        }
      });
    } else {
      bgmRef.current.pause();
      bgmRef.current.src = '';
      bgmRef.current = null;
      setCurrentBgm(null);
    }
  }, []);

  /**
   * 効果音を再生
   * @param sfxName - 効果音の名前
   * @param options - 再生オプション
   * @returns 効果音のID（停止時に使用）
   */
  const playSFX = useCallback(
    async (sfxName: string, options: SFXOptions = {}): Promise<string> => {
      const { loop = false, volume: customVolume } = options;

      try {
        // 新しいオーディオ要素を作成
        const audio = new Audio(`/assets/audio/sfx/${sfxName}`);
        const calculatedVolume = customVolume || volume.master * volume.sfx;
        audio.volume = isMuted ? 0 : calculatedVolume;
        audio.loop = loop;

        // 一意のIDを生成
        const id = Date.now().toString();
        sfxRefs.current[id] = audio;

        // データ属性の代わりにTypeScript用のメタデータ
        Object.defineProperty(audio, 'dataset', {
          value: { type: 'sfx' },
        });

        // 再生完了時に削除するイベントリスナーを設定
        audio.addEventListener('ended', () => {
          delete sfxRefs.current[id];
        });

        // 再生開始
        await audio.play().catch((error) => {
          console.error('SFX playback failed:', error);
          delete sfxRefs.current[id];
          throw error;
        });

        // IDを返す（停止などに使用可能）
        return id;
      } catch (error) {
        console.error('Error playing SFX:', error);
        throw error;
      }
    },
    [volume, isMuted]
  );

  /**
   * 効果音を停止
   * @param id - 効果音のID
   */
  const stopSFX = useCallback((id: string): void => {
    if (sfxRefs.current[id]) {
      const audio = sfxRefs.current[id];
      audio.pause();
      audio.currentTime = 0;
      delete sfxRefs.current[id];
    }
  }, []);

  /**
   * キャラクターボイスを再生
   * @param character - キャラクター名
   * @param voiceId - ボイスID
   * @param options - 再生オプション
   * @returns ボイスのID
   */
  const playVoice = useCallback(
    async (character: string, voiceId: string, options: VoiceOptions = {}): Promise<string> => {
      const { volume: customVolume } = options;

      try {
        // オーディオ要素を作成
        const audio = new Audio(`/assets/audio/voice/${character}/${voiceId}.mp3`);
        const calculatedVolume = customVolume || volume.master * volume.voice;
        audio.volume = isMuted ? 0 : calculatedVolume;

        // データ属性の代わりにTypeScript用のメタデータ
        Object.defineProperty(audio, 'dataset', {
          value: { type: 'voice' },
        });

        // 一意のIDを生成
        const id = `voice_${Date.now()}`;
        sfxRefs.current[id] = audio; // 効果音と同じ参照で管理

        // 再生完了時に削除するイベントリスナーを設定
        audio.addEventListener('ended', () => {
          delete sfxRefs.current[id];
        });

        // 再生開始
        await audio.play().catch((error) => {
          console.error('Voice playback failed:', error);
          delete sfxRefs.current[id];
          throw error;
        });

        return id;
      } catch (error) {
        console.error('Error playing voice:', error);
        throw error;
      }
    },
    [volume, isMuted]
  );

  /**
   * 音量を設定
   * @param type - 音量タイプ（master, bgm, sfx, voice）
   * @param value - 音量（0〜1）
   */
  const setAudioVolume = useCallback(
    (type: keyof VolumeSettings, value: number): void => {
      setVolume((prev) => {
        const newVolume = { ...prev, [type]: value };

        // BGMの音量を更新
        if (bgmRef.current && !isMuted) {
          if (type === 'master' || type === 'bgm') {
            bgmRef.current.volume = newVolume.master * newVolume.bgm;
          }
        }

        // 効果音の音量を更新
        Object.values(sfxRefs.current).forEach((audio) => {
          if (!isMuted) {
            const dataset = (audio.dataset as { type?: string }) || { type: 'sfx' };
            const audioType = dataset.type || 'sfx';

            if (type === 'master') {
              // マスター音量変更時は全てのオーディオに適用
              audio.volume =
                newVolume.master *
                (audioType === 'sfx'
                  ? newVolume.sfx
                  : audioType === 'voice'
                  ? newVolume.voice
                  : newVolume.sfx);
            } else if (
              (type === 'sfx' && audioType === 'sfx') ||
              (type === 'voice' && audioType === 'voice')
            ) {
              audio.volume = newVolume.master * newVolume[type];
            }
          }
        });

        return newVolume;
      });
    },
    [isMuted]
  );

  /**
   * ミュート切り替え
   */
  const toggleMute = useCallback((): void => {
    setIsMuted((prev) => {
      const newMuted = !prev;

      // BGMの音量を調整
      if (bgmRef.current) {
        bgmRef.current.volume = newMuted ? 0 : volume.master * volume.bgm;
      }

      // 効果音の音量を調整
      Object.values(sfxRefs.current).forEach((audio) => {
        const dataset = (audio.dataset as { type?: string }) || { type: 'sfx' };
        const type = dataset.type || 'sfx';
        audio.volume = newMuted ? 0 : volume.master * volume[type as keyof VolumeSettings];
      });

      return newMuted;
    });
  }, [volume]);

  /**
   * 全てのオーディオを停止
   */
  const stopAll = useCallback((): void => {
    // BGMを停止
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
      bgmRef.current = null;
      setCurrentBgm(null);
    }

    // 効果音を全て停止
    Object.values(sfxRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    // 効果音の参照をクリア
    sfxRefs.current = {};
  }, []);

  // コンポーネントのアンマウント時に全てのオーディオを停止
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  // AudioContext の値
  const value: AudioContextType = {
    playBGM,
    stopBGM,
    playSFX,
    stopSFX,
    playVoice,
    setAudioVolume,
    toggleMute,
    stopAll,
    volume,
    isMuted,
    currentBgm,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

/**
 * useAudioフック
 * コンポーネント内でオーディオ機能を使用するためのカスタムフック
 */
export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);

  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }

  return context;
};

export default AudioContext;
