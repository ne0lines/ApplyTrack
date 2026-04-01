"use client";

import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useAuth, useSignIn, useSignUp } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Btn } from "../ui/btn";

export default function AuthPageClient() {
  const { isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const t = useTranslations("auth");

  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [feedback, setFeedBack] = useState("");
  const [loading, setLoading] = useState<"submit" | "verify" | "resend" | null>(
    null,
  );

  function clerkErrorMessage(errorCode: string | undefined): string {
    if (!errorCode) return t("errors.unknown");
    const key = `errors.${errorCode}` as Parameters<typeof t>[0];
    try {
      const msg = t(key);
      return msg !== key ? msg : t("errors.unknown", { code: errorCode });
    } catch {
      return t("errors.unknown");
    }
  }

  const navigate = (decorateUrl: (url: string) => string) => {
    const url = decorateUrl("/");
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      router.push(url);
    }
  };

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ decorateUrl }) => navigate(decorateUrl),
    });
  };

  const finalizeSignUp = async () => {
    await signUp.finalize({
      navigate: ({ decorateUrl }) => navigate(decorateUrl),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedBack("");
    setLoading("submit");
    try {
      const { error: createError } = await signIn.create({
        identifier: emailAddress,
        signUpIfMissing: true,
      });

      if (createError) {
        const code = isClerkAPIResponseError(createError) ? createError.errors[0]?.code : undefined;
        setFeedBack(clerkErrorMessage(code));
        return;
      }

      const { error: sendError } = await signIn.emailCode.sendCode();

      if (sendError) {
        const code = isClerkAPIResponseError(sendError) ? sendError.errors[0]?.code : undefined;
        setFeedBack(clerkErrorMessage(code));
        return;
      }

      setVerifying(true);
    } finally {
      setLoading(null);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedBack("");
    setLoading("verify");
    const { error } = await signIn.emailCode.verifyCode({ code });
    const clerkCode =
      error && isClerkAPIResponseError(error)
        ? error.errors[0]?.code
        : undefined;

    if (error) {
      if (isSignedIn) {
        router.push("/");
        return;
      }

      if (clerkCode === "sign_up_if_missing_transfer") {
        await handleTransfer();
        setLoading(null);
        return;
      }

      setFeedBack(clerkErrorMessage(clerkCode));
      setLoading(null);
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      setFeedBack(clerkErrorMessage(undefined));
    }
    setLoading(null);
  };

  const handleTransfer = async () => {
    const { error } = await signUp.create({ transfer: true });
    if (error) {
      const code = isClerkAPIResponseError(error) ? error.errors[0]?.code : undefined;
      setFeedBack(clerkErrorMessage(code));
      return;
    }

    if (signUp.status === "complete") {
      await finalizeSignUp();
    } else {
      setFeedBack(clerkErrorMessage(undefined));
    }
  };

  if (verifying || signIn.status === "needs_client_trust") {
    return (
      <main className="min-h-dvh px-4">
        <h1 className="font-display text-4xl leading-none">
          Jobi<span className="text-app-primary">.sh</span>
        </h1>
        <section className="mx-auto flex min-h-dvh w-full flex-col gap-4">
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
            <h2 className="text-2xl">{t("verifyTitle")}</h2>
            <p>
              {t("verifyDescription")}{" "}
              <strong>{emailAddress}</strong>
            </p>
            <form
              onSubmit={handleVerify}
              className="w-full space-y-4 rounded-2xl border border-app-stroke bg-app-card p-4"
            >
              <div>
                <label htmlFor="code">{t("verifyCodeLabel")}</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-app-stroke bg-white px-4 py-3.5 text-base text-app-ink outline-none transition focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
                  id="code"
                  name="code"
                  placeholder="XXXXXX"
                  required
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                {feedback && (
                  <p className="mt-2 text-sm text-red-500">{feedback}</p>
                )}
              </div>
              <Btn className="w-full" disabled={loading !== null} type="submit">
                {loading === "verify" ? t("verifying") : t("verifyBtn")}
              </Btn>
              <div className="flex items-center justify-center gap-4">
                <Btn
                  type="button"
                  disabled={loading !== null}
                  onClick={async () => {
                    setFeedBack("");
                    setLoading("resend");
                    await signIn.emailCode.sendCode();
                    setLoading(null);
                  }}
                  variant="secondary"
                >
                  {loading === "resend" ? t("resending") : t("resendBtn")}
                </Btn>
                <Btn
                  type="button"
                  disabled={loading !== null}
                  onClick={() => {
                    signIn.reset();
                    setVerifying(false);
                    setFeedBack("");
                    setLoading(null);
                  }}
                  variant="red"
                >
                  {t("resetBtn")}
                </Btn>
              </div>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-svh">
      <section className="mx-auto flex min-h-svh w-full flex-col gap-4">
        <div className="space-y-2">
          <h1 className="font-display text-4xl leading-none">
            Jobi<span className="text-app-primary">.sh</span>
          </h1>
        </div>
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
          <h2 className="text-2xl">{t("loginTitle")}</h2>
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4 rounded-2xl border border-app-stroke bg-app-card p-4"
          >
            <label className="block font-semibold text-app-muted">
              <span className="block">{t("emailLabel")}</span>
              <input
                className="mt-2 w-full rounded-2xl border border-app-stroke bg-white px-4 py-3.5 text-base text-app-ink outline-none transition focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
                id="email"
                name="email"
                placeholder={t("emailPlaceholder")}
                required
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </label>

            {feedback ? (
              <p className="rounded-2xl border border-app-stroke bg-white px-4 py-3 text-sm text-app-muted">
                {feedback}
              </p>
            ) : null}

            <Btn className="w-full" disabled={loading !== null} type="submit">
              {loading === "submit" ? t("loggingIn") : t("continueBtn")}
            </Btn>
            <div id="clerk-captcha" />
          </form>
        </div>
      </section>
    </main>
  );
}
