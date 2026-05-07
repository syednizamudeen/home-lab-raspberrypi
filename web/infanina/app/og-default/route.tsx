import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const dynamic = "force-static";
export const contentType = "image/png";

export async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px 80px",
                    background:
                        "radial-gradient(60% 50% at 18% 18%, rgba(255,163,175,0.45), transparent 70%), radial-gradient(50% 60% at 92% 8%, rgba(251,175,0,0.30), transparent 70%), linear-gradient(135deg, #007CBE 0%, #005B8C 100%)",
                    color: "white",
                    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <svg width="64" height="64" viewBox="0 0 28 28">
                        <rect x="3" y="3" width="22" height="22" rx="6" fill="#FFFFFF" />
                        <path
                            d="M9 19V11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5V13.5C14 14.8807 15.1193 16 16.5 16C17.8807 16 19 14.8807 19 13.5"
                            stroke="#007CBE"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            fill="none"
                        />
                    </svg>
                    <div
                        style={{
                            fontSize: 40,
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        infanina
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div
                        style={{
                            fontSize: 96,
                            fontWeight: 700,
                            lineHeight: 1.02,
                            letterSpacing: "-0.035em",
                            maxWidth: 980,
                        }}
                    >
                        AI products that ship.
                    </div>
                    <div
                        style={{
                            fontSize: 30,
                            fontWeight: 400,
                            opacity: 0.9,
                            maxWidth: 880,
                            lineHeight: 1.3,
                        }}
                    >
                        Built for the businesses that build everything else.
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 22,
                        opacity: 0.85,
                    }}
                >
                    <span style={{ fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                        AI product studio
                    </span>
                    <span style={{ fontWeight: 500 }}>{SITE.url.replace(/^https?:\/\//, "")}</span>
                </div>
            </div>
        ),
        { width: 1200, height: 630 },
    );
}
