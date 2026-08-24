import { type SiteLocale, isSupportedLocale } from '@/lib/i18n/locales';
import { notFound } from 'next/navigation';

/**
 * Narrows a `[locale]` route param to a `SiteLocale`.
 *
 * The root layout already rejects unknown locales, but TypeScript only sees a
 * `string`: since `notFound()` returns `never`, this hands back the narrow type
 * without a cast.
 */
export function toSiteLocale(locale: string): SiteLocale {
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return locale;
}
