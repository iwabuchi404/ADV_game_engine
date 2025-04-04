# AIの鏡像 - ビジュアルノベルゲームエンジン

「AIの鏡像」を動作させるためのWebベースのビジュアルノベルゲームエンジンです。ReactとStyledComponentsを使用して構築されています。

## 特徴

- **モダンなReactベース**: 最新のReact機能を活用したコンポーネント設計
- **レスポンシブデザイン**: モバイルからデスクトップまで対応
- **セーブ/ロードシステム**: ゲーム進行状況の保存と読み込み
- **カスタマイズ可能な設定**: テキスト速度、オーディオ設定などのカスタマイズ
- **拡張可能なアーキテクチャ**: 将来機能を追加しやすい構造

## セットアップ方法

### 必要条件

- Node.js 14.0.0以上
- npm 6.0.0以上

### インストール

1. リポジトリをクローン
```
git clone https://github.com/yourusername/ai-mirror-visual-novel.git
cd ai-mirror-visual-novel
```

2. 依存パッケージをインストール
```
npm install
```

3. 開発サーバーを起動
```
npm start
```

4. ブラウザで http://localhost:3000 にアクセス

### ビルド

本番環境用のビルドを作成するには:

```
npm run build
```

## プロジェクト構造

```
visual-novel-engine/
├── public/             # 静的ファイル
│   ├── assets/         # ゲームアセット
│   │   ├── images/     # 画像
│   │   ├── audio/      # 音声
│   │   └── scenarios/  # シナリオデータ
│   └── index.html      # HTMLエントリーポイント
├── src/                # ソースコード
│   ├── components/     # Reactコンポーネント
│   │   ├── game/       # ゲーム関連コンポーネント
│   │   ├── ui/         # UI関連コンポーネント
│   │   ├── screens/    # 画面コンポーネント
│   │   └── common/     # 共通コンポーネント
│   ├── engines/        # ゲームエンジン
│   ├── contexts/       # Reactコンテキスト
│   ├── data/           # 静的データ
│   ├── styles/         # スタイル
│   ├── utils/          # ユーティリティ関数
│   ├── App.jsx         # メインアプリケーション
│   └── index.js        # Reactエントリーポイント
└── package.json        # npm設定
```

## シナリオの作成

シナリオは `public/assets/scenarios/` ディレクトリにJSONファイルとして配置します。シナリオフォーマットの詳細については [シナリオ作成ガイド](docs/scenario-format.md) を参照してください。

基本的なシナリオ構造:

```json
{
  "title": "チャプタータイトル",
  "scenes": [
    {
      "id": "scene_001",
      "background": "office_morning.jpg",
      "bgm": "calm_theme.mp3",
      "characters": [
        {
          "name": "キャラクター名",
          "image": "character_neutral.png",
          "position": "left"
        }
      ],
      "dialog": {
        "speaker": "キャラクター名",
        "text": "セリフテキスト"
      },
      "next": "scene_002"
    },
    // 追加のシーン...
  ]
}
```

## 拡張予定機能

- パーソナリティシステム: プレイヤーの性格診断に基づいたゲーム体験のカスタマイズ
- 関係性パラメータ: キャラクターとの関係を数値化
- 記憶バンク: 重要な記憶の保存と参照
- 特殊エフェクト: 記憶再生やAI共鳴モードなどの視覚効果

## ライセンス

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。

## 謝辞

- [React](https://reactjs.org/)
- [Styled Components](https://styled-components.com/)
- その他、このプロジェクトの開発に貢献したライブラリの開発者の皆様
