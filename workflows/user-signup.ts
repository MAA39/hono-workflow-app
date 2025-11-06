import { sleep, FatalError } from "workflow";

/**
 * メインのワークフロー関数
 * ユーザー登録から段階的なオンボーディングまでを実行
 */
export async function handleUserSignup(email: string) {
  "use workflow";

  // Step 1: ユーザー作成
  const user = await createUser(email);
  
  // Step 2: ウェルカムメール送信
  await sendWelcomeEmail(user);
  
  // Step 3: 5秒待機（完全非同期・リソース消費なし）
  await sleep("5s");
  
  // Step 4: オンボーディングメール送信
  await sendOnboardingEmail(user);

  return { userId: user.id, status: "onboarded" };
}

/**
 * ユーザー作成ステップ
 */
async function createUser(email: string) {
  "use step";
  
  console.log(`Creating user with email: ${email}`);
  
  // ユーザーIDを生成して返す
  return {
    id: crypto.randomUUID(),
    email,
  };
}

/**
 * ウェルカムメール送信ステップ
 * 30%の確率でランダムエラー（再試行テスト用）
 */
async function sendWelcomeEmail(user: { id: string; email: string }) {
  "use step";
  
  console.log(`Sending welcome email to user: ${user.id}`);
  
  // ランダムエラーで再試行をシミュレート
  if (Math.random() < 0.3) {
    throw new Error("Network error - will retry");
  }
  
  console.log(`✅ Welcome email sent to ${user.email}`);
}

/**
 * オンボーディングメール送信ステップ
 * メールアドレスの検証付き
 */
async function sendOnboardingEmail(user: { id: string; email: string }) {
  "use step";
  
  // 不正なメールアドレスの場合は致命的エラー（再試行しない）
  if (!user.email.includes("@")) {
    throw new FatalError("Invalid email address");
  }
  
  console.log(`Sending onboarding email to user: ${user.id}`);
  console.log(`✅ Onboarding email sent to ${user.email}`);
}
