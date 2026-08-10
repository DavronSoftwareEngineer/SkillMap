import http from "node:http";
import { fileURLToPath } from "node:url";

const updates = new Map();
const port = Number(process.env.PORT || 3000);

function json(response, status, body) {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

export function handler(request, response) {
  const url = new URL(request.url || "/", "http://localhost");
  if (request.method === "GET" && url.pathname === "/health/live") return json(response, 200, { status: "ok" });
  if (request.method === "POST" && url.pathname === "/telegram/webhook") {
    const secret = request.headers["x-telegram-bot-api-secret-token"];
    if (!secret || secret !== (process.env.TELEGRAM_WEBHOOK_SECRET || "local-webhook-secret")) {
      return json(response, 401, { error: "invalid webhook secret" });
    }
    const updateId = request.headers["x-telegram-update-id"];
    if (!updateId || Array.isArray(updateId)) return json(response, 400, { error: "x-telegram-update-id is required" });
    const existing = updates.get(updateId);
    if (existing) return json(response, 200, { ...existing, duplicate: true });
    const event = { updateId, status: "accepted" };
    updates.set(updateId, event);
    return json(response, 202, event);
  }
  if (request.method === "POST" && url.pathname === "/miniapp/verify") {
    const state = request.headers["x-miniapp-state"];
    if (state !== "valid") return json(response, 401, { error: "invalid or expired initData" });
    return json(response, 200, { status: "verified" });
  }
  return json(response, 404, { error: "not found" });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  http.createServer(handler).listen(port, "0.0.0.0", () => console.log(`telegram lab listening on ${port}`));
}
