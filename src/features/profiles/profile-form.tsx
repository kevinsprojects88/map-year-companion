"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

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
import { saveProfileAction } from "@/server/actions/profile.actions";
import type { ProfileActionState } from "@/types/profile";

type ProfileFormProps = {
  hasProfile: boolean;
  initialDisplayName: string;
  userEmail: string | null;
};

function getInitialProfileState(displayName: string): ProfileActionState {
  return {
    displayName,
    fieldErrors: {},
    formError: null,
    status: "idle"
  };
}

function ProfileSubmitButton({ hasProfile }: { hasProfile: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} loadingText="Saving profile" type="submit">
      {hasProfile ? "Save display name" : "Create profile"}
    </Button>
  );
}

function ProfileForm({
  hasProfile,
  initialDisplayName,
  userEmail
}: ProfileFormProps) {
  const [state, formAction] = useActionState(
    saveProfileAction,
    getInitialProfileState(initialDisplayName)
  );
  const displayNameError = state.fieldErrors.displayName ?? null;
  const displayNameInputKey = `${state.status}-${state.displayName}`;

  return (
    <Card variant="raised" className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Set your display name</CardTitle>
        <CardDescription>
          {userEmail
            ? `Signed in as ${userEmail}.`
            : "Signed in with a private account."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          <FieldGroup>
            <Field
              description="Use 1 to 80 characters. This is saved as plain text."
              error={displayNameError}
              label="Display name"
              required
              variant={displayNameError ? "error" : "default"}
            >
              {(controlProps) => (
                <Input
                  {...controlProps}
                  autoComplete="name"
                  defaultValue={state.displayName}
                  key={displayNameInputKey}
                  maxLength={80}
                  name="display_name"
                  placeholder="Display name"
                />
              )}
            </Field>
          </FieldGroup>

          {state.formError ? (
            <ValidationAlert
              messages={[state.formError]}
              title="Profile not saved"
              variant="error"
            />
          ) : null}

          <ProfileSubmitButton hasProfile={hasProfile} />
        </form>
      </CardContent>
      <CardFooter>
        Successful saves return to the placeholder home page until the dashboard
        slice exists.
      </CardFooter>
    </Card>
  );
}

export { ProfileForm };
export type { ProfileFormProps };
