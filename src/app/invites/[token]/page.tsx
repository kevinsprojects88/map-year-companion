import Link from "next/link";

import { ValidationAlert } from "@/components/feedback/validation-alert";
import { AcceptInviteForm } from "@/features/invites/accept-invite-form";
import { resolveSafeAuthRedirectPath } from "@/lib/auth/auth-redirects";
import { requireProfile } from "@/lib/auth/require-profile";

export const dynamic = "force-dynamic";

type InviteAcceptancePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function InviteAcceptancePage({
  params
}: InviteAcceptancePageProps) {
  const { token } = await params;
  const invitePath = resolveSafeAuthRedirectPath(
    `/invites/${encodeURIComponent(token)}`,
    "/dashboard"
  );

  await requireProfile(invitePath);

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="flex flex-col gap-4">
          <Link
            className="w-fit rounded-md text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href="/dashboard"
          >
            Back to dashboard
          </Link>
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
              Phase 4F invite acceptance
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Accept a private game invite
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              You are signed in with a profile. Accepting this invite will ask
              the server to add you to the private game as a player.
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <AcceptInviteForm token={token} />

          <aside className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground shadow-paper-sm">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold leading-tight text-foreground">
                Invite scope
              </h2>
              <ValidationAlert
                messages={[
                  "Invite acceptance requires an account and profile.",
                  "No game details are shown before acceptance succeeds.",
                  "Membership authority stays on the server."
                ]}
                title="Private invite"
                variant="success"
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
