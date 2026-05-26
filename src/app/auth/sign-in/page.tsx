import Link from "next/link";

import { ValidationAlert } from "@/components/feedback/validation-alert";
import { SignInForm } from "@/features/auth/sign-in-form";
import {
  getAuthRedirectErrorMessage,
  resolveSafeAuthRedirectPath,
  type AuthRedirectSearchParam
} from "@/lib/auth/auth-redirects";

type SignInSearchParams = {
  error?: AuthRedirectSearchParam;
  next?: AuthRedirectSearchParam;
};

type SignInPageProps = {
  searchParams?: Promise<SignInSearchParams>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectPath = resolveSafeAuthRedirectPath(resolvedSearchParams?.next);
  const initialErrorMessage = getAuthRedirectErrorMessage(
    resolvedSearchParams?.error
  );

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
              Phase 2 auth sign-in
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Open your private map-year workspace
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              Request a secure email sign-in link or one-time email flow. After
              sign-in, the app sends you to profile setup or the protected
              dashboard placeholder.
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <SignInForm
            initialErrorMessage={initialErrorMessage}
            redirectPath={redirectPath}
          />

          <aside className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground shadow-paper-sm">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold leading-tight text-foreground">
                Narrow scope
              </h2>
              <p>
                This page only sends the Magic Link / OTP request. Profile
                saving and protected dashboard access stay on their own routes.
              </p>
              <ValidationAlert
                messages={[
                  "Only public Supabase browser settings are used client-side.",
                  "Redirects are limited to internal app paths."
                ]}
                title="Auth safety checks"
                variant="success"
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
