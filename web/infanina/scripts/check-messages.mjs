#!/usr/bin/env node
/**
 * Verifies every locale file matches the shape of en.json.
 *
 * Catches the two ways a translation edit breaks the site:
 *   1. a missing key   → the raw key path renders on the page
 *   2. a changed shape → arrays read with t.raw() throw, and the route 500s
 *
 * Run with `npm run check:messages`. Exits non-zero on any error.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "messages");
const REFERENCE = "en";

const read = (locale) => JSON.parse(readFileSync(join(DIR, `${locale}.json`), "utf8"));

/** Walk a value into a map of path → shape descriptor. */
function shapeOf(value, path = "", out = new Map()) {
    if (Array.isArray(value)) {
        out.set(path, `array[${value.length}]`);
        value.forEach((v, i) => shapeOf(v, `${path}[${i}]`, out));
    } else if (value && typeof value === "object") {
        out.set(path, "object");
        for (const [k, v] of Object.entries(value)) {
            if (k.startsWith("_")) continue; // metadata like _untranslated
            shapeOf(v, path ? `${path}.${k}` : k, out);
        }
    } else {
        out.set(path, typeof value);
    }
    return out;
}

const locales = readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .filter((l) => l !== REFERENCE);

const reference = shapeOf(read(REFERENCE));
let failures = 0;

for (const locale of locales) {
    const actual = shapeOf(read(locale));
    const missing = [];
    const mismatched = [];
    const extra = [];

    for (const [path, kind] of reference) {
        if (!path) continue;
        if (!actual.has(path)) missing.push(path);
        else if (actual.get(path) !== kind) mismatched.push(`${path}: expected ${kind}, got ${actual.get(path)}`);
    }
    for (const path of actual.keys()) {
        if (path && !reference.has(path)) extra.push(path);
    }

    const untranslated = read(locale)._untranslated ? " (marked untranslated)" : "";

    if (!missing.length && !mismatched.length && !extra.length) {
        console.log(`✓ ${locale}${untranslated}`);
        continue;
    }

    failures++;
    console.log(`✗ ${locale}${untranslated}`);
    for (const p of missing.slice(0, 15)) console.log(`    missing:    ${p}`);
    if (missing.length > 15) console.log(`    ... and ${missing.length - 15} more missing`);
    for (const m of mismatched.slice(0, 15)) console.log(`    wrong type: ${m}`);
    if (mismatched.length > 15) console.log(`    ... and ${mismatched.length - 15} more type mismatches`);
    for (const p of extra.slice(0, 10)) console.log(`    unused:     ${p}`);
    if (extra.length > 10) console.log(`    ... and ${extra.length - 10} more unused`);
}

if (failures) {
    console.log(`\n${failures} locale file(s) do not match ${REFERENCE}.json. Fix before deploying.`);
    process.exit(1);
}
console.log(`\nAll ${locales.length} locale files match ${REFERENCE}.json.`);
