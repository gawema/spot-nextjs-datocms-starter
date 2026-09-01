import { type FragmentOf, graphql, readFragment } from '@/lib/datocms/graphql';
import type { SiteLocale } from '@/lib/i18n/locales';
import { pagePathname } from '@/lib/routing/pagePath';

/**
 * Per-model URL builder for `PageRecord`: the single source of truth for
 * "given a page record, what is its URL".
 *
 * The fragment is always declared even when only `slug` is needed: callers
 * compose the fragment, never raw fields, so the URL shape can grow (e.g. to
 * `/[year]/[slug]`) without touching any caller. The builder accepts the masked
 * fragment and unmasks internally.
 *
 * The rule itself lives in `lib/routing/pagePath`, which has no GraphQL
 * dependency, because the locale switcher needs it on the client too.
 */
export const PageUrlFragment = graphql(/* GraphQL */ `
  fragment PageUrlFragment on PageRecord {
    slug
    isHome
  }
`);

export function buildUrlForPage(page: FragmentOf<typeof PageUrlFragment>, locale: SiteLocale) {
  return pagePathname(readFragment(PageUrlFragment, page), locale);
}
