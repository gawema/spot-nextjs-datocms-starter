import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SiteLocale,
  localizePathname,
} from '@/lib/i18n/locales';
import type { PageAlternates } from '@/lib/routing/pageAlternates';
import { pagePathname } from '@/lib/routing/pagePath';
import { absoluteUrl } from '@/lib/seo/site';

/*
 * The absolute URLs of a page, for the canonical link, `og:url` and the
 * hreflang alternates. Kept out of `lib/routing` because `SITE_URL` reads the
 * environment, and the locale switcher imports that module on the client.
 */

/** The URL the request landed on, rebuilt from the catch-all segments. */
export function canonicalPageUrl(segments: string[] | undefined, locale: SiteLocale): string {
  const pathname = segments?.length ? `/${segments.join('/')}` : '/';
  return absoluteUrl(localizePathname(pathname, locale));
}

/**
 * One URL per existing translation. `x-default` points at the default locale,
 * which is what a search engine serves when it has no better match.
 */
export function languageUrls({ isHome, slugs }: PageAlternates): Record<string, string> {
  const urls: Record<string, string> = {};

  for (const locale of SUPPORTED_LOCALES) {
    const slug = slugs[locale];

    if (slug) {
      urls[locale] = absoluteUrl(pagePathname({ slug, isHome }, locale));
    }
  }

  const fallback = urls[DEFAULT_LOCALE];

  return fallback ? { ...urls, 'x-default': fallback } : urls;
}
