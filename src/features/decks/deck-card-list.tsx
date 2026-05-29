import { Badge } from "@/components/ui/badge";
import type { DeckCardViewModel } from "@/types/deck";

type DeckCardListProps = {
  cards: DeckCardViewModel[];
};

function DeckCardList({ cards }: DeckCardListProps) {
  if (cards.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-bg)] p-4 text-sm leading-6 text-muted-foreground">
        No card rows are saved yet. Owner/admin members can add
        user-provided placeholder cards while the deck is draft.
      </div>
    );
  }

  return (
    <ol className="grid gap-3">
      {cards.map((card) => (
        <li
          className="grid gap-3 rounded-md border border-border bg-card p-4"
          key={card.id}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{card.weekNumberLabel}</Badge>
                <Badge variant={card.hasPromptText ? "success" : "attention"}>
                  {card.promptTextStatusLabel}
                </Badge>
                {card.season ? (
                  <Badge variant="outline">{card.seasonLabel}</Badge>
                ) : null}
              </div>
              <h3 className="break-words text-lg font-semibold leading-tight text-foreground">
                {card.cardKey}
              </h3>
            </div>
            <p className="shrink-0 text-sm text-muted-foreground">
              {card.updatedLabel}
            </p>
          </div>

          {card.promptText ? (
            <p className="whitespace-pre-wrap break-words rounded-md border border-border bg-surface-raised p-3 text-sm leading-6 text-foreground">
              {card.promptText}
            </p>
          ) : (
            <p className="rounded-md border border-dashed border-border bg-muted p-3 text-sm leading-6 text-muted-foreground">
              No prompt text saved for this card.
            </p>
          )}

          <dl className="grid gap-2 text-xs leading-5 text-muted-foreground sm:grid-cols-2">
            <div>
              <dt className="font-mono font-semibold uppercase">Card id</dt>
              <dd className="break-all font-mono">{card.id}</dd>
            </div>
            <div>
              <dt className="font-mono font-semibold uppercase">Saved</dt>
              <dd>{card.createdLabel}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}

export { DeckCardList };
export type { DeckCardListProps };
