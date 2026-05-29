import assert from "node:assert/strict";
import test from "node:test";

const { validateUpsertDeckCardInput } = (await import(
  "./deck-card.schema" + ".ts"
)) as typeof import("./deck-card.schema");

const validGameId = "c54887e2-6ee1-46a2-9861-7a5894d697db";

test("accepts trimmed manual card entry values", () => {
  const validation = validateUpsertDeckCardInput({
    cardKey: " test-week-1 ",
    gameId: ` ${validGameId} `,
    promptText: " Placeholder text written by Kevin. ",
    season: " Spring ",
    weekNumber: "1"
  });

  assert.equal(validation.ok, true);

  if (validation.ok) {
    assert.deepEqual(validation.data, {
      cardKey: "test-week-1",
      gameId: validGameId,
      promptText: "Placeholder text written by Kevin.",
      season: "Spring",
      weekNumber: 1
    });
  }
});

test("stores blank optional prompt and season values as null", () => {
  const validation = validateUpsertDeckCardInput({
    cardKey: "test-week-2",
    gameId: validGameId,
    promptText: "   ",
    season: "",
    weekNumber: 2
  });

  assert.equal(validation.ok, true);

  if (validation.ok) {
    assert.equal(validation.data.promptText, null);
    assert.equal(validation.data.season, null);
  }
});

test("rejects invalid week number and missing card key", () => {
  const validation = validateUpsertDeckCardInput({
    cardKey: " ",
    gameId: validGameId,
    promptText: "Placeholder",
    weekNumber: "53"
  });

  assert.equal(validation.ok, false);

  if (!validation.ok) {
    assert.equal(
      validation.fieldErrors.weekNumber,
      "Week number must be between 1 and 52."
    );
    assert.equal(validation.fieldErrors.cardKey, "Card key is required.");
  }
});

test("rejects oversized card key, season, and prompt text values", () => {
  const validation = validateUpsertDeckCardInput({
    cardKey: "x".repeat(81),
    gameId: validGameId,
    promptText: "x".repeat(5001),
    season: "x".repeat(41),
    weekNumber: 1
  });

  assert.equal(validation.ok, false);

  if (!validation.ok) {
    assert.equal(
      validation.fieldErrors.cardKey,
      "Card key must be 80 characters or fewer."
    );
    assert.equal(
      validation.fieldErrors.promptText,
      "Prompt text must be 5000 characters or fewer."
    );
    assert.equal(
      validation.fieldErrors.season,
      "Season must be 40 characters or fewer."
    );
  }
});

test("reads manual card entry input from FormData", () => {
  const formData = new FormData();
  formData.set("cardKey", "test-week-3");
  formData.set("gameId", validGameId);
  formData.set("promptText", "Placeholder text.");
  formData.set("weekNumber", "3");

  const validation = validateUpsertDeckCardInput(formData);

  assert.equal(validation.ok, true);

  if (validation.ok) {
    assert.equal(validation.data.weekNumber, 3);
    assert.equal(validation.data.cardKey, "test-week-3");
  }
});
