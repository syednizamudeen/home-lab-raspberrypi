"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Send, Check, AlertTriangle } from "lucide-react";
import { submitContactForm, type ContactFormState } from "@/app/[locale]/contact/actions";

const INITIAL: ContactFormState = { status: "idle" };

const TOPIC_KEYS = ["build", "integrate", "strategy", "other"] as const;

function SubmitButton({ idle, busy }: { idle: string; busy: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            data-focus-ring
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[var(--color-brand)] px-6 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
            <Send className="h-4 w-4" />
            {pending ? busy : idle}
        </button>
    );
}

export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
    const t = useTranslations("Contact.form");
    const [state, formAction] = useActionState(submitContactForm, INITIAL);

    const labelCls = "text-sm font-medium text-[var(--color-text-primary)]";
    const inputCls =
        "block w-full rounded-[10px] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-brand)] focus:ring-[3px] focus:ring-[var(--color-brand-subtle-bg)]";

    if (state.status === "success") {
        return (
            <div
                role="status"
                className="flex flex-col items-start gap-3 rounded-[16px] border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 p-7"
            >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-success)] text-white">
                    <Check className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                    {t("success_title")}
                </h3>
                <p className="text-[var(--color-text-secondary)]">{t("success_body")}</p>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-5" noValidate>
            {/* Honeypot */}
            <div aria-hidden className="sr-only">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className={labelCls}>{t("name_label")}</label>
                    <input id="name" name="name" required autoComplete="name" placeholder={t("name_placeholder")} className={`${inputCls} h-11`} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className={labelCls}>{t("email_label")}</label>
                    <input id="email" name="email" type="email" required autoComplete="email" placeholder={t("email_placeholder")} className={`${inputCls} h-11`} />
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="company" className={labelCls}>{t("company_label")}</label>
                    <input id="company" name="company" autoComplete="organization" placeholder={t("company_placeholder")} className={`${inputCls} h-11`} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="topic" className={labelCls}>{t("topic_label")}</label>
                    <select id="topic" name="topic" defaultValue="build" className={`${inputCls} h-11 appearance-none pe-10 bg-[length:16px] bg-no-repeat`} style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7588' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")", backgroundPosition: "right 12px center" }}>
                        {TOPIC_KEYS.map((k) => (
                            <option key={k} value={k}>{t(`topic_options.${k}`)}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="message" className={labelCls}>{t("message_label")}</label>
                <textarea id="message" name="message" required rows={5} placeholder={t("message_placeholder")} className={`${inputCls} py-3 resize-y min-h-[140px]`} />
            </div>

            {state.status === "error" && (
                <div role="alert" className="flex items-start gap-3 rounded-[10px] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-3.5 text-sm text-[var(--color-text-primary)]">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-danger)]" />
                    <div>
                        <p className="font-semibold">{t("error_title")}</p>
                        <p className="text-[var(--color-text-secondary)]">
                            {state.message ?? t("error_body")}
                        </p>
                    </div>
                </div>
            )}

            <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--color-text-muted)]">
                    {t("fallback_hint")}
                    <a className="text-[var(--color-brand)] underline-offset-2 hover:underline" href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.
                </p>
                <SubmitButton idle={t("submit")} busy={t("submitting")} />
            </div>
        </form>
    );
}
