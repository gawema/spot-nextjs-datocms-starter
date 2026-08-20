import { routing } from '@/lib/i18n/routing';
import createMiddleware from 'next-intl/middleware';

/*
 * Locale-routing proxy: rewrites unprefixed URLs to the default locale
 * (`/foo` -> `/de/foo` internally) and strips superfluous default-locale
 * prefixes, based purely on the static config in lib/i18n/routing.ts.
 *
 * IMPORTANT: never fetch data (DatoCMS or otherwise) in here. The proxy runs
 * on EVERY request and does not use the Next.js Data Cache, so `force-cache`
 * and `next.tags` are silently ignored and every hit goes out live. Loading
 * redirects from the CDA in middleware caused a large API overage on a real
 * project.
 */
export default createMiddleware(routing);

export const config = {
  /*
   * Run on all paths except:
   * - /api (route handlers: draft mode, webhooks, previews)
   * - /private-datocms-plugin (locale-independent plugin screen)
   * - Next.js internals and static files (anything with a dot)
   */
  matcher: '/((?!api|private-datocms-plugin|_next|_vercel|.*\\..*).*)',
};
