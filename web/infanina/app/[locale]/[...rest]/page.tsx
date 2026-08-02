import { notFound } from "next/navigation";

/**
 * Catch-all for unmatched paths inside a locale.
 *
 * Without this, an unknown URL falls through to Next's global 404, which sits
 * outside the locale layout: no header, no footer, no translations. Throwing
 * from here renders `[locale]/not-found.tsx` *inside* the layout instead, so the
 * 404 is a real page of the site.
 *
 * Deliberately exports no metadata. `generateMetadata` here does not win over
 * the layout's title, and it emits a second, contradictory `robots` tag
 * alongside it. The 404 status code is what actually keeps the page out of an
 * index; the tab title is set in `not-found.tsx`.
 */
export default function CatchAllNotFound() {
    notFound();
}
