"use server";

import { SITE } from "@/lib/site";

export interface ContactFormState {
    status: "idle" | "success" | "error";
    message?: string;
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
    const topic = String(formData.get("topic") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
        return { status: "error", message: "Please fill in name, email and message." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { status: "error", message: "That email address doesn't look right." };
    }

    const endpoint = process.env.INFANINA_CONTACT_ENDPOINT;

    if (!endpoint) {
        // Dev fallback — log so the developer can see it. Mailto link is shown in the UI as a backup.
        console.info("[contact] No INFANINA_CONTACT_ENDPOINT set; logging submission instead.", {
            name,
            email,
            company,
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
                topic,
                message,
                source: SITE.url,
            }),
        });
        if (!res.ok) {
            return { status: "error", message: "We couldn't deliver your message. Please try again." };
        }
        return { status: "success" };
    } catch {
        return { status: "error", message: "Network hiccup. Please try again or email us." };
    }
}
