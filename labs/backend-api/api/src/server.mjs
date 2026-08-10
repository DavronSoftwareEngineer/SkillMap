import http from "node:http";
import net from "node:net";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT || 3000);
const jobs = new Map();

export function canConnect(host, targetPort, timeoutMs = 500) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port: targetPort });
    const finish = (result) => { socket.destroy(); resolve(result); };
    socket.setTimeout(timeoutMs, () => finish(false));
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
  });
}

export async function handler(request, response) {
  const url = new URL(request.url || "/", "http://localhost");
  const json = (status, body) => {
    response.writeHead(status, { "content-type": "application/json" });
    response.end(JSON.stringify(body));
  };

  if (request.method === "GET" && url.pathname === "/health/live") return json(200, { status: "ok" });
  if (request.method === "GET" && url.pathname === "/health/ready") {
    const [postgres, redis] = await Promise.all([
      canConnect(process.env.POSTGRES_HOST || "127.0.0.1", 5432),
      canConnect(process.env.REDIS_HOST || "127.0.0.1", 6379),
    ]);
    return json(postgres && redis ? 200 : 503, { status: postgres && redis ? "ready" : "unavailable" });
  }
  if (request.method === "POST" && url.pathname === "/jobs") {
    const key = request.headers["idempotency-key"];
    if (!key || Array.isArray(key)) return json(400, { error: "Idempotency-Key header is required" });
    const existing = jobs.get(key);
    if (existing) return json(200, existing);
    const job = { id: crypto.randomUUID(), status: "queued", key };
    jobs.set(key, job);
    return json(202, job);
  }
  return json(404, { error: "not found" });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  http.createServer(handler).listen(port, "0.0.0.0", () => console.log(`backend lab listening on ${port}`));
}
