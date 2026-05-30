import type { LobbyGameStatus } from "../../types/lobby";
import type { DeckSetupReadinessInput } from "../../types/deck";
import type {
  SetupChecklistItem,
  SetupReadinessSummary
} from "../../types/setup";

type SetupReadinessRosterMember = {
  displayName: string;
  turnOrderIndex: number | null;
};

type BuildLobbySetupReadinessInput = {
  deckSetup: DeckSetupReadinessInput;
  gameStatus: LobbyGameStatus;
  gameStatusLabel: string;
  isOwnerAdmin: boolean;
  memberCount: number;
  memberCountLabel: string;
  rosterMembers: SetupReadinessRosterMember[];
};

type LobbySetupReadiness = {
  items: SetupChecklistItem[];
  summary: SetupReadinessSummary;
};

const REQUIRED_DECK_CARD_COUNT = 52;

function getDuplicateTurnOrderIndexes(rosterMembers: SetupReadinessRosterMember[]) {
  const seenIndexes = new Set<number>();
  const duplicateIndexes = new Set<number>();

  rosterMembers.forEach((member) => {
    if (member.turnOrderIndex === null) {
      return;
    }

    if (seenIndexes.has(member.turnOrderIndex)) {
      duplicateIndexes.add(member.turnOrderIndex);
      return;
    }

    seenIndexes.add(member.turnOrderIndex);
  });

  return [...duplicateIndexes].sort((first, second) => first - second);
}

function formatAreaList(areaLabels: string[]) {
  return areaLabels.length ? areaLabels.join(", ") : "None";
}

function formatWeekPreview(weekNumbers: number[]) {
  if (weekNumbers.length === 0) {
    return "None";
  }

  const preview = weekNumbers.slice(0, 9).join(", ");
  const remainingCount = weekNumbers.length - 9;

  return remainingCount > 0
    ? `${preview}... +${remainingCount} more`
    : preview;
}

function getDeckSetupCoverage(deckSetup: DeckSetupReadinessInput) {
  if (deckSetup.validation) {
    return {
      allConfiguredCardsHavePromptText:
        deckSetup.validation.blankPromptWeekNumbers.length === 0,
      allWeeksRepresented: deckSetup.validation.summary.missingWeekCount === 0,
      blankPromptCount: deckSetup.validation.summary.blankPromptCount,
      duplicateWeekNumbers: deckSetup.validation.duplicateWeekNumbers,
      hasDuplicateWeekNumbers:
        deckSetup.validation.duplicateWeekNumbers.length > 0,
      missingWeekCount: deckSetup.validation.summary.missingWeekCount,
      missingWeekPreviewLabel:
        deckSetup.missingWeekPreviewLabel ??
        formatWeekPreview(deckSetup.validation.missingWeekNumbers),
      promptTextCount: deckSetup.validation.summary.promptFilledCount,
      uniqueWeekCount: deckSetup.validation.summary.representedWeeks
    };
  }

  const promptTextCount = deckSetup.promptTextCount ?? 0;
  const uniqueWeekCount =
    deckSetup.uniqueWeekCount ??
    Math.min(deckSetup.cardCount, REQUIRED_DECK_CARD_COUNT);
  const blankPromptCount =
    deckSetup.blankPromptCount ??
    Math.max(deckSetup.cardCount - promptTextCount, 0);
  const missingWeekCount =
    deckSetup.missingWeekCount ??
    Math.max(REQUIRED_DECK_CARD_COUNT - uniqueWeekCount, 0);

  return {
    allConfiguredCardsHavePromptText:
      deckSetup.allConfiguredCardsHavePromptText ??
      promptTextCount === deckSetup.cardCount,
    allWeeksRepresented:
      deckSetup.allWeeksRepresented ?? uniqueWeekCount >= REQUIRED_DECK_CARD_COUNT,
    blankPromptCount,
    duplicateWeekNumbers: deckSetup.duplicateWeekNumbers ?? [],
    hasDuplicateWeekNumbers: deckSetup.hasDuplicateWeekNumbers ?? false,
    missingWeekCount,
    missingWeekPreviewLabel: deckSetup.missingWeekPreviewLabel ?? "None",
    promptTextCount,
    uniqueWeekCount
  };
}

