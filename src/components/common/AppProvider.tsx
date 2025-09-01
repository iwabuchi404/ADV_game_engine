import { GameProvider } from '../../contexts/GameContext.tsx';
import { AudioProvider } from '../../contexts/AudioContext.tsx';

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * アプリケーションプロバイダー
 * すべてのコンテキストを一元的に提供するためのプロバイダーコンポーネント
 */
const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AudioProvider>
      <GameProvider>{children}</GameProvider>
    </AudioProvider>
  );
};

export default AppProvider;
