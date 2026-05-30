const REQUIRED_DECK_WEEK_COUNT = 52;
const WEEK_PREVIEW_LIMIT = 9;

const supportedDeckStatuses = new Set(["draft", "valid", "locked"]);

type DeckValidationDeckInput = {
  status: string | null;
};

type DeckValidationCardInput = {
  promptText?: string | null;
  weekNumber: number;
};

type DeckValidationIssueCode =
  | "missing-deck"
  | "unsupported-deck-status"
  | "missing-weeks"
  | "duplicate-weeks"
  | "blank-prompts";

type DeckValidationWarningCode =
  | "locking-not-built"
  | "start-game-not-built"
  | "saved-status-only";

type DeckValidationMessage = {
  code: DeckValidationIssueCode | DeckValidationWarningCode;
  message: string;
  weekNumbers?: number[];
};

type DeckValidationSummary = {
  representedWeeks: number;
  promptFilledCount: number;
  missingWeekCount: number;
  blankPromptCount: number;
};

type DeckValidationResult = {
  blankPromptWeekNumbers: number[];
  blockingIssues: DeckValidationMessage[];
  duplicateWeekNumbers: number[];
  isPromptComplete: boolean;
  isReadyForLocking: boolean;
  isStructurallyComplete: boolean;
  missingWeekNumbers: number[];
  summary: DeckValidationSummary;
  warnings: DeckValidationMessage[];
};

type ValidateDeckReadinessInput = {
  cards: DeckValidationCardInput[];
  deck: DeckValidationDeckInput | null;
};

function hasPromptText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function getExpectedWeekNumbers() {
  return Array.from({ length: REQUIRED_DECK_WEEK_COUNT }, (_, index) => index + 1);
}

function isExpectedWeekNumber(value: number) {
  return (
    Number.isInteger(value) && value >= 1 && value <= REQUIRED_DECK_WEEK_COUNT
  );
}

function formatWeekPreview(weekNumbers: number[]) {
  if (weekNumbers.length === 0) {
    return "None";
  }

  const preview = weekNumbers.slice(0, WEEK_PREVIEW_LIMIT).join(", ");
  const remainingCount = weekNumbers.length - WEEK_PREVIEW_LIMIT;

  return remainingCount > 0
    ? `${preview}... +${remainingCount} more`
    : preview;
}

function getWeekWord(count: number) {
  return count === 1 ? "week" : "weeks";
}

function getCardWord(count: number) {
  return count === 1 ? "card" : "cards";
}

function validateDeckReadiness({
  cards,
  deck
}: ValidateDeckReadinessInput): DeckValidationResult {
  const seenWeekNumbers = new Set<number>();
  const duplicateWeekNumbers = new Set<number>();
  const blankPromptWeekNumbers = new Set<number>();
  let promptFilledCount = 0;

  cards.forEach((card) => {
    if (hasPromptText(card.promptText)) {
      promptFilledCount += 1;
    } else if (isExpectedWeekNumber(card.weekNumber)) {
      blankPromptWeekNumbers.add(card.weekNumber);
    }

    if (!isExpectedWeekNumber(card.weekNumber)) {
      return;
    }

    if (seenWeekNumbers.has(card.weekNumber)) {
      duplicateWeekNumbers.add(card.weekNumber);
      return;
    }

    seenWeekNumbers.add(card.weekNumber);
  });

  const missingWeekNumbers = getExpectedWeekNumbers().filter(
    (weekNumber) => !seenWeekNumbers.has(weekNumber)
  );
  const sortedDuplicateWeekNumbers = [...duplicateWeekNumbers].sort(
    (first, second) => first - second
  );
  const sortedBlankPromptWeekNumbers = [...blankPromptWeekNumbers].sort(
    (first, second) => first - second
  );
  const deckStatusIsSupported =
    deck !== null && supportedDeckStatuses.has(deck.status ?? "");
  const isStructurallyComplete =
    missingWeekNumbers.length === 0 && sortedDuplicateWeekNumbers.length === 0;
  const isPromptComplete =
    isStructurallyComplete &&
    sortedBlankPromptWeekNumbers.length === 0 &&
    promptFilledCount === REQUIRED_DECK_WEEK_COUNT;
  const blockingIssues: DeckValidationMessage[] = [];

  if (!deck) {
    blockingIssues.push({
      code: "missing-deck",
      message: "Create a draft deck before deck readiness can be reviewed."
    });
  } else if (!deckStatusIsSupported) {
    blockingIssues.push({
      code: "unsupported-deck-status",
      message:
        "Deck status is not draft, valid, or locked, so readiness stays blocked."
    });
  }

  if (missingWeekNumbers.length > 0) {
    blockingIssues.push({
      code: "missing-weeks",
      message: `${missingWeekNumbers.length} ${getWeekWord(
        missingWeekNumbers.length
      )} missing: ${formatWeekPreview(missingWeekNumbers)}.`,
      weekNumbers: missingWeekNumbers
    });
  }

  if (sortedDuplicateWeekNumbers.length > 0) {
    blockingIssues.push({
      code: "duplicate-weeks",
      message: `Duplicate week ${getWeekWord(
        sortedDuplicateWeekNumbers.length
      )} found: ${formatWeekPreview(sortedDuplicateWeekNumbers)}.`,
      weekNumbers: sortedDuplicateWeekNumbers
    });
  }

  if (sortedBlankPromptWeekNumbers.length > 0) {
    blockingIssues.push({
      code: "blank-prompts",
      message: `${sortedBlankPromptWeekNumbers.length} represented ${getCardWord(
        sortedBlankPromptWeekNumbers.length
      )} ${sortedBlankPromptWeekNumbers.length === 1 ? "has" : "have"} blank prompt text: ${formatWeekPreview(
        sortedBlankPromptWeekNumbers
      )}.`,
      weekNumbers: sortedBlankPromptWeekNumbers
    });
  }

  const warnings: DeckValidationMessage[] = [
    {
      code: "locking-not-built",
      message: "Deck locking is not built yet."
    },
    {
      code: "start-game-not-built",
      message: "Start-game behavior is not built yet."
    }
  ];

  if (deck?.status === "valid" || deck?.status === "locked") {
    warnings.push({
      code: "saved-status-only",
      message:
        "Saved valid or locked status is reported only; this page does not change deck status."
    });
  }

  return {
    blankPromptWeekNumbers: sortedBlankPromptWeekNumbers,
    blockingIssues,
    duplicateWeekNumbers: sortedDuplicateWeekNumbers,
    isPromptComplete,
    isReadyForLocking:
      deckStatusIsSupported && isStructurallyComplete && isPromptComplete,
    isStructurallyComplete,
    missingWeekNumbers,
    summary: {
      blankPromptCount: sortedBlankPromptWeekNumbers.length,
      missingWeekCount: missingWeekNumbers.length,
      promptFilledCount,
      representedWeeks: seenWeekNumbers.size
    },
    warnings
  };
}

export { REQUIRED_DECK_WEEK_COUNT, validateDeckReadiness };
export type {
  DeckValidationCardInput,
  DeckValidationDeckInput,
  DeckValidationIssueCode,
  DeckValidationMessage,
  DeckValidationResult,
  DeckValidationSummary,
  DeckValidationWarningCode,
  ValidateDeckReadinessInput
};
