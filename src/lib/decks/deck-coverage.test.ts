import assert from "node:assert/strict";
import test from "node:test";

const { calculateDeckCoverage, formatMissingWeekPreview } = (await import(
  "./deck-coverage" + ".ts"
)) as typeof import("./deck-coverage");

function buildPromptedDeckCards() {
  return Array.from({ length: 52 }, (_, index) => ({
    promptText: `User placeholder text ${index + 1}`,
    weekNumber: index + 1
  }));
}

test("calculates empty deck coverage from weeks 1 through 52", () => {
  const coverage = calculateDeckCoverage([]);

  assert.equal(coverage.configuredCardCount, 0);
  assert.equal(coverage.uniqueWeekCount, 0);
  assert.equal(coverage.promptFilledCount, 0);
  assert.equal(coverage.blankPromptCount, 0);
  assert.equal(coverage.missingWeekCount, 52);
  assert.equal(coverage.missingWeekNumbers[0], 1);
  assert.equal(coverage.missingWeekNumbers.at(-1), 52);
  assert.equal(coverage.allWeeksRepresented, false);
  assert.equal(coverage.allConfiguredCardsHavePromptText, true);
});

test("counts prompted and blank configured card rows", () => {
  const coverage = calculateDeckCoverage([
    {
      promptText: " User placeholder text. ",
      weekNumber: 1
    },
    {
      promptText: "",
      weekNumber: 2
    },
    {
      promptText: null,
      weekNumber: 4
    }
  ]);

  assert.equal(coverage.configuredCardCount, 3);
  assert.equal(coverage.uniqueWeekCount, 3);
  assert.equal(coverage.promptFilledCount, 1);
  assert.equal(coverage.blankPromptCount, 2);
  assert.deepEqual(coverage.missingWeekNumbers.slice(0, 3), [3, 5, 6]);
  assert.equal(coverage.allConfiguredCardsHavePromptText, false);
});

test("detects duplicate week numbers even though the database should prevent them", () => {
  const coverage = calculateDeckCoverage([
    {
      promptText: "User placeholder text.",
      weekNumber: 1
    },
    {
      promptText: "Another user placeholder text.",
      weekNumber: 1
    }
  ]);

  assert.deepEqual(coverage.duplicateWeekNumbers, [1]);
  assert.equal(coverage.hasDuplicateWeekNumbers, true);
  assert.equal(coverage.uniqueWeekCount, 1);
});

test("marks a fully represented prompted deck as covered", () => {
  const coverage = calculateDeckCoverage(buildPromptedDeckCards());

  assert.equal(coverage.configuredCardCount, 52);
  assert.equal(coverage.uniqueWeekCount, 52);
  assert.equal(coverage.promptFilledCount, 52);
  assert.equal(coverage.blankPromptCount, 0);
  assert.deepEqual(coverage.missingWeekNumbers, []);
  assert.equal(coverage.allWeeksRepresented, true);
  assert.equal(coverage.allConfiguredCardsHavePromptText, true);
});

test("formats missing week previews compactly", () => {
  assert.equal(
    formatMissingWeekPreview(
      Array.from({ length: 51 }, (_, index) => index + 2)
    ),
    "2, 3, 4, 5, 6, 7, 8, 9, 10... +42 more"
  );
  assert.equal(formatMissingWeekPreview([]), "None");
});
