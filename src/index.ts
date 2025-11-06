import { Hono } from "hono";
import { start } from "workflow/api";
import { handleUserSignup } from "../workflows/user-signup.js";

const app = new Hono();

// ヘルスチェック
app.get("/", (c) => {
  return c.json({
    message: "Hono × Workflow DevKit API",
    endpoints: [
      "POST /api/signup - Start user signup workflow",
      "GET /health - Health check",
    ],
  });
});

// ヘルスチェック用エンドポイント
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

/**
 * ユーザー登録ワークフローを開始するエンドポイント
 * 
 * Body: { "email": "user@example.com" }
 */
app.post("/api/signup", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }
    
    // ワークフローを開始（バックグラウンドで実行される）
    await start(handleUserSignup, [email]);
    
    return c.json({
      message: "User signup workflow started",
      email,
    });
  } catch (error) {
    console.error("Error starting workflow:", error);
    return c.json(
      { error: "Failed to start workflow" },
      500
    );
  }
});

export default app;