function isDeckSetupComplete(deckSetup: DeckSetupReadinessInput) {
  const coverage = getDeckSetupCoverage(deckSetup);
  const isReadyForLocking =
    deckSetup.validation?.isReadyForLocking ??
    (coverage.allWeeksRepresented &&
      coverage.allConfiguredCardsHavePromptText &&
      !coverage.hasDuplicateWeekNumbers);

  return (
    deckSetup.deckId !== null &&
    isReadyForLocking &&
    (deckSetup.status === "valid" ||
      (deckSetup.status === "locked" && deckSetup.isLocked))
  );
}

function buildDeckSetupChecklistItem({
  deckSetup,
  isOwnerAdmin
}: {
  deckSetup: DeckSetupReadinessInput;
  isOwnerAdmin: boolean;
}): SetupChecklistItem {
  const coverage = getDeckSetupCoverage(deckSetup);
  const cardCountLabel = `${deckSetup.cardCount} / ${REQUIRED_DECK_CARD_COUNT} cards configured`;
  const weekCoverageLabel = `${coverage.uniqueWeekCount} / ${REQUIRED_DECK_CARD_COUNT} weeks configured`;
  const promptTextCount = coverage.promptTextCount;
  const promptTextCountLabel = `${promptTextCount} / ${REQUIRED_DECK_CARD_COUNT} cards have prompt text`;
  const blankPromptLabel =
    coverage.blankPromptCount > 0
      ? `${coverage.blankPromptCount} ${coverage.blankPromptCount === 1 ? "card has" : "cards have"} blank or missing prompt text.`
      : "No configured cards have blank prompt text.";
  const missingWeeksLabel =
    coverage.missingWeekCount > 0
      ? `Missing weeks: ${coverage.missingWeekPreviewLabel}`
      : "No missing weeks.";
  const duplicateWeekLabel = coverage.hasDuplicateWeekNumbers
    ? `Duplicate week warning: ${coverage.duplicateWeekNumbers.join(", ")}.`
    : "No duplicate weeks detected.";
  const validationIssueMessages =
    deckSetup.validation?.blockingIssues.map((issue) => issue.message) ?? [];
  const validationWarningMessages =
    deckSetup.validation?.warnings.map((warning) => warning.message) ?? [
      "Deck locking is not built yet.",
      "Start-game behavior is not built yet."
    ];
  const validationStatusMessages = validationIssueMessages.length
    ? validationIssueMessages
    : ["No validation blockers detected."];
  const missingDeckMessages = validationIssueMessages.length
    ? validationIssueMessages
    : ["No draft deck exists yet.", missingWeeksLabel];
  const actionLabel = isOwnerAdmin ? "Open deck setup" : "View deck setup";
  const roleGuidance = isOwnerAdmin
    ? "Owner/admin members can use the one-card manual entry form for now; import and locking come later."
    : "Deck setup is read-only for player members; owner/admin members manage manual card entry.";

  if (!deckSetup.deckId) {
    return {
      actionHref: deckSetup.setupHref,
      actionLabel,
      description: "A draft deck has not been created for this game yet.",
      readinessCategory: "incomplete",
      requirement: "required",
      status: "warning",
      statusLabel: "Missing",
      title: "Deck/card setup",
      validationMessages: [
        cardCountLabel,
        weekCoverageLabel,
        promptTextCountLabel,
        ...missingDeckMessages,
        roleGuidance,
        ...validationWarningMessages,
        "No official/proprietary card content is included."
      ]
    };
  }

  if (isDeckSetupComplete(deckSetup)) {
    return {
      actionHref: deckSetup.setupHref,
      actionLabel,
      description:
        "Deck setup has a saved status that supports later start validation.",
      readinessCategory: "complete",
      requirement: "required",
      status: "complete",
      statusLabel: "Complete",
      title: "Deck/card setup",
      validationMessages: [
        cardCountLabel,
        weekCoverageLabel,
        promptTextCountLabel,
        ...validationStatusMessages,
        `Deck status is ${deckSetup.status}.`,
        ...validationWarningMessages,
        "No start-game action is enabled by this checklist.",
        "No official/proprietary card content is included."
      ]
    };
  }

  const hasPreparedDraftCoverage =
    deckSetup.status === "draft" &&
    (deckSetup.validation?.isReadyForLocking ??
      (coverage.allWeeksRepresented &&
        coverage.allConfiguredCardsHavePromptText &&
        !coverage.hasDuplicateWeekNumbers));

  return {
    actionHref: deckSetup.setupHref,
    actionLabel,
    description: hasPreparedDraftCoverage
      ? "All 52 weeks are represented, but the deck is still draft and not locked."
      : "A draft deck exists, but card setup is not ready to start play.",
    readinessCategory: "incomplete",
    requirement: "required",
    status: "warning",
    statusLabel: hasPreparedDraftCoverage ? "Prepared, not locked" : "In progress",
    title: "Deck/card setup",
    validationMessages: [
      cardCountLabel,
      weekCoverageLabel,
      promptTextCountLabel,
      ...(validationIssueMessages.length
        ? validationIssueMessages
        : [blankPromptLabel, missingWeeksLabel, duplicateWeekLabel]),
      `Deck source is ${deckSetup.sourceType ?? "not set"} and status is ${deckSetup.status ?? "not set"}.`,
      hasPreparedDraftCoverage
        ? "Deck appears ready for future locking, but locking is not built yet."
        : "Deck is not ready for future locking yet.",
      roleGuidance,
      ...validationWarningMessages,
      "No official/proprietary card content is included."
    ]
  };
}

