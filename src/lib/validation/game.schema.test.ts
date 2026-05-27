import assert from "node:assert/strict";
import test from "node:test";

const { GAME_NAME_MAX_LENGTH, validateCreateGameInput } = (await import(
  "./game.schema" + ".ts"
)) as typeof import("./game.schema");

test("trims a valid game name and description", () => {
  const result = validateCreateGameInput({
    description: "  A quiet shared map.  ",
    name: "  Frost Harbor  "
  });

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.deepEqual(result.data, {
      description: "A quiet shared map.",
      name: "Frost Harbor"
    });
  }
});

test("rejects an empty game name", () => {
  const result = validateCreateGameInput({ name: "   " });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.deepEqual(result.fieldErrors, {
      name: "Enter a game name."
    });
  }
});

test("rejects an overlong game name", () => {
  const result = validateCreateGameInput({
    name: "a".repeat(GAME_NAME_MAX_LENGTH + 1)
  });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.deepEqual(result.fieldErrors, {
      name: "Game name must be 120 characters or fewer."
    });
  }
});

test("does not include caller-provided ownership fields in validated data", () => {
  const result = validateCreateGameInput({
    name: "Lowland Year",
    owner_id: "00000000-0000-0000-0000-000000000000",
    role: "owner",
    status: "active"
  });

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.deepEqual(result.data, {
      description: null,
      name: "Lowland Year"
    });
    assert.equal("owner_id" in result.data, false);
    assert.equal("role" in result.data, false);
    assert.equal("status" in result.data, false);
  }
});

test("returns values and field errors for validation failures", () => {
  const result = validateCreateGameInput({
    description: "  Draft setup notes  ",
    name: ""
  });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.deepEqual(result.values, {
      description: "Draft setup notes",
      name: ""
    });
    assert.deepEqual(result.fieldErrors, {
      name: "Enter a game name."
    });
  }
});
