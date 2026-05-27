import assert from "node:assert/strict";
import test from "node:test";

const { hashInviteToken } = (await import(
  "../../server/services/invite-token.service" + ".ts"
)) as typeof import("../../server/services/invite-token.service");
const { validateAcceptGameInviteInput, validateCreateGameInviteInput } = (await import(
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

test("trims a valid raw invite token for acceptance", () => {
  const result = validateAcceptGameInviteInput({
    token: "  AbCdEfGhIjKlMnOpQrStUvWxYz0123456789_-abcdE  "
  });

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.deepEqual(result.data, {
      token: "AbCdEfGhIjKlMnOpQrStUvWxYz0123456789_-abcdE"
    });
  }
});

test("rejects missing and unsafe invite acceptance tokens", () => {
  const missingResult = validateAcceptGameInviteInput({});
  const unsafeResult = validateAcceptGameInviteInput({
    token: "not/a-valid+url-token="
  });

  assert.equal(missingResult.ok, false);
  assert.equal(unsafeResult.ok, false);

  if (!missingResult.ok) {
    assert.deepEqual(missingResult.fieldErrors, {
      token: "Enter a valid invite token."
    });
  }

  if (!unsafeResult.ok) {
    assert.deepEqual(unsafeResult.fieldErrors, {
      token: "Invite token must use only URL-safe characters."
    });
  }
});

test("does not accept caller-provided invite acceptance authority fields", () => {
  const result = validateAcceptGameInviteInput({
    game_id: "c54887e2-6ee1-46a2-9861-7a5894d697db",
    role: "owner",
    status: "active",
    token: "AbCdEfGhIjKlMnOpQrStUvWxYz0123456789_-abcdE",
    token_hash: "caller-controlled-hash",
    user_id: "7d14147c-53d1-4883-9a50-c0e753382d7d"
  });

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.deepEqual(result.data, {
      token: "AbCdEfGhIjKlMnOpQrStUvWxYz0123456789_-abcdE"
    });
    assert.equal("game_id" in result.data, false);
    assert.equal("role" in result.data, false);
    assert.equal("status" in result.data, false);
    assert.equal("token_hash" in result.data, false);
    assert.equal("user_id" in result.data, false);
  }
});

test("hashes the validated raw invite token instead of caller hash fields", () => {
  const result = validateAcceptGameInviteInput({
    token: "  AbCdEfGhIjKlMnOpQrStUvWxYz0123456789_-abcdE  ",
    token_hash: "caller-controlled-hash"
  });

  assert.equal(result.ok, true);

  if (result.ok) {
    const tokenHash = hashInviteToken(result.data.token);

    assert.match(tokenHash, /^[a-f0-9]{64}$/);
    assert.notEqual(tokenHash, result.data.token);
    assert.notEqual(tokenHash, "caller-controlled-hash");
  }
});
