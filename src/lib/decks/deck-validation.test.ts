import assert from "node:assert/strict";
import test from "node:test";

const { validateDeckReadiness } = (await import(
  "./deck-validation" + ".ts"
)) as typeof import("./deck-validation");

function buildPromptedDeckCards() {
  return Array.from({ length: 52 }, (_, index) => ({
    promptText: `User placeholder text ${index + 1}`,
    weekNumber: index + 1
  }));
}

test("blocks readiness when no deck exists", () => {
  const validation = validateDeckReadiness({
    cards: [],
    deck: null
  });

  assert.equal(validation.isStructurallyComplete, false);
  assert.equal(validation.isPromptComplete, false);
  assert.equal(validation.isReadyForLocking, false);
  assert.equal(validation.summary.representedWeeks, 0);
  assert.equal(validation.summary.promptFilledCount, 0);
  assert.equal(validation.summary.missingWeekCount, 52);
  assert.equal(validation.summary.blankPromptCount, 0);
  assert.deepEqual(
    validation.blockingIssues.map((issue) => issue.code),
    ["missing-deck", "missing-weeks"]
  );
});

test("reports missing weeks while counting represented prompted cards", () => {
  const validation = validateDeckReadiness({
    cards: [
      {
        promptText: "User placeholder text.",
        weekNumber: 1
      }
    ],
    deck: {
      status: "draft"
    }
  });

  assert.equal(validation.isStructurallyComplete, false);
  assert.equal(validation.isPromptComplete, false);
  assert.equal(validation.isReadyForLocking, false);
  assert.equal(validation.summary.representedWeeks, 1);
  assert.equal(validation.summary.promptFilledCount, 1);
  assert.equal(validation.summary.missingWeekCount, 51);
  assert.equal(validation.summary.blankPromptCount, 0);
  assert.deepEqual(validation.missingWeekNumbers.slice(0, 3), [2, 3, 4]);
});

test("reports duplicate weeks and blank prompt weeks", () => {
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
    deck: {
      status: "draft"
    }
  });

  assert.equal(validation.isStructurallyComplete, false);
  assert.equal(validation.isPromptComplete, false);
  assert.equal(validation.isReadyForLocking, false);
  assert.deepEqual(validation.duplicateWeekNumbers, [1]);
  assert.deepEqual(validation.blankPromptWeekNumbers, [2]);
  assert.deepEqual(
    validation.blockingIssues.map((issue) => issue.code),
    ["missing-weeks", "duplicate-weeks", "blank-prompts"]
  );
});

test("marks a full prompted draft deck ready for locking without mutating it", () => {
  const validation = validateDeckReadiness({
    cards: buildPromptedDeckCards(),
    deck: {
      status: "draft"
    }
  });

  assert.equal(validation.isStructurallyComplete, true);
  assert.equal(validation.isPromptComplete, true);
  assert.equal(validation.isReadyForLocking, true);
  assert.deepEqual(validation.blockingIssues, []);
  assert.equal(validation.summary.representedWeeks, 52);
  assert.equal(validation.summary.promptFilledCount, 52);
  assert.match(
    validation.warnings.map((warning) => warning.message).join(" "),
    /locking re-runs validation at mutation time/i
  );
});

test("handles unexpected deck statuses conservatively", () => {
  const validation = validateDeckReadiness({
    cards: buildPromptedDeckCards(),
    deck: {
      status: "archived"
    }
  });

  assert.equal(validation.isStructurallyComplete, true);
  assert.equal(validation.isPromptComplete, true);
  assert.equal(validation.isReadyForLocking, false);
  assert.deepEqual(
    validation.blockingIssues.map((issue) => issue.code),
    ["unsupported-deck-status"]
  );
});
