# 🚀 Hono × Workflow DevKit

Durable Workflow（耐久ワークフロー）を実装したサンプルアプリケーション。

Hono + Nitro + Vercel Workflow DevKitを使って、中断・再開可能な非同期処理を実現します。

## ✨ 特徴

- **Durable Execution**: プロセスが落ちても自動で再開
- **完全非同期Sleep**: `sleep("5s")` でリソースを消費せず待機
- **自動リトライ**: エラー時の再試行を自動処理
- **型安全**: TypeScriptで完全に型付け
- **軽量**: Next.js不要のシンプル構成

## 🏗️ アーキテクチャ

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/signup
       ▼
┌──────────────────────────────┐
│     Hono API Server         │
│  (src/index.ts)             │
└──────┬───────────────────────┘
       │ start(workflow)
       ▼
┌──────────────────────────────┐
│   Workflow Engine           │
│  (workflows/user-signup.ts) │
├─────────────────────────────┤
│ Step 1: createUser          │
│ Step 2: sendWelcomeEmail    │
│ Step 3: sleep("5s")         │
│ Step 4: sendOnboardingEmail │
└─────────────────────────────┘
```

## 📦 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバー起動

```bash
npm run dev
```

サーバーが http://localhost:3000 で起動します。

## 🧪 使い方

### ワークフローをトリガー

```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

レスポンス:
```json
{
  "message": "User signup workflow started",
  "email": "test@example.com"
}
```

### ワークフロー実行状況を確認

```bash
npx workflow inspect runs --web
```

ブラウザでワークフローの実行状況、各ステップの成功/失敗、リトライ回数などを確認できます。

## 📁 プロジェクト構造

```
hono-workflow-app/
├── src/
│   └── index.ts              # Hono APIサーバー
├── workflows/
│   └── user-signup.ts        # ワークフロー定義
├── nitro.config.ts           # Nitro設定
├── tsconfig.json             # TypeScript設定
└── package.json
```

## 🔍 主要コンポーネント

### Workflow関数 (`"use workflow"`)

複数のステップをオーケストレーションする関数。全体の実行フローを管理します。

```typescript
export async function handleUserSignup(email: string) {
  "use workflow";
  // ステップを順次実行
}
```

### Step関数 (`"use step"`)

個別の処理単位。独立して実行され、失敗時は自動でリトライされます。

```typescript
async function createUser(email: string) {
  "use step";
  // 個別の処理
}
```

### Sleep制御

CPU/メモリを消費せず、指定時間後に自動再開します。

```typescript
await sleep("5s");   // 5秒
await sleep("2m");   // 2分
await sleep("1h");   // 1時間
await sleep("7d");   // 7日
```

## 🚢 デプロイ

### Vercelへのデプロイ（推奨）

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel
```

設定不要でそのままデプロイできます。

### その他の環境

他の環境へのデプロイについては、Workflow DevKitの[公式ドキュメント](https://vercel.com/docs/workflow)を参照してください。

## 📚 学習リソース

- [Hono公式ドキュメント](https://hono.dev/)
- [Workflow DevKit公式ドキュメント](https://vercel.com/docs/workflow)
- [Nitroドキュメント](https://nitro.unjs.io/)

## 🧩 ユースケース例

- **メールキャンペーン**: 送信 → sleep → リマインド送信
- **決済処理**: 支払い → 確認 → レシート発行
- **定期通知**: sleep("24h") で日次通知
- **長時間ジョブ**: データ処理を段階的に実行

## 📝 ライセンス

MIT
