import type {
  DeckValidationDeckInput,
  DeckValidationIssueCode,
  DeckValidationMessage,
  DeckValidationResult,
  DeckValidationSummary,
  DeckValidationWarningCode
} from "./deck-validation";

const REQUIRED_DECK_LOCK_WEEK_COUNT = 52;

type DeckLockPreflightBlockerCode =
  | DeckValidationIssueCode
  | "non-draft-deck-status";

type DeckLockPreflightWarningCode =
  | DeckValidationWarningCode
  | "read-only-preflight";

type DeckLockPreflightMessage = Omit<DeckValidationMessage, "code"> & {
  code: DeckLockPreflightBlockerCode | DeckLockPreflightWarningCode;
};

type DeckLockPreflightResult = {
  canLock: boolean;
  blockers: DeckLockPreflightMessage[];
  warnings: DeckLockPreflightMessage[];
  summary: DeckValidationSummary;
};

type BuildDeckLockPreflightInput = {
  deck: DeckValidationDeckInput | null;
  validation: DeckValidationResult;
};

function buildNonDraftDeckStatusBlocker(
  deck: DeckValidationDeckInput
): DeckLockPreflightMessage | null {
  if (deck.status === "draft") {
    return null;
  }

  return {
    code: "non-draft-deck-status",
    message:
      "Only draft decks are eligible for locking. This preflight does not change deck status."
  };
}

function buildDeckLockPreflight({
  deck,
  validation
}: BuildDeckLockPreflightInput): DeckLockPreflightResult {
  const nonDraftStatusBlocker = deck
    ? buildNonDraftDeckStatusBlocker(deck)
    : null;
  const blockers: DeckLockPreflightMessage[] = [
    ...validation.blockingIssues,
    ...(nonDraftStatusBlocker ? [nonDraftStatusBlocker] : [])
  ];
  const hasRequiredCounts =
    validation.summary.representedWeeks === REQUIRED_DECK_LOCK_WEEK_COUNT &&
    validation.summary.promptFilledCount === REQUIRED_DECK_LOCK_WEEK_COUNT &&
    validation.summary.missingWeekCount === 0 &&
    validation.summary.blankPromptCount === 0;
  const canLock =
    Boolean(deck) &&
    deck?.status === "draft" &&
    validation.isReadyForLocking &&
    hasRequiredCounts &&
    validation.duplicateWeekNumbers.length === 0 &&
    blockers.length === 0;

  return {
    blockers,
    canLock,
    summary: validation.summary,
    warnings: [
      ...validation.warnings,
      {
        code: "read-only-preflight",
        message:
          "This preflight does not change deck status by itself; the lock action rechecks these rules before locking."
      }
    ]
  };
}

export { buildDeckLockPreflight };
export type {
  BuildDeckLockPreflightInput,
  DeckLockPreflightBlockerCode,
  DeckLockPreflightMessage,
  DeckLockPreflightResult,
  DeckLockPreflightWarningCode
};
