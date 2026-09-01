import type { SiteLocale } from '@/lib/i18n/locales';

/**
 * A page's slug in each language, and whether it is the home. The locale
 * switcher needs it on the client, the layout builds it on the server, so it
 * lives here rather than in either of them: a function exported from a
 * `'use client'` module cannot be called by a server component.
 */
export type PageAlternates = {
  isHome: boolean;
  slugs: Partial<Record<SiteLocale, string>>;
};

/**
 * Written as a loop rather than with `Object.fromEntries`, whose values are
 * typed `any`: that `any` is what let a wrong shape reach the switcher and blow
 * up at runtime while `tsc` stayed quiet.
 */
export function toPageAlternates(
  isHome: boolean,
  slugLocales: readonly { locale: SiteLocale | null; value: string }[],
): PageAlternates {
  const slugs: PageAlternates['slugs'] = {};

  for (const { locale, value } of slugLocales) {
    // The schema types the locale as nullable, so an entry without one is skipped.
    if (locale) {
      slugs[locale] = value;
    }
  }

  return { isHome, slugs };
}
