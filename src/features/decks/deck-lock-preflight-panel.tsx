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

import { LockDeckForm } from "./lock-deck-form";

type DeckLockPreflightPanelProps = {
  deckSetup: DeckSetupViewModel;
};

function getPreflightStatusLabel(deckSetup: DeckSetupViewModel) {
  if (!deckSetup.deck) {
    return "Deck is missing, so locking is blocked.";
  }

  if (deckSetup.deck.isLocked) {
    return "Deck is locked. Manual card editing is closed.";
  }

  if (deckSetup.lockPreflight.canLock) {
    return deckSetup.membership.isOwnerAdmin
      ? "Deck can be locked now."
      : "Deck is ready for owner/admin locking.";
  }

  return "Deck is not eligible for locking yet.";
}

function getPreflightBadgeLabel(deckSetup: DeckSetupViewModel) {
  if (!deckSetup.deck) {
    return "Deck missing";
  }

  if (deckSetup.deck.isLocked) {
    return "Locked";
  }

  return deckSetup.lockPreflight.canLock
    ? "Ready to lock"
    : "Preflight blocked";
}

function getBlockerMessages(deckSetup: DeckSetupViewModel) {
  if (deckSetup.deck?.isLocked) {
    return ["Deck is already locked."];
  }

  if (deckSetup.lockPreflight.blockers.length === 0) {
    return ["No lock preflight blockers detected."];
  }

  return deckSetup.lockPreflight.blockers.map((blocker) => blocker.message);
}

function getRoleGuidance(deckSetup: DeckSetupViewModel) {
  if (deckSetup.deck?.isLocked) {
    return "The locked deck is read-only. Start-game behavior remains unbuilt.";
  }

  if (deckSetup.membership.isOwnerAdmin) {
    return deckSetup.lockPreflight.canLock
      ? "Owner/admin members can lock the deck now; locking does not start the game."
      : "Owner/admin members should fix the listed blockers with manual card entry before locking.";
  }

  return "This preflight is read-only for player members. Owner/admin members manage deck setup and locking.";
}

function DeckLockPreflightPanel({ deckSetup }: DeckLockPreflightPanelProps) {
  const { summary } = deckSetup.lockPreflight;
  const blockerMessages = getBlockerMessages(deckSetup);
  const warningMessages = [
    ...deckSetup.lockPreflight.warnings.map((warning) => warning.message),
    getRoleGuidance(deckSetup)
  ];
  const canShowLockForm = Boolean(
    deckSetup.deck &&
      deckSetup.membership.isOwnerAdmin &&
      deckSetup.game.status === "setup" &&
      !deckSetup.deck.isLocked &&
      deckSetup.lockPreflight.canLock
  );
  const panelVariant =
    deckSetup.deck?.isLocked || deckSetup.lockPreflight.canLock
      ? "official"
      : "draft";
  const hasBlockingLockIssues =
    deckSetup.lockPreflight.blockers.length > 0 && !deckSetup.deck?.isLocked;
  const blockerTitle = deckSetup.deck?.isLocked
    ? "Lock status"
    : hasBlockingLockIssues
      ? "Fix before locking"
      : "Lock blockers";

  return (
    <Card variant={panelVariant}>
      <CardHeader>
        <div className="col-start-1 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={
                deckSetup.deck?.isLocked || deckSetup.lockPreflight.canLock
                  ? "success"
                  : "attention"
              }
            >
              {getPreflightBadgeLabel(deckSetup)}
            </Badge>
            <Badge variant="outline">Server preflight</Badge>
            <Badge variant="readOnly">{deckSetup.membership.roleLabel}</Badge>
          </div>
          <CardTitle>Deck locking preflight</CardTitle>
          <CardDescription>
            Server-side readiness result for the game-specific, user-provided
            deck. The lock action rechecks these rules before mutating status.
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
              block locking
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
              block locking
            </p>
          </div>
        </div>

        <ValidationAlert
          messages={blockerMessages}
          title={blockerTitle}
          variant={hasBlockingLockIssues ? "warning" : "success"}
        />

        <ValidationAlert
          messages={warningMessages}
          title="Preflight scope"
          variant="warning"
        />
      </CardContent>

      {canShowLockForm ? (
        <CardFooter className="block">
          <LockDeckForm gameId={deckSetup.game.id} />
        </CardFooter>
      ) : (
        <CardFooter>
          {deckSetup.deck?.isLocked
            ? "The deck is locked and read-only. Start-game behavior is still not built."
            : "No lock mutation is available for this role or deck state. Start-game behavior is still not built."}
        </CardFooter>
      )}
    </Card>
  );
}

export { DeckLockPreflightPanel };
export type { DeckLockPreflightPanelProps };
