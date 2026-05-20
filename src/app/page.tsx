import { AutosaveStatus } from "@/components/feedback/autosave-status";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { PermissionAlert } from "@/components/feedback/permission-alert";
import { ValidationAlert } from "@/components/feedback/validation-alert";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";

const buttonVariants: Array<{
  variant: ButtonVariant;
  label: string;
  note: string;
}> = [
  {
    variant: "primary",
    label: "Primary action",
    note: "Main next step"
  },
  {
    variant: "secondary",
    label: "Secondary action",
    note: "Supporting action"
  },
  {
    variant: "ghost",
    label: "Quiet action",
    note: "Low emphasis"
  },
  {
    variant: "destructive",
    label: "Destructive action",
    note: "Permanent change"
  },
  {
    variant: "process",
    label: "Process action",
    note: "Governance/admin"
  },
  {
    variant: "draft",
    label: "Save draft",
    note: "Provisional"
  },
  {
    variant: "official",
    label: "Commit official",
    note: "Settled record"
  }
];

const buttonSizes: Array<{ size: ButtonSize; label: string }> = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
  { size: "icon", label: "+" }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1C placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Button Variants and Feedback Primitives
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks reusable component treatments.
              Product screens, routes, data, auth, chat, map tools, and game
              flows remain deferred.
            </p>
          </div>
        </section>

        <section aria-labelledby="button-variants" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="button-variants" className="text-2xl font-semibold">
              Button Variants
            </h2>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              Actions should not all look primary. Draft, official, process,
              and destructive work use distinct field-journal state treatments.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {buttonVariants.map((sample) => (
              <div
                key={sample.variant}
                className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-paper-sm"
              >
                <Button variant={sample.variant}>{sample.label}</Button>
                <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                  {sample.note}
                </p>
              </div>
            ))}
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-paper-sm">
              <Button disabled variant="secondary">
                Disabled action
              </Button>
              <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                Disabled state
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-paper-sm">
              <Button loading loadingText="Saving" variant="draft">
                Save draft
              </Button>
              <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                Loading state
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="button-sizes" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="button-sizes" className="text-2xl font-semibold">
              Button Sizes
            </h2>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              Sizes keep comfortable tap targets and support icon-only controls
              with a readable accessible label.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {buttonSizes.map((sample) => (
              <Button
                key={sample.size}
                aria-label={
                  sample.size === "icon" ? "Add placeholder item" : undefined
                }
                size={sample.size}
                variant={sample.size === "icon" ? "secondary" : "primary"}
              >
                {sample.label}
              </Button>
            ))}
          </div>
        </section>

        <section aria-labelledby="empty-states" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="empty-states" className="text-2xl font-semibold">
              Empty States
            </h2>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              Empty copy explains what is missing, why it matters, and what can
              happen next.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <EmptyState
              title="No official history yet."
              description="History begins when the first placeholder turn is committed."
              action={<Button variant="secondary">Review placeholder draft</Button>}
              variant="actionable"
            />
            <EmptyState
              title="Archived examples are quiet here."
              description="This placeholder area stays read-only until a preserved record exists."
              variant="archived"
            />
          </div>
        </section>

        <section aria-labelledby="error-states" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="error-states" className="text-2xl font-semibold">
              Error States
            </h2>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              Errors stay plain, recovery-oriented, and free of raw system
              details by default.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ErrorState
              title="Draft could not be loaded."
              description="The saved placeholder draft is unavailable right now. Try again before changing the record."
              recoveryAction={<Button variant="secondary">Try again</Button>}
              variant="network"
            />
            <ErrorState
              title="Validation needs attention."
              description="A few placeholder fields need review before this example could continue."
              recoveryAction={<Button variant="process">Open review list</Button>}
              variant="validation"
            />
          </div>
        </section>

        <section aria-labelledby="loading-states" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="loading-states" className="text-2xl font-semibold">
              Loading Skeletons
            </h2>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              Skeletons cover card, row, and panel shapes with restrained
              movement and readable status text for assistive technology.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="row" />
            <LoadingSkeleton variant="panel" />
          </div>
        </section>

        <section
          aria-labelledby="permission-validation"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <h2 id="permission-validation" className="text-2xl font-semibold">
              Permission and Validation
            </h2>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              Boundary messages explain what is unavailable without making the
              interface feel broken.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <PermissionAlert
              title="Only the active placeholder player can commit this turn."
              description="You can still discuss, inspect the draft, and review the shared state."
              allowedActions={[
                "Read the saved draft.",
                "Add placeholder discussion.",
                "Review validation notes."
              ]}
              disabledReason="Commit is disabled because this placeholder viewer is not the active player."
              roleContext="Viewer"
              turnContext="Waiting"
            />
            <ValidationAlert
              title="Placeholder setup needs review."
              messages={[
                "Add a short title before continuing.",
                "Choose at least one placeholder participant.",
                "Confirm that no official content is included."
              ]}
              variant="warning"
            />
          </div>
        </section>

        <section aria-labelledby="autosave" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="autosave" className="text-2xl font-semibold">
              Autosave Status
            </h2>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              Autosave feedback uses readable text first, with color and motion
              as supporting cues only.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AutosaveStatus state="idle" />
            <AutosaveStatus state="saving" />
            <AutosaveStatus state="saved" timestamp="Saved 2 min ago" />
            <AutosaveStatus state="error" />
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
