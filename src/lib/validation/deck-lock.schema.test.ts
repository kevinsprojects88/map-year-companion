import assert from "node:assert/strict";
import test from "node:test";

const { validateLockDeckInput } = (await import(
  "./deck-lock.schema" + ".ts"
)) as typeof import("./deck-lock.schema");

const VALID_GAME_ID = "c54887e2-6ee1-46a2-9861-7a5894d697db";

test("accepts a valid game id for deck locking", () => {
  const validation = validateLockDeckInput({
    gameId: VALID_GAME_ID
  });

  assert.equal(validation.ok, true);

  if (validation.ok) {
    assert.equal(validation.data.gameId, VALID_GAME_ID);
    assert.deepEqual(validation.values, {
      gameId: VALID_GAME_ID
    });
  }
});

test("rejects a missing or invalid game id for deck locking", () => {
  const validation = validateLockDeckInput({
    gameId: "not-a-game-id"
  });

  assert.equal(validation.ok, false);

  if (!validation.ok) {
    assert.equal(
      validation.fieldErrors.gameId,
      "Choose a valid game before locking the deck."
    );
    assert.deepEqual(validation.values, {
      gameId: "not-a-game-id"
    });
  }
});

test("reads deck lock input from FormData", () => {
  const formData = new FormData();
  formData.set("gameId", VALID_GAME_ID);

  const validation = validateLockDeckInput(formData);

  assert.equal(validation.ok, true);

  if (validation.ok) {
    assert.equal(validation.data.gameId, VALID_GAME_ID);
  }
});
