import { StateBadge, type BadgeState } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardVariant
} from "@/components/ui/card";

const cardSamples: Array<{
  variant: CardVariant;
  title: string;
  badge?: BadgeState;
  cue: string;
  note: string;
}> = [
  {
    variant: "default",
    title: "Default Card",
    cue: "Quiet working surface",
    note: "A neutral container for ordinary interface content."
  },
  {
    variant: "raised",
    title: "Raised Card",
    cue: "Lifted paper layer",
    note: "A little more separation for focused, temporary, or primary areas."
  },
  {
    variant: "draft",
    title: "Draft Card",
    badge: "draft",
    cue: "Dashed provisional treatment",
    note: "Uses broken border language and rust-clay state tokens."
  },
  {
    variant: "official",
    title: "Official Card",
    badge: "official",
    cue: "Settled ledger treatment",
    note: "Uses a stable moss accent for committed, durable records."
  },
  {
    variant: "poll",
    title: "Poll Card",
    badge: "communityVote",
    cue: "Advisory community vote",
    note: "Uses faded brass and ochre tokens without implying authority."
  },
  {
    variant: "process",
    title: "Process Card",
    badge: "processVote",
    cue: "Governance or admin process",
    note: "Uses a neutral warning treatment for process-sensitive work."
  },
  {
    variant: "archived",
    title: "Archived Card",
    badge: "archived",
    cue: "Read-only settled state",
    note: "Uses muted slate structure to signal a preserved record."
  },
  {
    variant: "error",
    title: "Error Card",
    badge: "invalid",
    cue: "Clear recovery needed",
    note: "Uses restrained error tokens with strong contrast."
  }
];

const badgeSamples: BadgeState[] = [
  "yourTurn",
  "activePlayer",
  "waiting",
  "draft",
  "official",
  "communityVote",
  "processVote",
  "readOnly",
  "archived",
  "needsAttention",
  "validationPassed",
  "invalid"
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1B placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Base Cards and State Badges
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks the first Weathered Field Journal
              component treatments. Product screens, routes, data, auth, chat,
              map tools, and game flows remain deferred.
            </p>
          </div>
        </section>

        <section aria-labelledby="card-variants" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="card-variants" className="text-2xl font-semibold">
              Base Card Variants
            </h2>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              Variants use semantic state tokens, border shape, accent marks,
              and labels so the meaning is not carried by color alone.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cardSamples.map((sample) => (
              <Card key={sample.variant} variant={sample.variant}>
                <CardHeader>
                  <CardTitle>{sample.title}</CardTitle>
                  {sample.badge ? (
                    <CardAction>
                      <StateBadge state={sample.badge} />
                    </CardAction>
                  ) : null}
                  <CardDescription>{sample.cue}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{sample.note}</p>
                </CardContent>
                <CardFooter>
                  <span className="font-mono uppercase">Sample only</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="state-badges" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="state-badges" className="text-2xl font-semibold">
              State Badges
            </h2>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              Each badge includes a readable label plus a compact text marker
              and state-specific surface treatment.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {badgeSamples.map((state) => (
              <StateBadge key={state} state={state} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          Placeholder content only. No official or proprietary game content is
          included.
        </section>
      </div>
    </main>
  );
}
