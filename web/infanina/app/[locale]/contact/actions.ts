"use server";

import { SITE } from "@/lib/site";

export interface ContactFormState {
    status: "idle" | "success" | "error";
    message?: string;
    /** Echoed back on failure so a rejected submission never clears the form. */
    values?: {
        name: string;
        email: string;
        company: string;
        phone: string;
        topic: string;
        message: string;
    };
}

export async function submitContactForm(
    _prev: ContactFormState,
    formData: FormData,
): Promise<ContactFormState> {
    // Honeypot — silently succeed if filled (likely a bot)
    if (formData.get("website")) {
        return { status: "success" };
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const topic = String(formData.get("topic") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const values = { name, email, company, phone, topic, message };

    if (!name || !email || !message) {
        return { status: "error", message: "Please fill in name, email and message.", values };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { status: "error", message: "That email address doesn't look right.", values };
    }

    const endpoint = process.env.INFANINA_CONTACT_ENDPOINT;

    if (!endpoint) {
        if (process.env.NODE_ENV === "production") {
            /* Never tell a visitor "we'll be in touch" when the message has
               nowhere to go. Failing loudly costs one enquiry; failing silently
               costs every enquiry until someone notices. The UI shows the
               mailto fallback alongside this error. */
            console.error(
                "[contact] INFANINA_CONTACT_ENDPOINT is not set in production. Submission was NOT delivered.",
            );
            return {
                status: "error",
                message: "Our form is not connected right now. Please email us directly and we will reply the same way.",
                values,
            };
        }

        // Development: log the submission so it can be inspected locally.
        console.info("[contact] No INFANINA_CONTACT_ENDPOINT set; logging submission instead.", {
            name,
            email,
            company,
            phone,
            topic,
            message,
        });
        return { status: "success" };
    }

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
                name,
                email,
                company,
                phone,
                topic,
                message,
                source: SITE.url,
            }),
        });
        if (!res.ok) {
            return { status: "error", message: "We couldn't deliver your message. Please try again.", values };
        }
        return { status: "success" };
    } catch {
        return { status: "error", message: "Network hiccup. Please try again or email us.", values };
    }
}
