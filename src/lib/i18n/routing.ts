import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/i18n/locales';
import { defineRouting } from 'next-intl/routing';

/**
 * Locale routing configuration, consumed by the proxy (src/proxy.ts).
 *
 * - `localePrefix: 'as-needed'` serves the default locale unprefixed (`/about`)
 *   and prefixes the others (`/en/about`).
 * - `localeDetection: false` and `localeCookie: false` disable Accept-Language
 *   sniffing and cookie-based redirects, so a URL resolves the same way for
 *   every visitor. Turn them on only if a project actually wants redirects.
 */
export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});
