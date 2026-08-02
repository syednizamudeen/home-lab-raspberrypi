import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

/**
 * The share card. This is the most-seen image of the brand after the site
 * itself: WhatsApp, LinkedIn and Slack all render it.
 *
 * It uses the void world rather than paper, because link previews sit on white
 * feed backgrounds and a dark card holds its edges there.
 *
 * Node runtime, not edge: the studio deploys to its own hardware, and reading
 * the font off disk is simpler and more reliable than fetching it at build.
 */
export const runtime = "nodejs";
export const dynamic = "force-static";
export const contentType = "image/png";

const VOID = "#1A1320";
const VOID_INK = "#F4F1EC";
const VOID_INK_3 = "#9A8FA4";
const ACID = "#A8E63C";

export async function GET() {
    /* A *static* instance, deliberately. Satori hard-crashes the render
       process on Archivo's variable TTF, with no error thrown. */
    const archivo = await readFile(join(process.cwd(), "app/og-default/Archivo-ExtraBold.ttf"));

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "68px 76px",
                    background: VOID,
                    color: VOID_INK,
                    fontFamily: "Archivo",
                }}
            >
                <div style={{ display: "flex", alignItems: "baseline", fontSize: 38, fontWeight: 800, letterSpacing: "-0.045em" }}>
                    infanina
                    <span style={{ color: ACID }}>.</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            fontSize: 94,
                            fontWeight: 800,
                            lineHeight: 1.04,
                            letterSpacing: "-0.035em",
                            maxWidth: 900,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <span>Your next build</span>
                        <span style={{ display: "flex", flexDirection: "column" }}>
                            <span>starts here.</span>
                            <span style={{ width: 430, height: 8, background: ACID, marginTop: 10 }} />
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 21,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: VOID_INK_3,
                        borderTop: `1px solid #3A2C44`,
                        paddingTop: 26,
                    }}
                >
                    <span>Singapore · Web · Mobile · AI automation</span>
                    <span style={{ color: VOID_INK }}>{SITE.url.replace(/^https?:\/\//, "")}</span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [{ name: "Archivo", data: archivo, style: "normal", weight: 800 }],
        },
    );
}
