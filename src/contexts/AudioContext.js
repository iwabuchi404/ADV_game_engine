import React, { createContext, useContext } from 'react';
import AudioPlayer from '../components/common/AudioPlayer';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  // AudioPlayerをコンポーネントとして使用
  const audioPlayerProps = { audioEnabled: true };
  
  return (
    <AudioContext.Provider value={<AudioPlayer {...audioPlayerProps} />}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  
  if (context === null) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  
  return context;
};

export default AudioContext;
