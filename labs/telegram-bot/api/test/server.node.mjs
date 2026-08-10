import assert from "node:assert/strict";
import { test } from "node:test";
import { handler } from "../src/server.mjs";

function request(method, path, headers = {}) {
  return new Promise((resolve) => {
    const response = { writeHead: (status) => { response.status = status; }, end: (body) => resolve({ status: response.status, body: JSON.parse(body) }) };
    handler({ method, url: path, headers }, response);
  });
}

test("webhook rejects an invalid secret", async () => {
  assert.equal((await request("POST", "/telegram/webhook", { "x-telegram-update-id": "1" })).status, 401);
});

test("duplicate Telegram update is idempotent", async () => {
  const headers = { "x-telegram-bot-api-secret-token": "local-webhook-secret", "x-telegram-update-id": "42" };
  assert.equal((await request("POST", "/telegram/webhook", headers)).status, 202);
  const duplicate = await request("POST", "/telegram/webhook", headers);
  assert.equal(duplicate.status, 200);
  assert.equal(duplicate.body.duplicate, true);
});

test("Mini App rejects invalid or expired state", async () => {
  assert.equal((await request("POST", "/miniapp/verify", { "x-miniapp-state": "expired" })).status, 401);
});
