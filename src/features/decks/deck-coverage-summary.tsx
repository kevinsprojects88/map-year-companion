import { ValidationAlert } from "@/components/feedback/validation-alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { REQUIRED_DECK_CARD_COUNT } from "@/lib/lobby/setup-readiness";
import type { DeckSetupViewModel } from "@/types/deck";

type DeckCoverageSummaryProps = {
  deckSetup: DeckSetupViewModel;
};

function getPromptFilledLabel(promptTextCount: number) {
  return `${promptTextCount} ${promptTextCount === 1 ? "prompt" : "prompts"} filled`;
}

function getCoverageStatusMessage(deckSetup: DeckSetupViewModel) {
  const { cardSetup, deck } = deckSetup;

  if (!deck) {
    return "No draft deck exists yet.";
  }

  if (
    deck.isLocked &&
    cardSetup.allWeeksRepresented &&
    cardSetup.allConfiguredCardsHavePromptText
  ) {
    return "Deck is locked and coverage remains complete; start-game behavior is still not built here.";
  }

  if (
    deck.status === "valid" &&
    cardSetup.allWeeksRepresented &&
    cardSetup.allConfiguredCardsHavePromptText
  ) {
    return "Deck has complete coverage, but it is not complete for setup until it is locked.";
  }

  if (deck.isLocked || deck.status === "valid") {
    return "Deck status is saved as valid or locked, but coverage still needs attention.";
  }

  if (
    cardSetup.allWeeksRepresented &&
    cardSetup.allConfiguredCardsHavePromptText
  ) {
    return "All 52 weeks are represented with prompt text. Owner/admin members can lock the deck now.";
  }

  if (cardSetup.allWeeksRepresented) {
    return "All 52 weeks are represented. Non-blank prompts are still required before locking.";
  }

  return "Deck remains draft. Validation shows what needs attention before locking.";
}

function getRoleStatusMessage(deckSetup: DeckSetupViewModel) {
  if (deckSetup.membership.isOwnerAdmin) {
    return "Use the one-card manual entry form while the deck is draft, then lock the deck when validation passes.";
  }

  return "Deck setup is read-only for your role; owner/admin members manage manual card entry.";
}

function DeckCoverageSummary({ deckSetup }: DeckCoverageSummaryProps) {
  const { cardSetup } = deckSetup;
  const statusMessages = [
    getCoverageStatusMessage(deckSetup),
    cardSetup.missingWeekCount > 0
      ? `Missing weeks: ${cardSetup.missingWeekPreviewLabel}`
      : "Missing weeks: None.",
    cardSetup.blankPromptCount > 0
      ? `${cardSetup.blankPromptCount} configured ${cardSetup.blankPromptCount === 1 ? "card has" : "cards have"} blank or missing prompt text.`
      : "No configured cards have blank prompt text.",
    ...(cardSetup.duplicateWeekWarningLabel
      ? [cardSetup.duplicateWeekWarningLabel]
      : []),
    getRoleStatusMessage(deckSetup)
  ];

  return (
    <Card variant="draft">
      <CardHeader>
        <div className="col-start-1 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={cardSetup.allWeeksRepresented ? "success" : "attention"}
            >
              Coverage review
            </Badge>
            <Badge variant="outline">{deckSetup.setup.statusLabel}</Badge>
          </div>
          <CardTitle>Deck coverage</CardTitle>
          <CardDescription>
            Conservative status for user-provided, game-specific card rows.
          </CardDescription>
        </div>
        <CardAction>
          <Badge variant="outline">{cardSetup.uniqueWeekCountLabel}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-border bg-card p-3">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Weeks
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {cardSetup.uniqueWeekCount} / {REQUIRED_DECK_CARD_COUNT}
            </p>
            <p className="text-muted-foreground">weeks configured</p>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Card rows
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {cardSetup.cardCount}
            </p>
            <p className="text-muted-foreground">saved rows</p>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Prompts
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {cardSetup.promptTextCount}
            </p>
            <p className="text-muted-foreground">
              {getPromptFilledLabel(cardSetup.promptTextCount)}
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Blanks
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {cardSetup.blankPromptCount}
            </p>
            <p className="text-muted-foreground">
              {cardSetup.blankPromptCountLabel}
            </p>
          </div>
        </div>

        <ValidationAlert
          messages={statusMessages}
          title="Coverage status"
          variant={
            deckSetup.setup.readinessCategory === "complete"
              ? "success"
              : "warning"
          }
        />
      </CardContent>
    </Card>
  );
}

export { DeckCoverageSummary };
export type { DeckCoverageSummaryProps };