function buildLobbySetupReadiness({
  deckSetup,
  gameStatus,
  gameStatusLabel,
  isOwnerAdmin,
  memberCount,
  memberCountLabel,
  rosterMembers
}: BuildLobbySetupReadinessInput): LobbySetupReadiness {
  const hasMultipleMembers = memberCount >= 2;
  const membersWithoutTurnOrder = rosterMembers.filter(
    (member) => member.turnOrderIndex === null
  );
  const duplicateTurnOrderIndexes = getDuplicateTurnOrderIndexes(rosterMembers);
  const isTurnOrderReady =
    rosterMembers.length > 0 &&
    membersWithoutTurnOrder.length === 0 &&
    duplicateTurnOrderIndexes.length === 0;

  const items: SetupChecklistItem[] = [
    {
      actionDisabledReason:
        "Player management is deferred; use the invite form when owner/admin invite creation is available.",
      actionLabel: isOwnerAdmin ? "Invite form below" : "Owner/admin only",
      description: hasMultipleMembers
        ? "The lobby has enough active members for the recommended play baseline."
        : "The lobby has one active member. Solo start may be allowed later, but recommended play is 2+.",
      readinessCategory: hasMultipleMembers ? "complete" : "incomplete",
      requirement: "required",
      status: hasMultipleMembers ? "complete" : "warning",
      title: "Players invited",
      validationMessages: [
        `${memberCountLabel} confirmed from active game memberships.`,
        hasMultipleMembers
          ? "The recommended two-or-more-player baseline is met."
          : "Solo start may be allowed later for testing, but invite another player for recommended play."
      ]
    },
    {
      actionDisabledReason: isOwnerAdmin
        ? "Use the turn order editor on this page; this checklist card is status-only."
        : "Owner/admin members control turn order setup.",
      actionLabel: isOwnerAdmin ? "Editor above" : "Read-only",
      description: isTurnOrderReady
        ? "Every active member has one saved turn order position."
        : "Active member turn order needs owner/admin attention before setup can be considered ready.",
      readinessCategory: isTurnOrderReady ? "complete" : "incomplete",
      requirement: "required",
      status: isTurnOrderReady ? "complete" : "warning",
      title: "Turn order",
      validationMessages: [
        `${rosterMembers.length} active ${rosterMembers.length === 1 ? "member" : "members"} checked for saved turn order.`,
        ...(membersWithoutTurnOrder.length
          ? [
              `${membersWithoutTurnOrder
                .map((member) => member.displayName)
                .join(", ")} ${membersWithoutTurnOrder.length === 1 ? "is" : "are"} missing a turn order.`
            ]
          : ["No active members are missing a turn order."]),
        ...(duplicateTurnOrderIndexes.length
          ? [
              `Turn order indexes must be unique; duplicate saved position ${duplicateTurnOrderIndexes
                .map((index) => String(index + 1))
                .join(", ")} needs attention.`
            ]
          : ["Saved turn order indexes are unique."])
      ]
    },
    buildDeckSetupChecklistItem({ deckSetup, isOwnerAdmin }),
    {
      actionDisabledReason: "Initial map setup is deferred to the map setup phase.",
      actionLabel: "Coming later",
      description:
        "The initial map setup route and editor are not part of this slice.",
      readinessCategory: "future",
      requirement: "required",
      status: "incomplete",
      statusLabel: "Future",
      title: "Initial map",
      validationMessages: [
        "No map editor, map draft, or baseline map revision is created here."
      ]
    },
    {
      actionDisabledReason: "Community notes editing is deferred.",
      actionLabel: "Coming later",
      description:
        "Shared setup notes will become structured later; this page stays read-only for now.",
      readinessCategory: "future",
      requirement: "optional",
      status: "incomplete",
      statusLabel: "Future",
      title: "Community notes",
      validationMessages: [
        "No notes editor, comments, chat, or realtime behavior is added here."
      ]
    },
    {
      actionDisabledReason:
        "Start-game behavior is blocked until deck setup, initial map setup, and start validation exist.",
      actionLabel: "Blocked",
      description:
        "Starting the game remains unavailable until required setup areas have real validation.",
      readinessCategory: "blocked",
      requirement: "required",
      status: "blocked",
      title: "Start game",
      validationMessages: [
        `Current game status is ${gameStatusLabel} (${gameStatus}).`,
        "No start-game action, turn creation, or game status mutation is added in this slice."
      ]
    }
  ];

  const readyAreaLabels = items
    .filter((item) => item.readinessCategory === "complete")
    .map((item) => item.title);
  const needsAttentionAreaLabels = items
    .filter((item) => item.readinessCategory === "incomplete")
    .map((item) => item.title);
  const futureAreaLabels = items
    .filter((item) => item.readinessCategory === "future")
    .map((item) => item.title);
  const blockedAreaLabels = items
    .filter((item) => item.readinessCategory === "blocked")
    .map((item) => item.title);

  return {
    items,
    summary: {
      blockedAreaLabels,
      futureAreaLabels,
      needsAttentionAreaLabels,
      readyAreaLabels,
      readyCount: readyAreaLabels.length,
      roleDescription: isOwnerAdmin
        ? `You can currently invite players, adjust turn order, and open deck setup. Future setup remains unavailable: ${formatAreaList(futureAreaLabels)}.`
        : "Setup status is read-only for your role. Owner/admin members control invites, turn order, and deck setup changes. Future setup remains unavailable.",
      summaryLabel: `${readyAreaLabels.length} of ${items.length} setup areas ready`,
      totalCount: items.length
    }
  };
}

export { REQUIRED_DECK_CARD_COUNT, buildLobbySetupReadiness };
export type {
  BuildLobbySetupReadinessInput,
  LobbySetupReadiness,
  SetupReadinessRosterMember
};
