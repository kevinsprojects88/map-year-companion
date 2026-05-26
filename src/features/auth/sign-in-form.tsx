"use client";

import { useMemo, useState, type FormEvent } from "react";

import { ValidationAlert } from "@/components/feedback/validation-alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { buildAuthCallbackUrl } from "@/lib/auth/auth-redirects";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { validateMagicLinkEmail } from "@/lib/validation/auth.schema";

type SignInFormProps = {
  initialErrorMessage?: string | null;
  redirectPath: string;
};

type SubmitStatus = "idle" | "submitting" | "success";

function SignInForm({ initialErrorMessage, redirectPath }: SignInFormProps) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(
    initialErrorMessage ?? null
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateMagicLinkEmail(email);

    if (!validation.ok) {
      setFieldError(validation.message);
      setSubmitError(null);
      setStatus("idle");
      return;
    }

    setFieldError(null);
    setSubmitError(null);
    setStatus("submitting");

    const { error } = await supabase.auth.signInWithOtp({
      email: validation.email,
      options: {
        emailRedirectTo: buildAuthCallbackUrl(window.location.origin, redirectPath)
      }
    });

    if (error) {
      setSubmitError(
        "The sign-in email could not be sent. Check the address and try again."
      );
      setStatus("idle");
      return;
    }

    setSentEmail(validation.email);
    setStatus("success");
  }

  return (
    <Card variant="raised" className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Sign in by email</CardTitle>
        <CardDescription>
          Enter the email for your private account. Supabase will send a secure
          sign-in email for this browser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field
              description="No password is needed for this MVP slice."
              error={fieldError}
              label="Email address"
              required
              variant={fieldError ? "error" : "default"}
            >
              {(controlProps) => (
                <Input
                  {...controlProps}
                  autoComplete="email"
                  inputMode="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (fieldError) {
                      setFieldError(null);
                    }
                  }}
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                />
              )}
            </Field>
          </FieldGroup>

          {submitError ? (
            <ValidationAlert
              messages={[submitError]}
              title="Sign-in email not sent"
              variant="error"
            />
          ) : null}

          {status === "success" && sentEmail ? (
            <ValidationAlert
              messages={[
                `Check ${sentEmail} for the sign-in email.`,
                "The link can only be used once and may expire."
              ]}
              title="Sign-in email sent"
              variant="success"
            />
          ) : null}

          <Button
            loading={status === "submitting"}
            loadingText="Sending email"
            type="submit"
          >
            {status === "success" ? "Send another email" : "Send sign-in email"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        Accounts are required. Anonymous guest access is not part of this MVP.
      </CardFooter>
    </Card>
  );
}

export { SignInForm };
export type { SignInFormProps };
