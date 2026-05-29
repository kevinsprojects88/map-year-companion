import assert from "node:assert/strict";
import test from "node:test";

const { validateCreateDraftDeckInput } = (await import(
  "./deck.schema" + ".ts"
)) as typeof import("./deck.schema");

const validGameId = "c54887e2-6ee1-46a2-9861-7a5894d697db";

test("accepts a valid game id for draft deck creation", () => {
  const validation = validateCreateDraftDeckInput({
    gameId: ` ${validGameId} `
  });

  assert.equal(validation.ok, true);

  if (validation.ok) {
    assert.equal(validation.data.gameId, validGameId);
  }
});

test("rejects a missing or invalid game id for draft deck creation", () => {
  const validation = validateCreateDraftDeckInput({
    gameId: "not-a-game-id"
  });

  assert.equal(validation.ok, false);

  if (!validation.ok) {
    assert.equal(
      validation.fieldErrors.gameId,
      "Choose a valid game before creating a draft deck."
    );
    assert.equal(validation.values.gameId, "not-a-game-id");
  }
});

test("reads draft deck creation input from FormData", () => {
  const formData = new FormData();
  formData.set("gameId", validGameId);

  const validation = validateCreateDraftDeckInput(formData);

  assert.equal(validation.ok, true);

  if (validation.ok) {
    assert.equal(validation.data.gameId, validGameId);
  }
});
