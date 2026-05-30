import { EmptyState } from "@/components/feedback/empty-state";
import { PermissionAlert } from "@/components/feedback/permission-alert";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { REQUIRED_DECK_CARD_COUNT } from "@/lib/lobby/setup-readiness";
import type { DeckSetupViewModel } from "@/types/deck";

import { CreateDraftDeckForm } from "./create-draft-deck-form";
import { DeckCoverageSummary } from "./deck-coverage-summary";
import { DeckCardList } from "./deck-card-list";
import { DeckValidationSummary } from "./deck-validation-summary";
import { ManualCardEntryForm } from "./manual-card-entry-form";

type DeckSetupPanelProps = {
  deckSetup: DeckSetupViewModel;
};

function getSetupBadgeVariant(
  readinessCategory: DeckSetupViewModel["setup"]["readinessCategory"]
): BadgeVariant {
  switch (readinessCategory) {
    case "complete":
      return "success";
    case "blocked":
      return "invalid";
    case "future":
      return "secondary";
    case "incomplete":
      return "attention";
  }
}

function DeckSetupPanel({ deckSetup }: DeckSetupPanelProps) {
  const setupBadgeVariant = getSetupBadgeVariant(
    deckSetup.setup.readinessCategory
  );
  const canEditCards = Boolean(
    deckSetup.deck &&
      deckSetup.membership.isOwnerAdmin &&
      deckSetup.deck.status === "draft" &&
      deckSetup.game.status === "setup"
  );

  return (
    <section aria-labelledby="deck-setup-heading" className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant={deckSetup.deck ? "draft" : "default"}>
          <CardHeader>
            <div className="col-start-1 flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant={setupBadgeVariant}>
                  {deckSetup.setup.statusLabel}
                </Badge>
                <Badge variant="outline">{deckSetup.game.statusLabel}</Badge>
              </div>
              <CardTitle id="deck-setup-heading">Deck setup</CardTitle>
              <CardDescription>{deckSetup.setup.description}</CardDescription>
            </div>
            <CardAction>
              <Badge variant="readOnly">{deckSetup.membership.roleLabel}</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Game id: <span className="font-mono">{deckSetup.game.id}</span>
            </p>
            <p className="text-muted-foreground">
              Deck/card content is game-specific and user-provided.
            </p>
            <p className="text-muted-foreground">
              No official/proprietary card content is included or generated.
            </p>
          </CardContent>
        </Card>

        <Card variant="raised">
          <CardHeader>
            <CardTitle>Coverage counts</CardTitle>
            <CardDescription>
              Saved rows, represented weeks, and prompt-fill status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {deckSetup.cardSetup.uniqueWeekCountLabel}
            </p>
            <p className="text-muted-foreground">
              {deckSetup.cardSetup.configuredCountLabel}
            </p>
            <p className="text-muted-foreground">
              {deckSetup.cardSetup.promptTextCountLabel}
            </p>
            <p className="text-muted-foreground">
              {deckSetup.cardSetup.missingWeekCountLabel}
            </p>
          </CardContent>
        </Card>

        <Card variant="official">
          <CardHeader>
            <CardTitle>Content boundary</CardTitle>
            <CardDescription>
              Private setup only, with no bundled prompts or assets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No official/proprietary card content is included.
            </p>
            <p className="text-muted-foreground">
              JSON import, card art, deck locking, and start-game validation
              are not part of this slice.
            </p>
          </CardContent>
        </Card>
      </div>

      <DeckCoverageSummary deckSetup={deckSetup} />

      <DeckValidationSummary deckSetup={deckSetup} />

      {deckSetup.deck ? (
        <Card variant="draft">
          <CardHeader className="gap-y-3">
            <div className="col-start-1 flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {deckSetup.deck.sourceTypeLabel}
                </Badge>
                <Badge variant="attention">{deckSetup.deck.statusLabel}</Badge>
                <Badge variant={deckSetup.deck.isLocked ? "success" : "outline"}>
                  {deckSetup.deck.lockedLabel}
                </Badge>
              </div>
              <CardTitle>Draft deck record</CardTitle>
              <CardDescription>
                This is the one draft deck shell for the game.
              </CardDescription>
            </div>
            <CardAction>
              <Badge variant="outline">
                {deckSetup.cardSetup.cardCount} / {REQUIRED_DECK_CARD_COUNT}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm leading-6 md:grid-cols-2">
              <div className="rounded-md border border-border bg-card p-3">
                <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                  Deck id
                </dt>
                <dd className="mt-1 break-all font-mono">
                  {deckSetup.deck.id}
                </dd>
              </div>
              <div className="rounded-md border border-border bg-card p-3">
                <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                  Saved dates
                </dt>
                <dd className="mt-1">{deckSetup.deck.createdLabel}</dd>
                <dd>{deckSetup.deck.updatedLabel}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            Minimal manual card entry is available while the deck stays draft.
            This page reports read-only validation, but does not lock the deck
            or start the game.
          </CardFooter>
        </Card>
      ) : deckSetup.setup.canCreateDraftDeck ? (
        <EmptyState
          action={<CreateDraftDeckForm gameId={deckSetup.game.id} />}
          description="Create the placeholder draft deck shell so later manual card setup can attach to this game."
          title="No draft deck yet"
          variant="actionable"
        />
      ) : (
        <PermissionAlert
          description="A draft deck has not been created yet. Active members can view this status, but only the owner or an admin can initialize setup."
          disabledReason="Deck creation is owner/admin-only while the game is in setup."
          roleContext={deckSetup.membership.roleLabel}
          title="Deck setup is read-only"
        />
      )}

      <Card variant="raised">
        <CardHeader>
          <CardTitle>Saved cards</CardTitle>
          <CardDescription>
            Existing card rows for this game&apos;s deck, sorted by week and
            card key.
          </CardDescription>
          <CardAction>
            <Badge variant="outline">
              {deckSetup.cardSetup.cardCount} / {REQUIRED_DECK_CARD_COUNT}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DeckCardList cards={deckSetup.cards} />
        </CardContent>
        <CardFooter>
          This is not a full 52-card editor, import flow, deck lock, or
          start-game engine.
        </CardFooter>
      </Card>

      {deckSetup.deck && canEditCards ? (
        <Card variant="draft">
          <CardHeader>
            <div className="col-start-1 flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="draft">Owner/admin</Badge>
                <Badge variant="attention">Draft deck</Badge>
              </div>
              <CardTitle>Manual card entry</CardTitle>
              <CardDescription>
                Add or update one user-provided placeholder card at a time.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ManualCardEntryForm gameId={deckSetup.game.id} />
          </CardContent>
          <CardFooter>
            Saving the same week number updates that week&apos;s card row. The
            server chooses the deck from the game id and does not accept deck
            id, status, timestamps, ownership fields, or metadata from the
            form.
          </CardFooter>
        </Card>
      ) : deckSetup.deck ? (
        <PermissionAlert
          allowedActions={[
            "View deck status.",
            "Read existing user-provided card rows.",
            "Return to the lobby setup checklist."
          ]}
          description={
            deckSetup.membership.isOwnerAdmin
              ? "Card editing is disabled unless the game is in setup and the deck is draft."
              : "Active player members can view deck/card setup, but only owner/admin members can add or update cards while the deck is draft."
          }
          disabledReason="No card entry controls are available for this role or deck state."
          roleContext={deckSetup.membership.roleLabel}
          title="Deck setup is read-only"
        />
      ) : null}
    </section>
  );
}

export { DeckSetupPanel };
export type { DeckSetupPanelProps };
