const surfaceSamples = [
  {
    label: "App background",
    description: "Warm paper field",
    className: "border-border bg-background text-foreground"
  },
  {
    label: "Surface",
    description: "Quiet working sheet",
    className: "border-border bg-surface text-foreground"
  },
  {
    label: "Raised surface",
    description: "Lifted paper layer",
    className: "border-border-strong bg-surface-raised text-foreground"
  },
  {
    label: "Map canvas",
    description: "Hand-authored map ground",
    className: "border-border-strong bg-canvas text-foreground"
  }
];

const stateSamples = [
  {
    label: "Draft",
    cue: "Dashed and provisional",
    className:
      "border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-bg)] text-[var(--state-draft-text)]"
  },
  {
    label: "Official",
    cue: "Settled ledger mark",
    className:
      "border-solid border-[var(--state-official-border)] bg-[var(--state-official-bg)] text-[var(--state-official-text)]"
  },
  {
    label: "Community Vote",
    cue: "Advisory poll state",
    className:
      "border-solid border-[var(--state-poll-border)] bg-[var(--state-poll-bg)] text-[var(--state-poll-text)]"
  },
  {
    label: "Process Vote",
    cue: "Governance warning",
    className:
      "border-solid border-[var(--state-process-border)] bg-[var(--state-process-bg)] text-[var(--state-process-text)]"
  },
  {
    label: "Archived",
    cue: "Read-only record",
    className:
      "border-solid border-[var(--state-archived-border)] bg-[var(--state-archived-bg)] text-[var(--state-archived-text)]"
  },
  {
    label: "Error",
    cue: "Recovery needed",
    className:
      "border-solid border-[var(--state-error-border)] bg-[var(--state-error-bg)] text-[var(--state-error-text)]"
  },
  {
    label: "Warning",
    cue: "Needs attention",
    className:
      "border-solid border-[var(--state-warning-border)] bg-[var(--state-warning-bg)] text-[var(--state-warning-text)]"
  },
  {
    label: "Success",
    cue: "Validation passed",
    className:
      "border-solid border-[var(--state-success-border)] bg-[var(--state-success-bg)] text-[var(--state-success-text)]"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-paper-md sm:p-8">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1A theme foundation
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Map Year Companion
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Weathered Field Journal tokens for a private async companion:
              quiet paper surfaces, charcoal text, and distinct labeled states.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="surface-demo"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <h2 id="surface-demo" className="text-2xl font-semibold">
              Surface Scale
            </h2>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              Base surfaces stay warm and legible without heavy texture.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {surfaceSamples.map((sample) => (
              <div
                className={`flex min-h-32 flex-col justify-between rounded-md border p-4 shadow-paper-sm ${sample.className}`}
                key={sample.label}
              >
                <p className="font-medium">{sample.label}</p>
                <p className="text-sm">{sample.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="state-demo" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="state-demo" className="text-2xl font-semibold">
              State Samples
            </h2>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              State treatments use labels, borders, and copy so meaning is not
              carried by color alone.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stateSamples.map((sample) => (
              <div
                className={`flex min-h-32 flex-col gap-4 rounded-md border-2 p-4 ${sample.className}`}
                key={sample.label}
              >
                <p className="font-mono text-sm font-semibold uppercase">
                  {sample.label}
                </p>
                <p className="text-base font-medium">{sample.cue}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-lg border border-dashed border-border bg-card p-6 shadow-paper-sm">
          <h2 className="text-2xl font-semibold">Placeholder only</h2>
          <p className="max-w-3xl leading-7 text-muted-foreground">
            Product routes, auth, Supabase, chat, polls, map editing, game
            creation, and layout systems remain deferred to later phases.
          </p>
        </section>
      </div>
    </main>
  );
}
