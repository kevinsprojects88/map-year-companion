const REQUIRED_DECK_WEEK_COUNT = 52;
const DEFAULT_MISSING_WEEK_PREVIEW_LIMIT = 9;

type DeckCoverageCardInput = {
  promptText?: string | null;
  weekNumber: number;
};

type DeckCoverageSummary = {
  allConfiguredCardsHavePromptText: boolean;
  allWeeksRepresented: boolean;
  blankPromptCount: number;
  configuredCardCount: number;
  duplicateWeekNumbers: number[];
  hasDuplicateWeekNumbers: boolean;
  missingWeekCount: number;
  missingWeekNumbers: number[];
  missingWeekPreviewLabel: string;
  promptFilledCount: number;
  uniqueWeekCount: number;
};

function hasPromptText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function getExpectedWeekNumbers(requiredWeekCount = REQUIRED_DECK_WEEK_COUNT) {
  return Array.from({ length: requiredWeekCount }, (_, index) => index + 1);
}

function isExpectedWeekNumber(value: number, requiredWeekCount: number) {
  return Number.isInteger(value) && value >= 1 && value <= requiredWeekCount;
}

function formatMissingWeekPreview(
  missingWeekNumbers: number[],
  previewLimit = DEFAULT_MISSING_WEEK_PREVIEW_LIMIT
) {
  if (missingWeekNumbers.length === 0) {
    return "None";
  }

  const preview = missingWeekNumbers.slice(0, previewLimit).join(", ");
  const remainingCount = missingWeekNumbers.length - previewLimit;

  return remainingCount > 0
    ? `${preview}... +${remainingCount} more`
    : preview;
}

function calculateDeckCoverage(
  cards: DeckCoverageCardInput[],
  requiredWeekCount = REQUIRED_DECK_WEEK_COUNT
): DeckCoverageSummary {
  const seenWeekNumbers = new Set<number>();
  const duplicateWeekNumbers = new Set<number>();
  const promptFilledCount = cards.filter((card) =>
    hasPromptText(card.promptText)
  ).length;

  cards.forEach((card) => {
    if (!isExpectedWeekNumber(card.weekNumber, requiredWeekCount)) {
      return;
    }

    if (seenWeekNumbers.has(card.weekNumber)) {
      duplicateWeekNumbers.add(card.weekNumber);
      return;
    }

    seenWeekNumbers.add(card.weekNumber);
  });

  const missingWeekNumbers = getExpectedWeekNumbers(requiredWeekCount).filter(
    (weekNumber) => !seenWeekNumbers.has(weekNumber)
  );
  const sortedDuplicateWeekNumbers = [...duplicateWeekNumbers].sort(
    (first, second) => first - second
  );

  return {
    allConfiguredCardsHavePromptText: promptFilledCount === cards.length,
    allWeeksRepresented: missingWeekNumbers.length === 0,
    blankPromptCount: cards.length - promptFilledCount,
    configuredCardCount: cards.length,
    duplicateWeekNumbers: sortedDuplicateWeekNumbers,
    hasDuplicateWeekNumbers: sortedDuplicateWeekNumbers.length > 0,
    missingWeekCount: missingWeekNumbers.length,
    missingWeekNumbers,
    missingWeekPreviewLabel: formatMissingWeekPreview(missingWeekNumbers),
    promptFilledCount,
    uniqueWeekCount: seenWeekNumbers.size
  };
}

export {
  REQUIRED_DECK_WEEK_COUNT,
  calculateDeckCoverage,
  formatMissingWeekPreview
};
export type { DeckCoverageCardInput, DeckCoverageSummary };
