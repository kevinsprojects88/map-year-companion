import { ValidationAlert } from "@/components/feedback/validation-alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { REQUIRED_DECK_WEEK_COUNT } from "@/lib/decks/deck-validation";
import type { DeckSetupViewModel } from "@/types/deck";

type DeckValidationSummaryProps = {
  deckSetup: DeckSetupViewModel;
};

function getOverallStatusLabel(deckSetup: DeckSetupViewModel) {
  if (!deckSetup.deck) {
    return "Deck is not ready for locking.";
  }

  if (deckSetup.validation.isReadyForLocking) {
    return "Deck appears ready for future locking, but locking is not built yet.";
  }

  return "Deck is not ready for locking.";
}

function getOverallBadgeLabel(deckSetup: DeckSetupViewModel) {
  if (!deckSetup.deck) {
    return "Deck missing";
  }

  return deckSetup.validation.isReadyForLocking
    ? "Future locking ready"
    : "Needs attention";
}

function getRoleGuidance(deckSetup: DeckSetupViewModel) {
  if (deckSetup.membership.isOwnerAdmin) {
    return "Manual card entry is the current setup method. Fill missing weeks and blank prompts here; import, locking, and start-game behavior come later.";
  }

  return "This validation status is read-only for player members. Owner/admin members manage deck setup.";
}

function getBlockingMessages(deckSetup: DeckSetupViewModel) {
  if (deckSetup.validation.blockingIssues.length === 0) {
    return ["No blocking validation issues detected."];
  }

  return deckSetup.validation.blockingIssues.map((issue) => issue.message);
}

function DeckValidationSummary({ deckSetup }: DeckValidationSummaryProps) {
  const { summary } = deckSetup.validation;
  const statusLabel = getOverallStatusLabel(deckSetup);
  const blockingMessages = getBlockingMessages(deckSetup);
  const warningMessages = deckSetup.validation.warnings.map(
    (warning) => warning.message
  );

  return (
    <Card variant={deckSetup.validation.isReadyForLocking ? "raised" : "draft"}>
      <CardHeader>
        <div className="col-start-1 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={
                deckSetup.validation.isReadyForLocking ? "success" : "attention"
              }
            >
              {getOverallBadgeLabel(deckSetup)}
            </Badge>
            <Badge variant="outline">Read-only validation</Badge>
          </div>
          <CardTitle>Deck validation readiness</CardTitle>
          <CardDescription>
            Pure readiness checks for the game-specific, user-provided deck.
          </CardDescription>
        </div>
        <CardAction>
          <Badge variant="outline">
            {summary.representedWeeks} / {REQUIRED_DECK_WEEK_COUNT}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="text-base font-semibold text-foreground">
          {statusLabel}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-border bg-card p-3">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Represented weeks
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {summary.representedWeeks}
            </p>
            <p className="text-muted-foreground">
              of {REQUIRED_DECK_WEEK_COUNT} required
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Prompted cards
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {summary.promptFilledCount}
            </p>
            <p className="text-muted-foreground">
              prompts with non-blank text
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Missing weeks
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {summary.missingWeekCount}
            </p>
            <p className="text-muted-foreground">
              must be filled before locking
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Blank prompts
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {summary.blankPromptCount}
            </p>
            <p className="text-muted-foreground">
              represented cards needing text
            </p>
          </div>
        </div>

        <ValidationAlert
          messages={blockingMessages}
          title={
            deckSetup.validation.blockingIssues.length
              ? "Before future locking"
              : "Validation blockers"
          }
          variant={
            deckSetup.validation.blockingIssues.length ? "warning" : "success"
          }
        />

        <ValidationAlert
          messages={[...warningMessages, getRoleGuidance(deckSetup)]}
          title="Read-only scope"
          variant="warning"
        />
      </CardContent>

      <CardFooter>
        Deck locking and start-game behavior are not built yet. No official card
        content is included, generated, seeded, imported, or uploaded here.
      </CardFooter>
    </Card>
  );
}

export { DeckValidationSummary };
export type { DeckValidationSummaryProps };
