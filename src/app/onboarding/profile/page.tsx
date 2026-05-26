import Link from "next/link";

import { ErrorState } from "@/components/feedback/error-state";
import { ValidationAlert } from "@/components/feedback/validation-alert";
import { ProfileForm } from "@/features/profiles/profile-form";
import { getCurrentUserProfile } from "@/server/queries/profile.queries";

export const dynamic = "force-dynamic";

export default async function OnboardingProfilePage() {
  const { profile, profileError, userEmail } = await getCurrentUserProfile();

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="flex flex-col gap-4">
          <Link
            className="w-fit rounded-md text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href="/"
          >
            Back to placeholder demo
          </Link>
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
              Phase 2C profile setup
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Prepare your private profile
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              This page creates or updates only the signed-in account&apos;s
              display name before later protected app screens exist.
            </p>
          </div>
        </section>

        {profileError ? (
          <ErrorState
            description="The profile setup form could not load account profile data. Refresh the page, then try again."
            title="Profile unavailable"
            variant="network"
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <ProfileForm
              hasProfile={Boolean(profile)}
              initialDisplayName={profile?.display_name ?? ""}
              userEmail={userEmail}
            />

            <aside className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground shadow-paper-sm">
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold leading-tight text-foreground">
                  Profile scope
                </h2>
                {profile ? (
                  <ValidationAlert
                    messages={[`Current display name: ${profile.display_name}`]}
                    title="Profile found"
                    variant="success"
                  />
                ) : (
                  <ValidationAlert
                    messages={[
                      "No profile row was found for this account yet.",
                      "Saving creates one row using the signed-in user id."
                    ]}
                    title="Profile needed"
                  />
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
