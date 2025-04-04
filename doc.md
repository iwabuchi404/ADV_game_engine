# 「AIの鏡像」ビジュアルノベルエンジン ドキュメント

## 目次

1. [エンジン概要](#1-エンジン概要)
2. [アーキテクチャ](#2-アーキテクチャ)
3. [コンポーネント構成](#3-コンポーネント構成)
4. [シナリオデータ形式](#4-シナリオデータ形式)
5. [ノードタイプと設定オプション](#5-ノードタイプと設定オプション)
6. [APIリファレンス](#6-apiリファレンス)
7. [シナリオ作成ガイド](#7-シナリオ作成ガイド)
8. [拡張ガイド](#8-拡張ガイド)
9. [トラブルシューティング](#9-トラブルシューティング)

## 1. エンジン概要

「AIの鏡像」ビジュアルノベルエンジンは、React/styled-componentsベースのモダンなビジュアルノベル制作フレームワークです。このエンジンは特に「AIの鏡像」の世界観に適した以下の機能を提供します：

- テキスト表示システム（文字送り効果付き）
- キャラクター表示・管理
- 背景切り替え
- エフェクトシステム
- 選択肢と条件分岐
- フラグ・変数管理
- 関係性パラメータトラッキング
- オート再生モード
- セーブ/ロードシステム

## 2. アーキテクチャ

エンジンは以下の層構造で設計されています：

### コアレイヤー
- **ScenarioContext**: シナリオ状態管理とロジック
- **GameContext**: ゲーム全体の状態管理
- **AudioContext**: サウンド管理

### 表示レイヤー
- **ScenarioPlayer**: シナリオ再生の統合コンポーネント
- 各種UIコンポーネント（DialogBox, CharacterDisplay等）

### データレイヤー
- JSONシナリオデータ
- アセット管理（画像、音声）

### 接続概念図

```
GameContext ────┐
                └─── App ─── GameScreen ─── ScenarioProvider ─── ScenarioPlayer
AudioContext ───┘                                │
                                                 ├─── DialogBox
                                                 ├─── CharacterDisplay
                                                 ├─── BackgroundSystem
                                                 ├─── EffectsSystem
                                                 └─── ChoiceSystem
```

## 3. コンポーネント構成

### コアコンポーネント

#### ScenarioContext.js
シナリオの状態管理と、シナリオ再生に関するロジックを提供します。React Contextを使用してステート管理を行い、シナリオノードの処理、テキスト表示、選択肢処理などの核となる機能を実装しています。

```jsx
// 使用例
import { ScenarioProvider, useScenario } from '../engine/ScenarioContext';

// Provider設定
<ScenarioProvider>
  <YourComponent />
</ScenarioProvider>

// フックの使用
const { loadScenario, advanceScenario } = useScenario();
```

#### ScenarioPlayer.jsx
シナリオ表示の統合コンポーネント。背景、キャラクター、ダイアログ、選択肢などの表示を統合し、ユーザー入力を処理します。

```jsx
// 使用例
<ScenarioPlayer scenarioId="prologue" />
```

### 表示コンポーネント

#### DialogBox.jsx
テキスト表示を担当するコンポーネント。キャラクター名、テキスト、続行インジケーターを表示します。

#### CharacterDisplay.jsx
キャラクターの表示と管理を担当。複数キャラクターの位置、表情、発言状態を処理します。

#### BackgroundSystem.jsx
背景画像の表示と切り替えを担当。トランジションエフェクトにも対応しています。

#### EffectsSystem.jsx
画面エフェクト（フェード、フラッシュ、シェイクなど）を担当します。

#### ChoiceSystem.jsx
選択肢の表示と選択処理を担当します。選択肢のスタイリングと選択時のコールバック処理を実装しています。

## 4. シナリオデータ形式

シナリオデータはJSONファイルとして定義し、`src/scenarios/`ディレクトリに配置します。

### 基本構造

```json
{
  "id": "scenario_id",
  "title": "シナリオタイトル",
  "nodes": [
    {
      "type": "node_type",
      "// ノードタイプに応じたプロパティ": "値"
    },
    // 他のノード...
  ]
}
```

### 例：プロローグシナリオ

```json
{
  "id": "prologue",
  "title": "鏡の共振",
  "nodes": [
    {
      "type": "background",
      "background": {
        "id": "office_morning",
        "transition": "fade"
      },
      "duration": 1000
    },
    {
      "type": "dialogue",
      "text": "今日から新しい職場だ。デジタル心理士として第一歩を踏み出す日。",
      "character": null
    },
    // 他のノード...
  ]
}
```

## 5. ノードタイプと設定オプション

シナリオは複数の「ノード」で構成されます。各ノードタイプとそのプロパティを説明します。

### dialogue（ダイアログノード）

キャラクターの台詞やナレーションを表示します。

```json
{
  "type": "dialogue",
  "text": "表示するテキスト",
  "character": {
    "id": "character_id",
    "name": "キャラクター名",
    "position": 0,  // -300〜300の範囲で位置指定
    "expression": "neutral",  // 表情ID
    "speaking": true  // 発言中かどうか
  }
}
```

- `character`が`null`の場合はナレーション表示となります
- `speaking`をtrueにすると、該当キャラクターが強調表示されます

### background（背景ノード）

背景画像を変更します。

```json
{
  "type": "background",
  "background": {
    "id": "background_id",
    "transition": "fade" // トランジションタイプ
  },
  "duration": 1000 // ミリ秒単位
}
```

- 背景画像は`/assets/backgrounds/{id}.jpg`から読み込まれます
- トランジションタイプ: `fade`, `crossfade`, `slide_left`, `slide_right`が使用可能

### choice（選択肢ノード）

プレイヤーに選択肢を提示します。

```json
{
  "type": "choice",
  "choices": [
    {
      "text": "選択肢1のテキスト",
      "nextNodeIndex": 10, // ジャンプ先のノードインデックス
      "setFlag": {
        "key": "flag_name",
        "value": "flag_value"
      },
      "updateRelationship": {
        "trustLevel": 5,
        "dependencyLevel": -5,
        "boundaryClarity": 10
      }
    },
    // 他の選択肢...
  ]
}
```

- `nextNodeIndex`を省略すると、次のノードに進みます
- `setFlag`で選択時にフラグを設定できます
- `updateRelationship`で関係性パラメータを更新できます

### effect（エフェクトノード）

画面エフェクトを表示します。

```json
{
  "type": "effect",
  "effectType": "screen", // screen または transition
  "effect": {
    "type": "fade", // エフェクトタイプ
    "color": "white", // エフェクトの色
    "intensity": 0.7 // 強度（0〜1）
  },
  "duration": 1500 // ミリ秒単位
}
```

- `effectType`: `screen`(スクリーンエフェクト)または`transition`(トランジションエフェクト)
- スクリーンエフェクトタイプ: `fade`, `flash`, `vignette`
- トランジションエフェクトタイプ: `shake`, `blur`, `pixelate`

### sound（サウンドノード）

音声や効果音を再生します。

```json
{
  "type": "sound",
  "soundType": "bgm", // bgm または sfx
  "soundId": "music_id"
}
```

- `soundType`: `bgm`(バックグラウンドミュージック)または`sfx`(効果音)
- 音声ファイルは`/assets/audio/bgm/`または`/assets/audio/sfx/`から読み込まれます

### set（設定ノード）

ゲーム内変数やフラグを設定します。

```json
{
  "type": "set",
  "setType": "flag", // flag または variable
  "key": "flag_name",
  "value": "flag_value"
}
```

- `setType`: `flag`(フラグ)または`variable`(変数)
- フラグは真偽値や文字列、変数は数値や文字列を保存できます

### condition（条件分岐ノード）

条件に基づいてシナリオを分岐させます。

```json
{
  "type": "condition",
  "conditionType": "flag", // flag または variable
  "key": "flag_name",
  "operator": "==", // 演算子（変数の場合）
  "value": "flag_value",
  "trueNodeIndex": 15, // 条件が真の場合のジャンプ先
  "falseNodeIndex": 20 // 条件が偽の場合のジャンプ先
}
```

- `conditionType`: `flag`(フラグ)または`variable`(変数)
- `operator`: `==`, `!=`, `>`, `>=`, `<`, `<=`（変数の場合のみ）

### jump（ジャンプノード）

指定したノードへジャンプします。

```json
{
  "type": "jump",
  "targetIndex": 25
}
```

- `targetIndex`: ジャンプ先のノードインデックス

## 6. APIリファレンス

### useScenario フック

`useScenario`フックを使用してシナリオの状態とメソッドにアクセスできます。

```jsx
const {
  // 状態
  currentScenario,      // 現在のシナリオデータ
  currentNodeIndex,     // 現在のノードインデックス
  isPlaying,            // 再生中かどうか
  autoPlay,             // 自動再生モードかどうか
  textSpeed,            // テキスト表示速度 (1-5)
  currentText,          // 現在表示中のテキスト
  isTextComplete,       // テキスト表示が完了したか
  characters,           // 表示中のキャラクター情報
  background,           // 現在の背景
  currentChoices,       // 現在の選択肢
  isChoiceActive,       // 選択肢表示中かどうか
  backlog,              // テキストのバックログ
  effects,              // 現在のエフェクト
  flags,                // シナリオフラグ
  variables,            // シナリオ変数

  // メソッド
  loadScenario,         // シナリオをロードする
  advanceScenario,      // シナリオを進める
  selectChoice,         // 選択肢を選択する
  completeText,         // テキスト表示を完了させる
  toggleAutoPlay,       // 自動再生モードを切り替える
  setTextSpeed          // テキスト表示速度を設定する
} = useScenario();
```

### メソッド説明

#### loadScenario(scenarioId)
指定したIDのシナリオをロードします。
```jsx
loadScenario('prologue'); // src/scenarios/prologue.json をロード
```

#### advanceScenario()
シナリオを次のノードへ進めます。テキスト表示中の場合は表示を完了させます。
```jsx
advanceScenario();
```

#### selectChoice(choice)
選択肢を選択します。
```jsx
selectChoice(currentChoices[0]);
```

#### completeText()
現在表示中のテキストを即座に完了させます。
```jsx
completeText();
```

#### toggleAutoPlay()
自動再生モードを切り替えます。
```jsx
toggleAutoPlay();
```

#### setTextSpeed(speed)
テキスト表示速度を設定します（1-5）。
```jsx
setTextSpeed(3); // 中程度の速度
```

## 7. シナリオ作成ガイド

新しいシナリオを作成する手順を説明します。

### 1. シナリオJSONファイルの作成

`src/scenarios/`ディレクトリに新しいJSONファイルを作成します。

```json
// src/scenarios/chapter1.json
{
  "id": "chapter1",
  "title": "境界線の侵食",
  "nodes": [
    // ノード定義...
  ]
}
```

### 2. 効果的なシナリオ構築のヒント

1. **導入、展開、クライマックス、解決**の構造を意識してください。
2. ノードの**順序と構成**を明確にプランニングしてください。
3. 複雑な条件分岐は「条件分岐図」を事前に作成することをお勧めします。
4. キャラクターの感情や状態を表情や位置で表現してください。
5. 重要な分岐点にはセーブポイントの挿入を検討してください。

### 3. シナリオノードのテンプレート集

#### ナレーション
```json
{
  "type": "dialogue",
  "text": "ナレーションテキスト",
  "character": null
}
```

#### キャラクターの台詞
```json
{
  "type": "dialogue",
  "text": "キャラクターの台詞",
  "character": {
    "id": "character_id",
    "name": "キャラクター名",
    "position": 0,
    "expression": "neutral",
    "speaking": true
  }
}
```

#### 同時に複数キャラクターを表示
```json
{
  "type": "dialogue",
  "text": "左のキャラクターの台詞",
  "character": {
    "id": "character1",
    "name": "キャラクター1",
    "position": -150,
    "expression": "smile",
    "speaking": true
  },
  "otherCharacters": [
    {
      "id": "character2",
      "position": 150,
      "expression": "neutral",
      "speaking": false
    }
  ]
}
```

#### 条件分岐（応用）
```json
{
  "type": "condition",
  "conditionType": "variable",
  "key": "trust_level",
  "operator": ">=",
  "value": 50,
  "trueNodeIndex": 25,
  "falseNodeIndex": 30,
  "description": "信頼レベルが50以上かどうかで分岐"
}
```

## 8. 拡張ガイド

ゲームエンジンをカスタマイズして拡張する方法です。

### 新しいノードタイプの追加

1. **ScenarioContext.js**の`processNode`関数に新しいケースを追加します。

```jsx
case 'custom_node':
  // カスタムノードの処理
  console.log('Custom node:', node);
  // 必要な処理
  // 次のノードへ
  setTimeout(() => {
    advanceScenario();
  }, node.duration || 100);
  break;
```

2. シナリオファイルで新しいノードタイプを使用します。

```json
{
  "type": "custom_node",
  "customProperty": "value",
  "duration": 500
}
```

### 新しいコンポーネントの追加

例: ミニゲームコンポーネントの追加

1. 新しいコンポーネントファイルを作成します。

```jsx
// src/engine/components/MiniGameSystem.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useScenario } from '../ScenarioContext';

const GameContainer = styled.div`
  // スタイル定義
`;

const MiniGameSystem = ({ gameType, options }) => {
  const { advanceScenario } = useScenario();
  const [score, setScore] = useState(0);
  
  // ミニゲームのロジック
  
  const handleGameComplete = (finalScore) => {
    // ゲーム終了時の処理
    setScore(finalScore);
    // 結果をシナリオに反映
    // ...
    // 次のノードへ
    advanceScenario();
  };
  
  return (
    <GameContainer>
      {/* ミニゲームのUI */}
    </GameContainer>
  );
};

export default MiniGameSystem;
```

2. ScenarioPlayer.jsxに新しいコンポーネントを追加します。

3. ScenarioContext.jsに対応するノード処理を追加します。

## 9. トラブルシューティング

一般的な問題と解決策を紹介します。

### 問題: シナリオがロードされない

**考えられる原因**:
- JSONファイルのパスが正しくない
- JSONの構文エラー
- シナリオIDの不一致

**解決策**:
- パスが正しいか確認（`src/scenarios/{id}.json`）
- JSONバリデーターでJSONの構文を確認
- シナリオJSONの`id`フィールドとロード時の`scenarioId`が一致しているか確認

### 問題: キャラクター画像が表示されない

**考えられる原因**:
- 画像ファイルが存在しない
- パスが間違っている
- character.idまたはexpressionの不一致

**解決策**:
- `/public/assets/characters/{character.id}/{expression}.png`のパスに画像があるか確認
- 画像ファイル名と`expression`値が一致しているか確認
- ブラウザの開発者ツールでネットワークエラーを確認

### 問題: 条件分岐が正しく動作しない

**考えられる原因**:
- フラグや変数が正しく設定されていない
- インデックスが範囲外
- 条件式の論理エラー

**解決策**:
- console.logで`flags`と`variables`の状態を確認
- インデックスが有効範囲内か確認
- 条件式をシンプルにして段階的にテスト

---

このドキュメントは「AIの鏡像」ビジュアルノベルエンジンの基本的な機能と使用方法を説明しています。さらに詳細な情報や質問がある場合は、開発チームにお問い合わせください。