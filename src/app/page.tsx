import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

const methodOptions = [
  { label: "Guided", value: "guided" },
  { label: "Manual", value: "manual" },
  { label: "Import", value: "import", badge: "JSON" },
  { label: "Unavailable", value: "unavailable", disabled: true }
];

const densityOptions = [
  { label: "Compact", value: "compact" },
  { label: "Balanced", value: "balanced" },
  { label: "Disabled", value: "disabled", disabled: true }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1F placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Tabs and Segmented Control Primitives
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks reusable panel-switching and
              choice-control treatments. It is not a real product screen,
              route, form, auth flow, map tool, chat, poll, deck setup, or game
              setup experience.
            </p>
          </div>
        </section>

        <Card aria-labelledby="tabs-states" variant="raised">
          <CardHeader>
            <CardTitle id="tabs-states">Tabs States</CardTitle>
            <CardDescription>
              Tabs provide a list, triggers, panels, selected styling, disabled
              treatment, keyboard movement, and a lightweight count slot without
              becoming a real right rail or mobile shell.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-5">
            <Tabs defaultValue="chat">
              <TabsList aria-label="Placeholder panel tabs">
                <TabsTrigger value="chat" badge="3">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="state">State</TabsTrigger>
                <TabsTrigger value="history" badge="12">
                  History
                </TabsTrigger>
                <TabsTrigger value="disabled" disabled>
                  Disabled
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chat">
                <p>
                  Placeholder panel for a future conversational surface. This
                  sample does not render messages, realtime wiring, or product
                  behavior.
                </p>
              </TabsContent>
              <TabsContent value="state">
                <p>
                  Placeholder panel for later state information. This sample
                  does not create resources, projects, discontent, or official
                  records.
                </p>
              </TabsContent>
              <TabsContent value="history">
                <p>
                  Placeholder panel for a future ledger-style history view.
                  This sample does not include official turn content or private
                  proof-of-concept material.
                </p>
              </TabsContent>
              <TabsContent value="disabled">
                <p>
                  This disabled tab panel remains unreachable from the sample
                  controls.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card aria-labelledby="segmented-control-states" variant="raised">
          <CardHeader>
            <CardTitle id="segmented-control-states">
              Segmented Control States
            </CardTitle>
            <CardDescription>
              Segmented controls use native radio inputs for compact method and
              mode choices. Selected options have shape, border, underline, and
              text-weight changes in addition to token color.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-5">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
                Method choice placeholder
              </p>
              <SegmentedControl
                aria-label="Placeholder method choice"
                defaultValue="guided"
                options={methodOptions}
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
                Compact mode placeholder
              </p>
              <SegmentedControl
                aria-label="Placeholder compact mode choice"
                defaultValue="balanced"
                options={densityOptions}
                size="sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card aria-labelledby="keyboard-notes" variant="raised">
          <CardHeader>
            <CardTitle id="keyboard-notes">Keyboard Notes</CardTitle>
            <CardDescription>
              Placeholder behavior notes for this primitive slice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-muted-foreground">
              <li>
                Tabs support arrow-key movement, Home, and End while skipping
                disabled triggers.
              </li>
              <li>
                Segmented controls use native radio behavior, so Tab reaches the
                group and arrow keys move between enabled options.
              </li>
              <li>
                Focus states use the shared token ring from the app theme.
              </li>
            </ul>
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
