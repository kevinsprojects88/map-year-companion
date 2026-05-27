import assert from "node:assert/strict";
import test from "node:test";

const { validateCreateGameInviteInput } = (await import(
  "./invite.schema" + ".ts"
)) as typeof import("./invite.schema");

test("accepts a valid game invite request", () => {
  const result = validateCreateGameInviteInput({
    expiresAt: "2999-01-01T00:00:00.000Z",
    gameId: "c54887e2-6ee1-46a2-9861-7a5894d697db",
    maxUses: "4"
  });

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.deepEqual(result.data, {
      expiresAt: "2999-01-01T00:00:00.000Z",
      gameId: "c54887e2-6ee1-46a2-9861-7a5894d697db",
      maxUses: 4
    });
  }
});

test("rejects an invalid game id", () => {
  const result = validateCreateGameInviteInput({
    gameId: "not-a-game-id"
  });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.deepEqual(result.fieldErrors, {
      gameId: "Choose a valid game before creating an invite."
    });
  }
});

test("rejects non-positive max uses", () => {
  const result = validateCreateGameInviteInput({
    gameId: "c54887e2-6ee1-46a2-9861-7a5894d697db",
    maxUses: "0"
  });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.deepEqual(result.fieldErrors, {
      maxUses: "Max uses must be a positive whole number."
    });
  }
});

test("rejects past expiration values", () => {
  const result = validateCreateGameInviteInput({
    expiresAt: "2000-01-01T00:00:00.000Z",
    gameId: "c54887e2-6ee1-46a2-9861-7a5894d697db"
  });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.deepEqual(result.fieldErrors, {
      expiresAt: "Expiration must be in the future."
    });
  }
});

test("does not include caller-provided invite storage fields in validated data", () => {
  const result = validateCreateGameInviteInput({
    created_by: "7d14147c-53d1-4883-9a50-c0e753382d7d",
    gameId: "c54887e2-6ee1-46a2-9861-7a5894d697db",
    token_hash: "caller-controlled-hash",
    used_count: 12
  });

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.deepEqual(result.data, {
      expiresAt: null,
      gameId: "c54887e2-6ee1-46a2-9861-7a5894d697db",
      maxUses: null
    });
    assert.equal("created_by" in result.data, false);
    assert.equal("token_hash" in result.data, false);
    assert.equal("used_count" in result.data, false);
  }
});
