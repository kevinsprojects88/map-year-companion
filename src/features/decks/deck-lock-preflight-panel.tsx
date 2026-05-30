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

type DeckLockPreflightPanelProps = {
  deckSetup: DeckSetupViewModel;
};

function getPreflightStatusLabel(deckSetup: DeckSetupViewModel) {
  if (!deckSetup.deck) {
    return "Deck is missing, so future locking is blocked.";
  }

  if (deckSetup.lockPreflight.canLock) {
    return "Deck is eligible for a future lock action.";
  }

  return "Deck is not eligible for future locking yet.";
}

function getPreflightBadgeLabel(deckSetup: DeckSetupViewModel) {
  if (!deckSetup.deck) {
    return "Deck missing";
  }

  return deckSetup.lockPreflight.canLock
    ? "Preflight ready"
    : "Preflight blocked";
}

function getBlockerMessages(deckSetup: DeckSetupViewModel) {
  if (deckSetup.lockPreflight.blockers.length === 0) {
    return ["No lock preflight blockers detected."];
  }

  return deckSetup.lockPreflight.blockers.map((blocker) => blocker.message);
}

function getRoleGuidance(deckSetup: DeckSetupViewModel) {
  if (deckSetup.membership.isOwnerAdmin) {
    return deckSetup.lockPreflight.canLock
      ? "Owner/admin preflight finds no blockers. A future lock action can use this result, but that action is not built yet."
      : "Owner/admin members should fix the listed blockers with manual card entry before a future lock action.";
  }

  return "This preflight is read-only for player members. Owner/admin members manage deck setup and any future lock action.";
}

function DeckLockPreflightPanel({ deckSetup }: DeckLockPreflightPanelProps) {
  const { summary } = deckSetup.lockPreflight;
  const blockerMessages = getBlockerMessages(deckSetup);
  const warningMessages = [
    ...deckSetup.lockPreflight.warnings.map((warning) => warning.message),
    getRoleGuidance(deckSetup)
  ];

  return (
    <Card variant={deckSetup.lockPreflight.canLock ? "raised" : "draft"}>
      <CardHeader>
        <div className="col-start-1 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={deckSetup.lockPreflight.canLock ? "success" : "attention"}
            >
              {getPreflightBadgeLabel(deckSetup)}
            </Badge>
            <Badge variant="outline">Read-only server preflight</Badge>
            <Badge variant="readOnly">{deckSetup.membership.roleLabel}</Badge>
          </div>
          <CardTitle>Deck locking preflight</CardTitle>
          <CardDescription>
            Server-side readiness result for the game-specific,
            user-provided deck.
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
          {getPreflightStatusLabel(deckSetup)}
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
              non-blank prompt rows
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
              block future locking
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
              block future locking
            </p>
          </div>
        </div>

        <ValidationAlert
          messages={blockerMessages}
          title={
            deckSetup.lockPreflight.blockers.length
              ? "Fix before future lock"
              : "Future lock blockers"
          }
          variant={
            deckSetup.lockPreflight.blockers.length ? "warning" : "success"
          }
        />

        <ValidationAlert
          messages={warningMessages}
          title="Preflight scope"
          variant="warning"
        />
      </CardContent>

      <CardFooter>
        Lock deck is not built yet. Start game is not built yet. No deck status
        mutation, turn creation, file import, upload, or official/proprietary
        content is included here.
      </CardFooter>
    </Card>
  );
}

export { DeckLockPreflightPanel };
export type { DeckLockPreflightPanelProps };
