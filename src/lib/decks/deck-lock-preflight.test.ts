import assert from "node:assert/strict";
import test from "node:test";

const { validateDeckReadiness } = (await import(
  "./deck-validation" + ".ts"
)) as typeof import("./deck-validation");
const { buildDeckLockPreflight } = (await import(
  "./deck-lock-preflight" + ".ts"
)) as typeof import("./deck-lock-preflight");

function buildPromptedDeckCards() {
  return Array.from({ length: 52 }, (_, index) => ({
    promptText: `User placeholder text ${index + 1}`,
    weekNumber: index + 1
  }));
}

test("blocks lock preflight when no deck exists", () => {
  const validation = validateDeckReadiness({
    cards: [],
    deck: null
  });
  const preflight = buildDeckLockPreflight({
    deck: null,
    validation
  });

  assert.equal(preflight.canLock, false);
  assert.deepEqual(
    preflight.blockers.map((blocker) => blocker.code),
    ["missing-deck", "missing-weeks"]
  );
  assert.deepEqual(preflight.summary, {
    blankPromptCount: 0,
    missingWeekCount: 52,
    promptFilledCount: 0,
    representedWeeks: 0
  });
});

test("blocks lock preflight for missing weeks, duplicate weeks, and blank prompts", () => {
  const deck = {
    status: "draft"
  };
  const validation = validateDeckReadiness({
    cards: [
      {
        promptText: "User placeholder text.",
        weekNumber: 1
      },
      {
        promptText: "Duplicate user placeholder text.",
        weekNumber: 1
      },
      {
        promptText: " ",
        weekNumber: 2
      }
    ],
    deck
  });
  const preflight = buildDeckLockPreflight({
    deck,
    validation
  });

  assert.equal(preflight.canLock, false);
  assert.deepEqual(
    preflight.blockers.map((blocker) => blocker.code),
    ["missing-weeks", "duplicate-weeks", "blank-prompts"]
  );
  assert.deepEqual(preflight.summary, {
    blankPromptCount: 1,
    missingWeekCount: 50,
    promptFilledCount: 2,
    representedWeeks: 2
  });
});

test("blocks lock preflight until all represented weeks have prompt text", () => {
  const deck = {
    status: "draft"
  };
  const cards = buildPromptedDeckCards();
  cards[51] = {
    promptText: " ",
    weekNumber: 52
  };
  const validation = validateDeckReadiness({
    cards,
    deck
  });
  const preflight = buildDeckLockPreflight({
    deck,
    validation
  });

  assert.equal(preflight.canLock, false);
  assert.deepEqual(
    preflight.blockers.map((blocker) => blocker.code),
    ["blank-prompts"]
  );
  assert.equal(preflight.summary.representedWeeks, 52);
  assert.equal(preflight.summary.promptFilledCount, 51);
  assert.equal(preflight.summary.blankPromptCount, 1);
});

test("marks a complete draft deck eligible for locking", () => {
  const deck = {
    status: "draft"
  };
  const validation = validateDeckReadiness({
    cards: buildPromptedDeckCards(),
    deck
  });
  const preflight = buildDeckLockPreflight({
    deck,
    validation
  });

  assert.equal(preflight.canLock, true);
  assert.deepEqual(preflight.blockers, []);
  assert.deepEqual(preflight.summary, {
    blankPromptCount: 0,
    missingWeekCount: 0,
    promptFilledCount: 52,
    representedWeeks: 52
  });
  assert.match(
    preflight.warnings.map((warning) => warning.message).join(" "),
    /locking re-runs validation at mutation time/i
  );
});

test("handles non-draft deck status safely without allowing a lock", () => {
  const deck = {
    status: "valid"
  };
  const validation = validateDeckReadiness({
    cards: buildPromptedDeckCards(),
    deck
  });
  const preflight = buildDeckLockPreflight({
    deck,
    validation
  });

  assert.equal(preflight.canLock, false);
  assert.deepEqual(
    preflight.blockers.map((blocker) => blocker.code),
    ["non-draft-deck-status"]
  );
  assert.match(
    preflight.warnings.map((warning) => warning.message).join(" "),
    /does not change deck status/i
  );
});
