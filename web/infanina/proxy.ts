import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Locale negotiation. On an unprefixed URL this picks a locale from the
 * visitor's `Accept-Language` header, falls back to `en`, and redirects. An
 * explicit choice is remembered in the `NEXT_LOCALE` cookie, which outranks the
 * header on later visits.
 */
export default createMiddleware(routing);

export const config = {
    /**
     * Every path except:
     *   _next, _vercel  framework internals
     *   api             route handlers
     *   og-default      the share-card image, which has no file extension and
     *                   must not be redirected into a locale
     *   *.*             anything with an extension: favicon.ico, robots.txt,
     *                   sitemap.xml, images
     *
     * Matching bare paths as well as prefixed ones is what makes
     * `infanina.com/contact` resolve instead of returning 404.
     */
    matcher: ['/((?!_next|_vercel|api|og-default|.*\\..*).*)'],
};
