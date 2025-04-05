import React, { useEffect, useState } from 'react';
import ScenarioEngine from '../../core/ScenarioEngine';
import './TestScreen.css';

/**
 * ScenarioEngineのテスト用画面コンポーネント
 * シンプルなシナリオ表示と進行機能を提供
 */
const TestScreen = () => {
  // シナリオエンジンの状態
  const [engine] = useState(new ScenarioEngine());
  // 現在のシーン
  const [currentScene, setCurrentScene] = useState(null);
  // ローディング状態
  const [loading, setLoading] = useState(true);
  // エラー状態
  const [error, setError] = useState(null);
  // 選択肢の表示状態
  const [showChoices, setShowChoices] = useState(false);

  // コンポーネントマウント時にシナリオを読み込む
  useEffect(() => {
    const loadScenario = async () => {
      try {
        setLoading(true);
        const success = await engine.loadScenario('prologue_v2');
        if (success) {
          const scene = engine.getCurrentScene();
          setCurrentScene(scene);
        } else {
          setError('シナリオの読み込みに失敗しました');
        }
      } catch (err) {
        setError(`エラーが発生しました: ${err.message}`);
        console.error('シナリオ読み込みエラー:', err);
      } finally {
        setLoading(false);
      }
    };

    loadScenario();
  }, [engine]);

  // 次のシーンに進む
  const handleAdvance = () => {
    // 選択肢がある場合は選択肢を表示
    if (currentScene.choices && currentScene.choices.length > 0) {
      setShowChoices(true);
      return;
    }

    // 次のシーンがある場合は進む
    if (currentScene.next) {
      const nextScene = engine.setCurrentScene(currentScene.next);
      if (nextScene) {
        setCurrentScene(nextScene);
        setShowChoices(false);
      } else {
        setError('次のシーンに進めませんでした');
      }
    } else {
      setError('次のシーンがありません');
    }
  };

  // 選択肢を選択
  const handleChoiceSelect = (choiceIndex) => {
    const nextScene = engine.selectChoice(choiceIndex);
    if (nextScene) {
      setCurrentScene(nextScene);
      setShowChoices(false);
    } else {
      setError('選択肢の処理に失敗しました');
    }
  };

  // ローディング中の表示
  if (loading) {
    return <div className="test-screen loading">シナリオを読み込んでいます...</div>;
  }

  // エラーの表示
  if (error) {
    return (
      <div className="test-screen error">
        <p>エラー: {error}</p>
        <button onClick={() => setError(null)}>再試行</button>
      </div>
    );
  }

  // シーンが未ロードの場合
  if (!currentScene) {
    return <div className="test-screen no-scene">シーンがロードされていません</div>;
  }

  return (
    <div className="test-screen" onClick={!showChoices ? handleAdvance : null}>
      {/* 背景 */}
      <div className="background" style={{ backgroundColor: '#000' }}>
        {currentScene.background && (
          <div style={{ color: 'white' }}>背景: {currentScene.background}</div>
        )}
      </div>

      {/* キャラクター */}
      <div className="characters">
        {currentScene.characters &&
          currentScene.characters.map((character, index) => (
            <div key={index} className={`character ${character.position}`}>
              <div style={{ color: 'white' }}>
                {character.name} ({character.expression || 'neutral'})
              </div>
            </div>
          ))}
      </div>

      {/* ダイアログまたはテキストブロック */}
      <div className="dialog-box">
        {currentScene.dialog ? (
          <div>
            <div className="speaker">{currentScene.dialog.speaker}</div>
            <div className="text">{currentScene.dialog.text}</div>
          </div>
        ) : currentScene.textBlocks && currentScene.textBlocks.length > 0 ? (
          <div>
            <div className="speaker">{currentScene.textBlocks[0].speaker}</div>
            <div className="text">{currentScene.textBlocks[0].text}</div>
          </div>
        ) : (
          <div className="text">テキストがありません</div>
        )}
      </div>

      {/* 選択肢 */}
      {showChoices && currentScene.choices && (
        <div className="choices">
          {currentScene.choices.map((choice, index) => (
            <button key={index} onClick={() => handleChoiceSelect(index)}>
              {choice.text}
            </button>
          ))}
        </div>
      )}

      {/* 開発情報 */}
      <div className="debug-info">
        <div>シーンID: {currentScene.id}</div>
        <div>
          BGM:{' '}
          {typeof currentScene.bgm === 'object'
            ? currentScene.bgm.track || JSON.stringify(currentScene.bgm)
            : currentScene.bgm || 'なし'}
        </div>
        <div>SFX: {currentScene.sfx || 'なし'}</div>
        <div>次のシーン: {currentScene.next || (currentScene.choices ? '選択肢あり' : 'なし')}</div>
      </div>
    </div>
  );
};

export default TestScreen;
