import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatPanel } from "@/components/chat/chat-panel";
import { SystemMessage } from "@/components/chat/system-message";
import type {
  ChatMessageViewModel,
  SystemMessageViewModel
} from "@/types/chat";

const chatMessages: ChatMessageViewModel[] = [
  {
    authorDisplayName: "Avery",
    avatarColor: "moss",
    avatarInitials: "AV",
    body: "Placeholder table note about checking the shared map before writing anything into the record.",
    id: "avery-normal",
    linkedTurnLabel: "Week placeholder",
    status: "normal",
    timestampLabel: "10:12 AM"
  },
  {
    authorDisplayName: "Bryn",
    avatarColor: "ochre",
    avatarInitials: "BR",
    body: "Edited placeholder message. This stays conversational and does not become official history.",
    id: "bryn-edited",
    status: "edited",
    timestampLabel: "10:16 AM"
  },
  {
    authorDisplayName: "Casey",
    avatarColor: "clay",
    avatarInitials: "CA",
    body: "Pending placeholder reply while the interface shows a not-yet-settled chat state.",
    id: "casey-pending",
    linkedTurnLabel: "Turn note",
    status: "pending",
    timestampLabel: "10:18 AM"
  },
  {
    authorDisplayName: "Devon",
    avatarColor: "slate",
    avatarInitials: "DV",
    body: "Failed placeholder message. The visible label explains the failure without relying on color alone.",
    id: "devon-failed",
    status: "failed",
    timestampLabel: "10:20 AM"
  }
];

const systemMessages: SystemMessageViewModel[] = [
  {
    body: "Placeholder system note: chat remains discussion and does not change official history.",
    id: "system-info",
    timestampLabel: "10:14 AM",
    type: "info"
  },
  {
    body: "Placeholder process reminder: this message is informational and does not mutate game state.",
    id: "system-process",
    linkedObjectLabel: "Process placeholder",
    timestampLabel: "10:22 AM",
    type: "process"
  },
  {
    body: "Placeholder warning state shown with text, border, and label so meaning is not color-only.",
    id: "system-warning",
    timestampLabel: "10:24 AM",
    type: "warning"
  },
  {
    body: "Placeholder state note shown in chat style, separate from the official ledger/history treatment.",
    id: "system-state",
    linkedObjectLabel: "State placeholder",
    timestampLabel: "10:25 AM",
    type: "stateChange"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1N placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
              Chat Message and Composer Primitives
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks mock chat messages, system notes,
              composer states, and an empty chat panel. It is not a real chat
              screen, server action, realtime subscription, Supabase
              integration, message history loader, Story Poll integration,
              official history surface, route, game state update, turn
              association system, or persistence layer.
            </p>
          </div>
        </section>

        <ChatPanel
          title="Placeholder Table Discussion"
          description="Mock player and system messages for visual review. Chat remains conversational and separate from official history."
          messages={[
            <ChatMessage key={chatMessages[0].id} message={chatMessages[0]} />,
            <SystemMessage
              key={systemMessages[0].id}
              message={systemMessages[0]}
            />,
            <ChatMessage key={chatMessages[1].id} message={chatMessages[1]} />,
            <ChatMessage key={chatMessages[2].id} message={chatMessages[2]} />,
            <SystemMessage
              key={systemMessages[1].id}
              message={systemMessages[1]}
            />,
            <ChatMessage key={chatMessages[3].id} message={chatMessages[3]} />
          ]}
          composer={
            <ChatComposer
              defaultValue="Placeholder draft text that is not sent anywhere."
              helperText="This composer demonstrates keyboard-safe local form behavior only."
              label="Mock chat composer"
              sendButtonLabel="Send mock note"
            />
          }
        />

        <section className="grid gap-6 lg:grid-cols-2">
          <ChatPanel
            title="Empty Chat Panel"
            description="A display-only empty state for a future right-rail chat panel."
            emptyState={{
              description:
                "No mock chat messages have been added to this placeholder panel.",
              title: "No placeholder discussion yet"
            }}
          />

          <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-paper-sm">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl font-semibold leading-tight">
                System Message Types
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Compact system notes for chat context. These are not official
                ledger entries.
              </p>
            </div>
            <SystemMessage message={systemMessages[2]} />
            <SystemMessage message={systemMessages[3]} />
          </section>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-3xl font-semibold leading-tight">
              Composer States
            </h2>
            <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
              Display-only composer variants with visible helper text,
              disabled/read-only reasons, and no persistence behavior.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ChatComposer
              defaultValue="Read-only placeholder text."
              disabledReason="This mock conversation is read-only, so the button remains inert while still reachable by keyboard."
              label="Read-only composer"
              readOnly
              sendButtonLabel="Send"
            />
            <ChatComposer
              defaultValue="Placeholder message in a sending visual state."
              helperText="Sending state is visual only; no network request is started."
              label="Sending composer"
              sending
              sendButtonLabel="Send"
            />
            <ChatComposer
              disabled
              disabledReason="Chat is disabled in this placeholder state for visual review."
              label="Disabled composer"
              placeholder="Disabled placeholder composer"
              sendButtonLabel="Send"
            />
            <ChatComposer
              defaultValue="Placeholder message that needs recovery."
              failed
              helperText="Failed state keeps an explicit text explanation for accessibility."
              label="Failed composer"
              sendButtonLabel="Retry mock note"
            />
          </div>
        </section>

        <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          Placeholder content only. No official or proprietary game content,
          private proof-of-concept data, secrets, auth wiring, Supabase schema,
          message persistence, realtime behavior, Story Poll wiring, official
          history integration, routes, turn logic, map behavior, or game state
          features are included.
        </section>
      </div>
    </main>
  );
}
