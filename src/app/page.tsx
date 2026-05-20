import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1D placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Input and Textarea Primitives
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks reusable form-field treatments.
              It is not a real product screen, route, form, auth flow, map
              tool, chat, poll, or game setup experience.
            </p>
          </div>
        </section>

        <Card aria-labelledby="input-states" variant="raised">
          <CardHeader>
            <CardTitle id="input-states">Input States</CardTitle>
            <CardDescription>
              Labels, helper text, validation copy, draft borders, settled
              read-only styling, and disabled affordances stay visible without
              relying on color alone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field
                description="Plain helper copy explains what this placeholder field expects."
                id="input-default"
                label="Placeholder title"
                required
              >
                {(field) => (
                  <Input
                    {...field}
                    placeholder="Add a short placeholder title"
                  />
                )}
              </Field>

              <Field
                error="Use a specific placeholder title before this sample could continue."
                id="input-error"
                label="Short title"
                required
                variant="error"
              >
                {(field) => (
                  <Input {...field} defaultValue="A" placeholder="Short title" />
                )}
              </Field>

              <Field
                id="input-success"
                label="Reference code"
                message="The placeholder code is readable and ready to compare."
                variant="success"
              >
                {(field) => (
                  <Input
                    {...field}
                    defaultValue="PLACEHOLDER-014"
                    placeholder="PLACEHOLDER-000"
                  />
                )}
              </Field>

              <Field
                description="Draft fields keep a provisional label and broken border treatment."
                id="input-draft"
                label="Draft marker"
                message="This value is still provisional."
                statusLabel="Draft"
                variant="draft"
              >
                {(field) => (
                  <Input
                    {...field}
                    defaultValue="Uncommitted placeholder"
                    placeholder="Draft marker"
                  />
                )}
              </Field>

              <Field
                id="input-official"
                label="Official archive label"
                message="Read-only fields should feel settled, not editable."
                readOnly
                variant="official"
              >
                {(field) => (
                  <Input
                    {...field}
                    defaultValue="Committed placeholder record"
                  />
                )}
              </Field>

              <Field
                description="Disabled examples look unavailable and are not focusable."
                disabled
                id="input-disabled"
                label="Unavailable placeholder"
                statusLabel="Disabled"
              >
                {(field) => (
                  <Input
                    {...field}
                    placeholder="This placeholder is disabled"
                  />
                )}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card aria-labelledby="textarea-states" variant="raised">
          <CardHeader>
            <CardTitle id="textarea-states">Textarea States</CardTitle>
            <CardDescription>
              Multi-line controls use the same state language, with lightweight
              chat and prompt treatments for later composition work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-5 lg:grid-cols-2">
              <Field
                description="Default textarea styling is quiet and suited to longer placeholder notes."
                id="textarea-default"
                label="Community note placeholder"
              >
                {(field) => (
                  <Textarea
                    {...field}
                    placeholder="Write a short placeholder note."
                  />
                )}
              </Field>

              <Field
                id="textarea-error"
                label="Validation note"
                error="Add enough placeholder context for another reader to understand it."
                required
                variant="error"
              >
                {(field) => (
                  <Textarea
                    {...field}
                    defaultValue="Too brief."
                    placeholder="Add placeholder context."
                  />
                )}
              </Field>

              <Field
                id="textarea-draft"
                label="Draft turn note"
                message="This text is saved as a draft example, not official history."
                variant="draft"
              >
                {(field) => (
                  <Textarea
                    {...field}
                    defaultValue="A provisional placeholder note waits for review."
                    placeholder="Draft placeholder text"
                  />
                )}
              </Field>

              <Field
                id="textarea-official"
                label="Official ledger excerpt"
                message="Committed examples are calm and read-only."
                readOnly
                variant="official"
              >
                {(field) => (
                  <Textarea
                    {...field}
                    defaultValue="Committed placeholder summary for the archive demo."
                  />
                )}
              </Field>

              <Field
                description="Chat styling remains conversational, but this is only a primitive sample."
                id="textarea-chat"
                label="Chat composer placeholder"
              >
                {(field) => (
                  <Textarea
                    {...field}
                    placeholder="Add a placeholder chat note."
                    variant="chat"
                  />
                )}
              </Field>

              <Field
                description="Prompt styling is generic placeholder treatment only; no official card text is included."
                id="textarea-card-prompt"
                label="Prompt placeholder"
              >
                {(field) => (
                  <Textarea
                    {...field}
                    placeholder="Describe a generic placeholder prompt."
                    variant="cardPrompt"
                  />
                )}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card aria-labelledby="field-helper" variant="draft">
          <CardHeader>
            <CardTitle id="field-helper">Field Helper Behavior</CardTitle>
            <CardDescription>
              The Field helper can generate IDs, connect helper and error text,
              mark required controls, and pass disabled or read-only state to
              the primitive it wraps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-5 lg:grid-cols-2">
              <Field
                description="The required marker is visible, while the input also receives native required state."
                id="field-required"
                label="Required placeholder"
                required
              >
                {(field) => (
                  <Input {...field} placeholder="Required placeholder" />
                )}
              </Field>

              <Field
                description="Read-only copy and styling make this sample inspectable without implying edit access."
                id="field-readonly"
                label="Read-only placeholder"
                readOnly
              >
                {(field) => (
                  <Textarea
                    {...field}
                    defaultValue="This placeholder value can be read but not edited."
                  />
                )}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          Placeholder content only. No official or proprietary game content,
          private proof-of-concept data, secrets, auth wiring, Supabase schema,
          chat, polls, map editing, or game creation features are included.
        </section>
      </div>
    </main>
  );
}
