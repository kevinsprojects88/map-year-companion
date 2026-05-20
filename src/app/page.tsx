const guardrails = [
  "Async-first play",
  "One active player per turn",
  "Map-first experience",
  "Chat separate from official history",
  "Mobile read and respond only"
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium uppercase text-muted-foreground">
            Phase 0 scaffold
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Map Year Companion
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              A private async-first tabletop companion for map-based community
              storytelling games.
            </p>
          </div>
        </section>

        <section
          aria-label="MVP guardrails"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {guardrails.map((guardrail) => (
            <div
              className="rounded-md border border-border bg-muted px-4 py-3 text-sm font-medium text-muted-foreground"
              key={guardrail}
            >
              {guardrail}
            </div>
          ))}
        </section>

        <section className="rounded-lg border border-dashed border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Implementation has not started yet.</h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
            This placeholder confirms the app shell can render while product
            routes, auth, database schema, chat, polls, and map editing remain
            deferred to later phases.
          </p>
        </section>
      </div>
    </main>
  );
}
