import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useAudio } from '../../contexts/AudioContext';
import * as styles from './ConfigMenu.css';

// 型定義
interface ConfigMenuProps {
  onClose: () => void;
}

interface PresetOption {
  label: string;
  value: number;
}

interface ConfigState {
  textSpeed: number;
  autoSpeed: number;
  isAutoMode: boolean;
  isSkipMode: boolean;
  showAlreadyRead: boolean;
  bgmVolume: number;
  sfxVolume: number;
  isMuted: boolean;
}

/**
 * 設定メニューコンポーネント
 */
const ConfigMenu: React.FC<ConfigMenuProps> = ({ onClose }) => {
  const { gameSettings, updateSettings } = useGame();
  const audio = useAudio();

  // テキスト速度のプリセット
  const textSpeedPresets: PresetOption[] = [
    { label: '遅い', value: 50 },
    { label: '普通', value: 30 },
    { label: '速い', value: 15 },
  ];

  // オート速度のプリセット
  const autoSpeedPresets: PresetOption[] = [
    { label: '遅い', value: 3000 },
    { label: '普通', value: 2000 },
    { label: '速い', value: 1000 },
  ];

  // ローカルステートでUI表示を管理
  const [settings, setSettings] = useState<ConfigState>({
    textSpeed: gameSettings.textSpeed,
    autoSpeed: gameSettings.autoSpeed,
    isAutoMode: gameSettings.isAutoMode,
    isSkipMode: gameSettings.isSkipMode,
    showAlreadyRead: gameSettings.showAlreadyRead,
    bgmVolume: audio.volume.bgm * 100,
    sfxVolume: audio.volume.sfx * 100,
    isMuted: audio.isMuted,
  });

  // 設定を更新
  const handleUpdateSettings = (key: keyof ConfigState, value: number | boolean): void => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (['textSpeed', 'autoSpeed', 'isAutoMode', 'isSkipMode', 'showAlreadyRead'].includes(key)) {
      updateSettings({ [key]: value });
    }

    if (key === 'bgmVolume') {
      audio.setAudioVolume('bgm', (value as number) / 100);
    }

    if (key === 'sfxVolume') {
      audio.setAudioVolume('sfx', (value as number) / 100);
    }

    if (key === 'isMuted') {
      audio.toggleMute();
    }
  };

  // テキスト速度のプリセットを選択
  const selectTextSpeedPreset = (value: number): void => {
    handleUpdateSettings('textSpeed', value);
  };

  // オート速度のプリセットを選択
  const selectAutoSpeedPreset = (value: number): void => {
    handleUpdateSettings('autoSpeed', value);
  };

  return (
    <div className={styles.configContainer}>
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>設定</h2>
        <button className={styles.closeButton} onClick={onClose}>
          閉じる
        </button>
      </div>

      <div className={styles.configSection}>
        <h3 className={styles.sectionTitle}>テキスト設定</h3>

        <div className={styles.settingRow}>
          <div className={styles.settingLabel}>テキスト表示速度</div>
          <div className={styles.settingControl}>
            <input
              className={styles.slider}
              type="range"
              min="1"
              max="100"
              value={settings.textSpeed}
              onChange={(e) => handleUpdateSettings('textSpeed', parseInt(e.target.value, 10))}
            />
            <span className={styles.sliderValue}>{settings.textSpeed}ms</span>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingLabel}>プリセット</div>
          <div className={styles.buttonGroup}>
            {textSpeedPresets.map((preset) => (
              <button
                key={preset.label}
                className={styles.selectButton({
                  selected: settings.textSpeed === preset.value,
                })}
                onClick={() => selectTextSpeedPreset(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingLabel}>オート時の待機時間</div>
          <div className={styles.settingControl}>
            <input
              className={styles.slider}
              type="range"
              min="500"
              max="5000"
              step="100"
              value={settings.autoSpeed}
              onChange={(e) => handleUpdateSettings('autoSpeed', parseInt(e.target.value, 10))}
            />
            <span className={styles.sliderValue}>{(settings.autoSpeed / 1000).toFixed(1)}秒</span>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingLabel}>プリセット</div>
          <div className={styles.buttonGroup}>
            {autoSpeedPresets.map((preset) => (
              <button
                key={preset.label}
                className={styles.selectButton({
                  selected: settings.autoSpeed === preset.value,
                })}
                onClick={() => selectAutoSpeedPreset(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingLabel}>既読テキストの表示</div>
          <button
            className={styles.toggleButton({
              active: settings.showAlreadyRead,
            })}
            onClick={() => handleUpdateSettings('showAlreadyRead', !settings.showAlreadyRead)}
          >
            {settings.showAlreadyRead ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className={styles.configSection}>
        <h3 className={styles.sectionTitle}>オーディオ設定</h3>

        <div className={styles.settingRow}>
          <div className={styles.settingLabel}>BGM音量</div>
          <div className={styles.settingControl}>
            <input
              className={styles.slider}
              type="range"
              min="0"
              max="100"
              value={settings.bgmVolume}
              onChange={(e) => handleUpdateSettings('bgmVolume', parseInt(e.target.value, 10))}
              disabled={settings.isMuted}
            />
            <span className={styles.sliderValue}>{settings.bgmVolume}%</span>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingLabel}>効果音音量</div>
          <div className={styles.settingControl}>
            <input
              className={styles.slider}
              type="range"
              min="0"
              max="100"
              value={settings.sfxVolume}
              onChange={(e) => handleUpdateSettings('sfxVolume', parseInt(e.target.value, 10))}
              disabled={settings.isMuted}
            />
            <span className={styles.sliderValue}>{settings.sfxVolume}%</span>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingLabel}>ミュート</div>
          <button
            className={styles.toggleButton({
              active: settings.isMuted,
            })}
            onClick={() => handleUpdateSettings('isMuted', !settings.isMuted)}
          >
            {settings.isMuted ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className={styles.configSection}>
        <h3 className={styles.sectionTitle}>プレイモード</h3>

        <div className={styles.settingRow}>
          <div className={styles.settingLabel}>オートモード</div>
          <button
            className={styles.toggleButton({
              active: settings.isAutoMode,
            })}
            onClick={() => {
              // オートモードとスキップモードは排他的
              if (settings.isSkipMode) {
                handleUpdateSettings('isSkipMode', false);
              }
              handleUpdateSettings('isAutoMode', !settings.isAutoMode);
            }}
          >
            {settings.isAutoMode ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingLabel}>スキップモード</div>
          <button
            className={styles.toggleButton({
              active: settings.isSkipMode,
            })}
            onClick={() => {
              // オートモードとスキップモードは排他的
              if (settings.isAutoMode) {
                handleUpdateSettings('isAutoMode', false);
              }
              handleUpdateSettings('isSkipMode', !settings.isSkipMode);
            }}
          >
            {settings.isSkipMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigMenu;
