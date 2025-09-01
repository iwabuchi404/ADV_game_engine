# AIの鏡像 - ビジュアルノベルゲーム

## 概要
AIの鏡像は、React + TypeScript + Viteで構築されたビジュアルノベルゲームです。

## 開発環境のセットアップ

### 必要な環境
- Node.js 18以上
- npm

### インストール
```bash
npm install
```

### 開発サーバーの起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

## GitHub Pagesでの公開

### 1. リポジトリの設定
1. GitHubリポジトリの設定ページに移動
2. 「Pages」セクションを開く
3. Sourceを「GitHub Actions」に設定

### 2. 環境変数の設定
リポジトリの設定で以下の環境変数を設定：
- `NODE_ENV`: `production`

### 3. デプロイ
mainブランチにプッシュすると自動的にデプロイされます：
```bash
git add .
git commit -m "Update game"
git push origin main
```

### 4. カスタムドメイン（オプション）
カスタムドメインを使用する場合は、`vite.config.ts`の`base`パスを調整してください。

## プロジェクト構造
```
src/
├── components/     # Reactコンポーネント
├── contexts/      # React Context
├── core/          # ゲームエンジン
├── data/          # ゲームデータ
├── types/         # TypeScript型定義
└── utils/         # ユーティリティ関数
```

## 技術スタック
- React 18
- TypeScript
- Vite
- Vanilla Extract (CSS-in-JS)
- GitHub Actions (CI/CD)

## ライセンス
このプロジェクトはMITライセンスの下で公開されています。
