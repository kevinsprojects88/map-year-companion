import { ProcessVoteCard } from "@/components/polls/process-vote-card";
import type { ProcessVoteResponse, ProcessVoteViewModel } from "@/types/process-vote";

function responses(
  yes: number,
  no: number,
  abstain: number,
  selected?: ProcessVoteResponse["value"]
): ProcessVoteResponse[] {
  return [
    {
      count: yes,
      currentUserSelected: selected === "yes",
      label: "Yes",
      value: "yes"
    },
    {
      count: no,
      currentUserSelected: selected === "no",
      label: "No",
      value: "no"
    },
    {
      count: abstain,
      currentUserSelected: selected === "abstain",
      label: "Abstain",
      value: "abstain"
    }
  ];
}

const processVotes: ProcessVoteViewModel[] = [
  {
    confirmationCopy:
      "Owner/admin review is still required before any reassignment can happen.",
    createdAtLabel: "Created 18 minutes ago",
    currentActivePlayerLabel: "Current placeholder player",
    id: "open-reassign-stuck-turn",
    initiatedByLabel: "owner/admin placeholder",
    primaryActionLabel: "Mock Response Only",
    proposedReplacementPlayerLabel: "Next placeholder player",
    reason:
      "The current turn has been quiet in this mock scenario, so the table is gathering governance input.",
    responses: responses(2, 1, 1),
    resultCopy:
      "No fictional outcome, map change, turn advance, or official history entry is created by this vote.",
    status: "open",
    statusDetail:
      "Open process vote state with local yes/no/abstain controls for visual testing only.",
    thresholdCopy:
      "Responses inform the owner/admin decision; this demo does not enforce a rule or submit a vote.",
    title: "Process Vote: Reassign Stuck Turn",
    totalResponses: 4,
    type: "reassignStuckTurn"
  },
  {
    confirmationCopy:
      "Responses indicate support, but the final owner/admin confirmation has not happened.",
    createdAtLabel: "Created 42 minutes ago",
    currentActivePlayerLabel: "Current placeholder player",
    id: "confirmation-needed-reassign-stuck-turn",
    initiatedByLabel: "owner/admin placeholder",
    primaryActionLabel: "Review Confirmation",
    proposedReplacementPlayerLabel: "Replacement placeholder player",
    reason:
      "The table has responded, and this mock card shows the waiting-for-confirmation state.",
    responses: responses(4, 1, 1, "yes"),
    resultCopy:
      "The proposed reassignment is not active until owner/admin confirmation is complete.",
    status: "confirmationNeeded",
    statusDetail:
      "Confirmation-needed state. The vote itself still does not create story text or official history.",
    thresholdCopy:
      "The mock response count supports escalation to owner/admin confirmation.",
    title: "Process Vote: Confirm Reassignment",
    totalResponses: 6,
    type: "reassignStuckTurn"
  },
  {
    confirmationCopy:
      "Owner/admin confirmation is shown as complete in this placeholder card.",
    createdAtLabel: "Settled this morning",
    currentActivePlayerLabel: "Former placeholder player",
    id: "passed-reassign-stuck-turn",
    initiatedByLabel: "owner/admin placeholder",
    proposedReplacementPlayerLabel: "Replacement placeholder player",
    reason:
      "The mock governance process reached a settled passed state for visual review.",
    responses: responses(5, 1, 0, "yes"),
    resultCopy:
      "Passed means the admin action is settled; it still is not a fictional outcome or Story Poll result.",
    status: "passed",
    statusDetail:
      "Passed process vote state with disabled response controls and settled governance copy.",
    thresholdCopy: "The placeholder response threshold was met in this mock state.",
    title: "Process Vote: Reassignment Passed",
    totalResponses: 6,
    type: "reassignStuckTurn"
  },
  {
    confirmationCopy:
      "Owner/admin confirmation is not available because the process vote failed.",
    createdAtLabel: "Settled yesterday",
    currentActivePlayerLabel: "Current placeholder player",
    id: "failed-reassign-stuck-turn",
    initiatedByLabel: "owner/admin placeholder",
    proposedReplacementPlayerLabel: "Replacement placeholder player",
    reason:
      "The table response did not support the proposed admin action in this mock state.",
    responses: responses(1, 4, 1, "no"),
    resultCopy:
      "Failed means the proposed reassignment is not carried forward by this process vote.",
    status: "failed",
    statusDetail:
      "Failed state uses text labels and copy, not color alone, to communicate the outcome.",
    thresholdCopy: "The placeholder response threshold was not met.",
    title: "Process Vote: Reassignment Failed",
    totalResponses: 6,
    type: "reassignStuckTurn"
  },
  {
    confirmationCopy:
      "Owner/admin cancelled the process before any final reassignment decision.",
    createdAtLabel: "Cancelled last week",
    currentActivePlayerLabel: "Current placeholder player",
    id: "cancelled-reassign-stuck-turn",
    initiatedByLabel: "owner/admin placeholder",
    proposedReplacementPlayerLabel: "Replacement placeholder player",
    reason:
      "The mock admin issue was resolved outside the process vote before confirmation.",
    responses: responses(2, 0, 2, "abstain"),
    resultCopy:
      "Cancelled process votes remain administration notes and do not produce story consequences.",
    status: "cancelled",
    statusDetail:
      "Cancelled state is settled and disabled so the demo does not imply a live flow.",
    thresholdCopy: "No threshold applies after cancellation.",
    title: "Process Vote: Reassignment Cancelled",
    totalResponses: 4,
    type: "reassignStuckTurn"
  },
  {
    confirmationCopy:
      "This older process vote is read-only and accepts no new responses.",
    createdAtLabel: "Archived 3 months ago",
    currentActivePlayerLabel: "Archived placeholder player",
    id: "readonly-reassign-stuck-turn",
    initiatedByLabel: "owner/admin placeholder",
    proposedReplacementPlayerLabel: "Archived replacement player",
    reason:
      "Read-only presentation for an archived governance card in a completed placeholder world.",
    responses: responses(3, 1, 1, "yes"),
    resultCopy:
      "The archived card records table administration only; it is not part of official fictional history.",
    status: "readOnly",
    statusDetail:
      "Read-only state for archived or completed records with response controls disabled.",
    thresholdCopy: "The archived threshold note is preserved for reference only.",
    title: "Process Vote: Archived Reassignment Record",
    totalResponses: 5,
    type: "reassignStuckTurn"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1I placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
              ProcessVoteCard Primitive
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks governance/admin process vote
              component treatments with mock display data. It is not a real
              process vote flow, Story Poll flow, chat integration, auth flow,
              Supabase integration, turn reassignment system, map tool, game
              state implementation, or official history surface.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
              Mock Process Vote States
            </p>
            <h2 className="text-2xl font-semibold">Reassign Stuck Turn</h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Placeholder cards for open, confirmation-needed, passed, failed,
              cancelled, and read-only states. All copy treats the vote as
              table administration rather than story input.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {processVotes.map((vote) => (
              <ProcessVoteCard key={vote.id} vote={vote} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          Placeholder content only. No official or proprietary game content,
          private proof-of-concept data, secrets, auth wiring, Supabase schema,
          chat, Story Poll behavior, vote submission, turn reassignment logic,
          map editing, or game creation features are included.
        </section>
      </div>
    </main>
  );
}
