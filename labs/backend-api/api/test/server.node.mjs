import assert from "node:assert/strict";
import { test } from "node:test";
import { handler } from "../src/server.mjs";

function request(method, path, headers = {}) {
  return new Promise((resolve) => {
    const response = { writeHead: (status) => { response.status = status; }, end: (body) => resolve({ status: response.status, body: JSON.parse(body) }) };
    handler({ method, url: path, headers }, response);
  });
}

test("liveness is public", async () => {
  assert.deepEqual(await request("GET", "/health/live"), { status: 200, body: { status: "ok" } });
});

test("job creation requires an idempotency key", async () => {
  assert.equal((await request("POST", "/jobs")).status, 400);
});

test("the same idempotency key returns the same job", async () => {
  const first = await request("POST", "/jobs", { "idempotency-key": "test-key" });
  const second = await request("POST", "/jobs", { "idempotency-key": "test-key" });
  assert.equal(first.status, 202);
  assert.equal(second.status, 200);
  assert.equal(first.body.id, second.body.id);
});
