"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { loginAction, type LoginState } from "./actions";

const FIELD =
  "h-tap w-full rounded-lg border border-gold-border bg-white px-3 font-sans text-body-md text-on-surface focus:border-primary-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/15";

export function LoginForm() {
  const t = useTranslations("admin.login");
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-sans text-label-md font-semibold text-on-surface">
          {t("email")}
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={FIELD} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="font-sans text-label-md font-semibold text-on-surface">
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={FIELD}
        />
      </div>
      {state?.error ? (
        <p role="alert" className="rounded-lg bg-error-container px-3 py-2 font-sans text-body-sm text-on-error-container">
          {t(`errors.${state.error}`)}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-tap items-center justify-center rounded-lg border border-deep-gold bg-primary-container px-6 font-sans text-label-lg font-semibold text-on-primary-container transition-colors hover:bg-deep-gold hover:text-background disabled:opacity-50"
      >
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
