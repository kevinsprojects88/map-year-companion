import assert from "node:assert/strict";
import test from "node:test";

const { validateUpdateTurnOrderInput } = (await import(
  "./turn-order.schema" + ".ts"
)) as typeof import("./turn-order.schema");

const GAME_ID = "c54887e2-6ee1-46a2-9861-7a5894d697db";
const KEVIN_ID = "7d14147c-53d1-4883-9a50-c0e753382d7d";
const PLAYER_ID = "3f1a67db-351e-4f2b-a078-8c3d4656d8a1";

test("accepts a valid ordered list of profile ids", () => {
  const result = validateUpdateTurnOrderInput({
    gameId: GAME_ID,
    orderedProfileIds: [KEVIN_ID, PLAYER_ID]
  });

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.deepEqual(result.data, {
      gameId: GAME_ID,
      orderedProfileIds: [KEVIN_ID, PLAYER_ID]
    });
  }
});

test("rejects an invalid game id", () => {
  const result = validateUpdateTurnOrderInput({
    gameId: "not-a-game-id",
    orderedProfileIds: [KEVIN_ID]
  });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.deepEqual(result.fieldErrors, {
      gameId: "Choose a valid game before saving turn order."
    });
  }
});

test("rejects an empty ordered list", () => {
  const result = validateUpdateTurnOrderInput({
    gameId: GAME_ID,
    orderedProfileIds: []
  });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.deepEqual(result.fieldErrors, {
      orderedProfileIds: "Turn order must include at least one active member."
    });
  }
});

test("rejects invalid ordered profile ids", () => {
  const result = validateUpdateTurnOrderInput({
    gameId: GAME_ID,
    orderedProfileIds: [KEVIN_ID, "not-a-profile-id"]
  });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.deepEqual(result.fieldErrors, {
      orderedProfileIds: "Each turn order member id must be valid."
    });
  }
});

test("rejects duplicate ordered profile ids", () => {
  const result = validateUpdateTurnOrderInput({
    gameId: GAME_ID,
    orderedProfileIds: [KEVIN_ID, PLAYER_ID, KEVIN_ID]
  });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.deepEqual(result.fieldErrors, {
      orderedProfileIds: "Each active member can appear only once."
    });
  }
});

test("does not include caller-provided membership fields in validated data", () => {
  const result = validateUpdateTurnOrderInput({
    gameId: GAME_ID,
    orderedProfileIds: [PLAYER_ID, KEVIN_ID],
    role: "owner",
    status: "removed",
    turn_order_index: 99,
    user_id: "00000000-0000-0000-0000-000000000000"
  });

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.deepEqual(result.data, {
      gameId: GAME_ID,
      orderedProfileIds: [PLAYER_ID, KEVIN_ID]
    });
    assert.equal("role" in result.data, false);
    assert.equal("status" in result.data, false);
    assert.equal("turn_order_index" in result.data, false);
    assert.equal("user_id" in result.data, false);
  }
});
