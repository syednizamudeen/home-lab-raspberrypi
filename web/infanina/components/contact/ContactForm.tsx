"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { submitContactForm, type ContactFormState } from "@/app/[locale]/contact/actions";

const INITIAL: ContactFormState = { status: "idle" };
const TOPIC_KEYS = ["build", "automate", "advise", "other"] as const;

function SubmitButton({ idle, busy }: { idle: string; busy: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-pill bg-acid ps-7 pe-3 py-3 font-sans text-base font-semibold text-ink transition-[background-color,transform] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-acid-hover active:translate-y-px disabled:pointer-events-none disabled:opacity-60"
        >
            <span>{pending ? busy : idle}</span>
            <span
                aria-hidden
                className="inline-flex size-8 items-center justify-center rounded-full bg-[color-mix(in_oklab,currentColor_14%,transparent)] transition-transform duration-[180ms] group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
            >
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
                </svg>
            </span>
        </button>
    );
}

type FieldErrors = Record<string, string | undefined>;

function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) return null;
    return (
        /* Sentence case, not the mono caps used for labels: an error should
           correct you, not shout at you. */
        <p id={id} className="mt-2 text-[0.875rem] text-[var(--danger-void)]">
            {message}
        </p>
    );
}

export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
    const t = useTranslations("Contact.form");
    const [state, formAction] = useActionState(submitContactForm, INITIAL);
    const [errors, setErrors] = useState<FieldErrors>({});
    const uid = useId();
    const alertRef = useRef<HTMLDivElement>(null);

    /* A rejected submission must not silently blank the page. Moving focus to
       the alert both announces it and scrolls it into view, which matters most
       on a phone where the message sits below a five-row textarea. */
    useEffect(() => {
        if (state.status === "error") alertRef.current?.focus();
    }, [state]);

    /* The action echoes the submitted values back on failure, so nothing typed
       is lost. These are uncontrolled inputs; the defaults re-seed on re-render. */
    const sent = state.values;

    const label = "t-meta block text-[var(--on-surface-3)]";
    const field =
        "mt-2 block w-full rounded-[6px] border border-[var(--hairline)] bg-[var(--surface-raised)] px-4 py-3 " +
        "text-base text-[var(--on-surface)] placeholder:text-[var(--on-surface-3)] outline-none " +
        "transition-colors duration-[180ms] focus:border-[var(--on-surface-2)]";
    const invalid = "border-[var(--danger-void)]!";

    /** Validate on blur, never on keystroke: nobody wants to be corrected mid-word. */
    function validate(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const el = e.currentTarget;
        let msg: string | undefined;

        if (el.required && !el.value.trim()) msg = t("error_required");
        else if (el.type === "email" && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value))
            msg = t("error_email");

        setErrors((prev) => ({ ...prev, [el.name]: msg }));
    }

    if (state.status === "success") {
        return (
            <div role="status" className="border-t-2 border-acid pt-8">
                <p className="t-h2">{t("success_title")}</p>
                <p className="t-body mt-4 text-[var(--on-surface-2)]">{t("success_body")}</p>
            </div>
        );
    }

    function aria(name: string) {
        return {
            "aria-invalid": errors[name] ? true : undefined,
            "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
            onBlur: validate,
            className: `${field} ${errors[name] ? invalid : ""}`,
        };
    }

    return (
        <form action={formAction} noValidate className="space-y-7">
            {/* Honeypot. */}
            <div aria-hidden className="sr-only">
                <label htmlFor={`${uid}-website`}>Website</label>
                <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-7 sm:grid-cols-2">
                <div>
                    <label htmlFor={`${uid}-name`} className={label}>
                        {t("name_label")}
                    </label>
                    <input id={`${uid}-name`} name="name" defaultValue={sent?.name ?? ""} required autoComplete="name" placeholder={t("name_placeholder")} {...aria("name")} />
                    <FieldError id={`${uid}-name-error`} message={errors.name} />
                </div>

                <div>
                    <label htmlFor={`${uid}-email`} className={label}>
                        {t("email_label")}
                    </label>
                    <input id={`${uid}-email`} name="email" defaultValue={sent?.email ?? ""} type="email" required autoComplete="email" placeholder={t("email_placeholder")} {...aria("email")} />
                    <FieldError id={`${uid}-email-error`} message={errors.email} />
                </div>

                <div>
                    <label htmlFor={`${uid}-company`} className={label}>
                        {t("company_label")}
                    </label>
                    <input id={`${uid}-company`} name="company" defaultValue={sent?.company ?? ""} autoComplete="organization" placeholder={t("company_placeholder")} {...aria("company")} />
                </div>

                <div>
                    <label htmlFor={`${uid}-phone`} className={label}>
                        {t("phone_label")}
                    </label>
                    <input id={`${uid}-phone`} name="phone" defaultValue={sent?.phone ?? ""} type="tel" inputMode="tel" autoComplete="tel" placeholder={t("phone_placeholder")} {...aria("phone")} dir="ltr" />
                </div>
            </div>

            <fieldset>
                <legend className={label}>{t("topic_label")}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                    {TOPIC_KEYS.map((k, i) => (
                        <label
                            key={k}
                            className="cursor-pointer rounded-pill border border-[var(--hairline)] px-4 py-2.5 text-[0.9375rem] text-[var(--on-surface-2)] transition-colors duration-[180ms] hover:border-[var(--on-surface-2)] has-checked:border-acid has-checked:bg-acid has-checked:text-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[var(--accent-text)]"
                        >
                            <input
                                type="radio"
                                name="topic"
                                value={k}
                                defaultChecked={sent ? sent.topic === k : i === 0}
                                className="sr-only"
                            />
                            {t(`topic_options.${k}`)}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div>
                <label htmlFor={`${uid}-message`} className={label}>
                    {t("message_label")}
                </label>
                <textarea id={`${uid}-message`} name="message" required rows={5} defaultValue={sent?.message ?? ""} placeholder={t("message_placeholder")} {...aria("message")} />
                <FieldError id={`${uid}-message-error`} message={errors.message} />
            </div>

            <div aria-live="polite">
                {state.status === "error" && (
                    <div
                        ref={alertRef}
                        tabIndex={-1}
                        role="alert"
                        className="scroll-mt-28 border-t-2 border-[var(--danger-void)] pt-4 outline-none"
                    >
                        <p className="font-semibold text-[var(--on-surface)]">{t("error_title")}</p>
                        <p className="t-body mt-1 text-[var(--on-surface-2)]">{state.message ?? t("error_body")}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col-reverse items-start gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="t-body text-[0.875rem] text-[var(--on-surface-3)]">
                    {t("fallback_hint")}{" "}
                    <a
                        className="text-[var(--on-surface)] underline decoration-[var(--hairline)] underline-offset-4 hover:decoration-acid"
                        href={`mailto:${fallbackEmail}`}
                    >
                        {fallbackEmail}
                    </a>
                </p>
                <SubmitButton idle={t("submit")} busy={t("submitting")} />
            </div>
        </form>
    );
}
