import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const placeholderOptions = [
  { label: "Quiet placeholder", value: "quiet" },
  { label: "Draft placeholder", value: "draft" },
  { label: "Disabled placeholder", value: "disabled", disabled: true },
  { label: "Official placeholder", value: "official" }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1E placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Select, Checkbox, and Toggle Primitives
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks reusable control treatments. It
              is not a real product screen, route, form, auth flow, map tool,
              chat, poll, or game setup experience.
            </p>
          </div>
        </section>

        <Card aria-labelledby="select-states" variant="raised">
          <CardHeader>
            <CardTitle id="select-states">Select States</CardTitle>
            <CardDescription>
              Native select controls keep labels, helper text, validation copy,
              disabled options, draft borders, and settled read-only styling
              visible without relying on color alone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field
                description="Plain helper copy explains what this placeholder selector expects."
                id="select-default"
                label="Placeholder selector"
                required
              >
                {(field) => (
                  <Select
                    {...field}
                    defaultValue=""
                    options={placeholderOptions}
                    placeholder="Choose a placeholder option"
                  />
                )}
              </Field>

              <Field
                error="Choose a specific placeholder option before this sample could continue."
                id="select-error"
                label="Validation selector"
                required
                variant="error"
              >
                {(field) => (
                  <Select
                    {...field}
                    defaultValue=""
                    options={placeholderOptions}
                    placeholder="Choose one"
                  />
                )}
              </Field>

              <Field
                id="select-success"
                label="Verified selector"
                message="The selected placeholder is ready to compare."
                variant="success"
              >
                {(field) => (
                  <Select {...field} defaultValue="quiet" options={placeholderOptions} />
                )}
              </Field>

              <Field
                description="Draft selectors keep a provisional label and broken border treatment."
                id="select-draft"
                label="Draft selector"
                message="This selection is still provisional."
                statusLabel="Draft"
                variant="draft"
              >
                {(field) => (
                  <Select {...field} defaultValue="draft" options={placeholderOptions} />
                )}
              </Field>

              <Field
                id="select-official"
                label="Official selector"
                message="Read-only select styling should feel settled, not active."
                readOnly
                variant="official"
              >
                {(field) => (
                  <Select {...field} defaultValue="official" options={placeholderOptions} />
                )}
              </Field>

              <Field
                description="Disabled examples look unavailable and are not focusable."
                disabled
                id="select-disabled"
                label="Unavailable selector"
                statusLabel="Disabled"
              >
                {(field) => (
                  <Select
                    {...field}
                    defaultValue=""
                    options={placeholderOptions}
                    placeholder="Unavailable placeholder"
                  />
                )}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card aria-labelledby="checkbox-states" variant="raised">
          <CardHeader>
            <CardTitle id="checkbox-states">Checkbox States</CardTitle>
            <CardDescription>
              Checkbox controls use native input semantics, visible focus, and
              a drawn check mark so checked state is not conveyed by color
              alone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field
                description="The field helper can connect supporting text to a checkbox control."
                id="checkbox-field-default"
                label="Field-wrapped checkbox"
              >
                {(field) => (
                  <Checkbox
                    {...field}
                    label="Checked placeholder"
                    description="This is a placeholder checkbox label, not a real checklist item."
                  />
                )}
              </Field>

              <Field
                id="checkbox-field-error"
                label="Validation checkbox"
                error="Confirm the placeholder condition before this sample could continue."
                variant="error"
              >
                {(field) => (
                  <Checkbox
                    {...field}
                    label="Missing placeholder confirmation"
                    description="The error text is announced through the field helper."
                  />
                )}
              </Field>

              <Field
                id="checkbox-field-success"
                label="Verified checkbox"
                message="This placeholder condition has been checked."
                variant="success"
              >
                {(field) => (
                  <Checkbox
                    {...field}
                    defaultChecked
                    label="Checked and verified"
                    description="The check mark and label both indicate state."
                  />
                )}
              </Field>

              <Field
                id="checkbox-field-draft"
                label="Draft checkbox"
                message="This checked value remains provisional."
                variant="draft"
              >
                {(field) => (
                  <Checkbox
                    {...field}
                    defaultChecked
                    label="Draft placeholder"
                    description="Dashed styling marks this sample as provisional."
                  />
                )}
              </Field>

              <Field
                id="checkbox-field-official"
                label="Official checkbox"
                message="This checked state is presented as settled placeholder copy."
                variant="official"
              >
                {(field) => (
                  <Checkbox
                    {...field}
                    defaultChecked
                    label="Official placeholder"
                    description="The control remains a primitive sample only."
                  />
                )}
              </Field>

              <Field
                description="Disabled examples are visibly unavailable and removed from normal interaction."
                disabled
                id="checkbox-field-disabled"
                label="Disabled checkbox"
              >
                {(field) => (
                  <Checkbox
                    {...field}
                    defaultChecked
                    label="Unavailable placeholder"
                    description="This disabled checked state is only a control sample."
                  />
                )}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card aria-labelledby="switch-states" variant="raised">
          <CardHeader>
            <CardTitle id="switch-states">Switch States</CardTitle>
            <CardDescription>
              Switch controls are checkbox inputs with switch semantics, visible
              On/Off text, and knob movement so state is clear beyond color.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field
                description="Use switches for later settings-style booleans, not irreversible actions."
                id="switch-field-default"
                label="Default switch"
              >
                {(field) => (
                  <Switch
                    {...field}
                    label="Off placeholder"
                    description="The native input remains keyboard reachable."
                  />
                )}
              </Field>

              <Field
                description="Checked switches show both moved position and visible On text."
                id="switch-field-on"
                label="Checked switch"
              >
                {(field) => (
                  <Switch
                    {...field}
                    defaultChecked
                    label="On placeholder"
                    description="This does not change any real application setting."
                  />
                )}
              </Field>

              <Field
                id="switch-field-success"
                label="Verified switch"
                message="This placeholder switch is enabled for the sample."
                variant="success"
              >
                {(field) => (
                  <Switch
                    {...field}
                    defaultChecked
                    label="Verified placeholder"
                    description="Success styling stays paired with explicit text."
                  />
                )}
              </Field>

              <Field
                id="switch-field-draft"
                label="Draft switch"
                message="This placeholder setting is still provisional."
                variant="draft"
              >
                {(field) => (
                  <Switch
                    {...field}
                    label="Draft placeholder"
                    description="Dashed styling keeps the state provisional."
                  />
                )}
              </Field>

              <Field
                id="switch-field-official"
                label="Official switch"
                message="This placeholder setting is presented as settled."
                variant="official"
              >
                {(field) => (
                  <Switch
                    {...field}
                    defaultChecked
                    label="Official placeholder"
                    description="This is still only a design-system primitive."
                  />
                )}
              </Field>

              <Field
                description="Disabled switches keep their state visible without allowing interaction."
                disabled
                id="switch-field-disabled"
                label="Disabled switch"
              >
                {(field) => (
                  <Switch
                    {...field}
                    defaultChecked
                    label="Unavailable placeholder"
                    description="Disabled controls are muted and non-interactive."
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
