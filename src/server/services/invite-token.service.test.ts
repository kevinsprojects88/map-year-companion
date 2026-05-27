import assert from "node:assert/strict";
import test from "node:test";

const { generateInviteToken, hashInviteToken } = (await import(
  "./invite-token.service" + ".ts"
)) as typeof import("./invite-token.service");

test("generates non-empty URL-safe invite tokens", () => {
  const token = generateInviteToken();

  assert.match(token, /^[A-Za-z0-9_-]+$/);
  assert.ok(token.length >= 43);
});

test("generates different invite tokens", () => {
  const firstToken = generateInviteToken();
  const secondToken = generateInviteToken();

  assert.notEqual(firstToken, secondToken);
});

test("hashes invite tokens deterministically without returning the raw token", () => {
  const token = "test-invite-token";
  const firstHash = hashInviteToken(token);
  const secondHash = hashInviteToken(token);

  assert.equal(firstHash, secondHash);
  assert.match(firstHash, /^[a-f0-9]{64}$/);
  assert.notEqual(firstHash, token);
});

test("produces different hashes for different invite tokens", () => {
  const firstHash = hashInviteToken("first-token");
  const secondHash = hashInviteToken("second-token");

  assert.notEqual(firstHash, secondHash);
});
