import React, { useState } from 'react';
// import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import { useAudio } from '../../contexts/AudioContext';

// スタイル付きコンポーネント
const ConfigContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 20, 40, 0.9);
  color: white;
  overflow-y: auto;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #a0e0ff;
  margin: 0;

  @media (max-width: 767px) {
    font-size: 1.4rem;
  }
`;

const CloseButton = styled.button`
  background-color: rgba(100, 100, 100, 0.7);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background-color: rgba(150, 150, 150, 0.9);
  }
`;

const ConfigSection = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(100, 180, 255, 0.3);
  padding-bottom: 1.5rem;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  color: #a0e0ff;
  margin: 0 0 1rem 0;

  @media (max-width: 767px) {
    font-size: 1.1rem;
  }
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const SettingLabel = styled.div`
  font-size: 1rem;

  @media (max-width: 767px) {
    font-size: 0.9rem;
  }
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 767px) {
    width: 100%;
  }
`;

const Slider = styled.input`
  width: 200px;

  @media (max-width: 767px) {
    width: 100%;
  }
`;

const ToggleButton = styled.button`
  background-color: ${(props) =>
    props.active ? 'rgba(0, 150, 255, 0.7)' : 'rgba(70, 70, 70, 0.7)'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 80px;

  &:hover {
    background-color: ${(props) =>
      props.active ? 'rgba(0, 180, 255, 0.9)' : 'rgba(100, 100, 100, 0.9)'};
  }
`;

const SelectButton = styled.button`
  background-color: ${(props) =>
    props.selected ? 'rgba(0, 150, 255, 0.7)' : 'rgba(30, 30, 50, 0.7)'};
  color: white;
  border: 1px solid
    ${(props) => (props.selected ? 'rgba(100, 180, 255, 0.8)' : 'rgba(100, 100, 100, 0.3)')};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 80px;

  &:hover {
    background-color: ${(props) =>
      props.selected ? 'rgba(0, 180, 255, 0.9)' : 'rgba(50, 50, 80, 0.9)'};
    border-color: rgba(100, 180, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 767px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SliderValue = styled.span`
  min-width: 40px;
  text-align: center;
`;

/**
 * 設定メニューコンポーネント
 */
const ConfigMenu = ({ onClose }) => {
  const { gameSettings, updateSettings } = useGame();
  const audio = useAudio();

  // テキスト速度のプリセット
  const textSpeedPresets = [
    { label: '遅い', value: 50 },
    { label: '普通', value: 30 },
    { label: '速い', value: 15 },
  ];

  // オート速度のプリセット
  const autoSpeedPresets = [
    { label: '遅い', value: 3000 },
    { label: '普通', value: 2000 },
    { label: '速い', value: 1000 },
  ];

  // ローカルステートでUI表示を管理
  const [settings, setSettings] = useState({
    textSpeed: gameSettings.textSpeed,
    autoSpeed: gameSettings.autoSpeed,
    isAutoMode: gameSettings.isAutoMode,
    isSkipMode: gameSettings.isSkipMode,
    showAlreadyRead: gameSettings.showAlreadyRead,
    bgmVolume: audio.bgmVolume * 100,
    sfxVolume: audio.sfxVolume * 100,
    isMuted: audio.isMuted,
  });

  // 設定を更新
  const handleUpdateSettings = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (['textSpeed', 'autoSpeed', 'isAutoMode', 'isSkipMode', 'showAlreadyRead'].includes(key)) {
      updateSettings({ [key]: value });
    }

    if (key === 'bgmVolume') {
      audio.setBGMVolume(value / 100);
    }

    if (key === 'sfxVolume') {
      audio.setSFXVolume(value / 100);
    }

    if (key === 'isMuted') {
      audio.toggleMute();
    }
  };

  // テキスト速度のプリセットを選択
  const selectTextSpeedPreset = (value) => {
    handleUpdateSettings('textSpeed', value);
  };

  // オート速度のプリセットを選択
  const selectAutoSpeedPreset = (value) => {
    handleUpdateSettings('autoSpeed', value);
  };

  return (
    <ConfigContainer>
      <HeaderContainer>
        <Title>設定</Title>
        <CloseButton onClick={onClose}>閉じる</CloseButton>
      </HeaderContainer>

      <ConfigSection>
        <SectionTitle>テキスト設定</SectionTitle>

        <SettingRow>
          <SettingLabel>テキスト表示速度</SettingLabel>
          <SettingControl>
            <Slider
              type="range"
              min="1"
              max="100"
              value={settings.textSpeed}
              onChange={(e) => handleUpdateSettings('textSpeed', parseInt(e.target.value))}
            />
            <SliderValue>{settings.textSpeed}ms</SliderValue>
          </SettingControl>
        </SettingRow>

        <SettingRow>
          <SettingLabel>プリセット</SettingLabel>
          <ButtonGroup>
            {textSpeedPresets.map((preset) => (
              <SelectButton
                key={preset.label}
                selected={settings.textSpeed === preset.value}
                onClick={() => selectTextSpeedPreset(preset.value)}
              >
                {preset.label}
              </SelectButton>
            ))}
          </ButtonGroup>
        </SettingRow>

        <SettingRow>
          <SettingLabel>オート時の待機時間</SettingLabel>
          <SettingControl>
            <Slider
              type="range"
              min="500"
              max="5000"
              step="100"
              value={settings.autoSpeed}
              onChange={(e) => handleUpdateSettings('autoSpeed', parseInt(e.target.value))}
            />
            <SliderValue>{(settings.autoSpeed / 1000).toFixed(1)}秒</SliderValue>
          </SettingControl>
        </SettingRow>

        <SettingRow>
          <SettingLabel>プリセット</SettingLabel>
          <ButtonGroup>
            {autoSpeedPresets.map((preset) => (
              <SelectButton
                key={preset.label}
                selected={settings.autoSpeed === preset.value}
                onClick={() => selectAutoSpeedPreset(preset.value)}
              >
                {preset.label}
              </SelectButton>
            ))}
          </ButtonGroup>
        </SettingRow>

        <SettingRow>
          <SettingLabel>既読テキストの表示</SettingLabel>
          <ToggleButton
            active={settings.showAlreadyRead}
            onClick={() => handleUpdateSettings('showAlreadyRead', !settings.showAlreadyRead)}
          >
            {settings.showAlreadyRead ? 'ON' : 'OFF'}
          </ToggleButton>
        </SettingRow>
      </ConfigSection>

      <ConfigSection>
        <SectionTitle>オーディオ設定</SectionTitle>

        <SettingRow>
          <SettingLabel>BGM音量</SettingLabel>
          <SettingControl>
            <Slider
              type="range"
              min="0"
              max="100"
              value={settings.bgmVolume}
              onChange={(e) => handleUpdateSettings('bgmVolume', parseInt(e.target.value))}
              disabled={settings.isMuted}
            />
            <SliderValue>{settings.bgmVolume}%</SliderValue>
          </SettingControl>
        </SettingRow>

        <SettingRow>
          <SettingLabel>効果音音量</SettingLabel>
          <SettingControl>
            <Slider
              type="range"
              min="0"
              max="100"
              value={settings.sfxVolume}
              onChange={(e) => handleUpdateSettings('sfxVolume', parseInt(e.target.value))}
              disabled={settings.isMuted}
            />
            <SliderValue>{settings.sfxVolume}%</SliderValue>
          </SettingControl>
        </SettingRow>

        <SettingRow>
          <SettingLabel>ミュート</SettingLabel>
          <ToggleButton
            active={settings.isMuted}
            onClick={() => handleUpdateSettings('isMuted', !settings.isMuted)}
          >
            {settings.isMuted ? 'ON' : 'OFF'}
          </ToggleButton>
        </SettingRow>
      </ConfigSection>

      <ConfigSection>
        <SectionTitle>プレイモード</SectionTitle>

        <SettingRow>
          <SettingLabel>オートモード</SettingLabel>
          <ToggleButton
            active={settings.isAutoMode}
            onClick={() => {
              // オートモードとスキップモードは排他的
              if (settings.isSkipMode) {
                handleUpdateSettings('isSkipMode', false);
              }
              handleUpdateSettings('isAutoMode', !settings.isAutoMode);
            }}
          >
            {settings.isAutoMode ? 'ON' : 'OFF'}
          </ToggleButton>
        </SettingRow>

        <SettingRow>
          <SettingLabel>スキップモード</SettingLabel>
          <ToggleButton
            active={settings.isSkipMode}
            onClick={() => {
              // オートモードとスキップモードは排他的
              if (settings.isAutoMode) {
                handleUpdateSettings('isAutoMode', false);
              }
              handleUpdateSettings('isSkipMode', !settings.isSkipMode);
            }}
          >
            {settings.isSkipMode ? 'ON' : 'OFF'}
          </ToggleButton>
        </SettingRow>
      </ConfigSection>
    </ConfigContainer>
  );
};

export default ConfigMenu;
