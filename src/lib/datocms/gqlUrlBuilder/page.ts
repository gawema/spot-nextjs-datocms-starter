import { type FragmentOf, graphql, readFragment } from '@/lib/datocms/graphql';
import { type SiteLocale, localizePathname } from '@/lib/i18n/locales';

/**
 * Per-model URL builder for `PageRecord`: the single source of truth for
 * "given a page record, what is its URL".
 *
 * The fragment is always declared even when only `slug` is needed: callers
 * compose the fragment, never raw fields, so the URL shape can grow (e.g. to
 * `/[year]/[slug]`) without touching any caller. The builder accepts the masked
 * fragment and unmasks internally.
 */

/**
 * The page whose slug is this is served at the site root. Both the route and
 * this builder read the constant, so `/` stays the only URL for that record.
 */
export const HOME_SLUG = 'home';

export const PageUrlFragment = graphql(/* GraphQL */ `
  fragment PageUrlFragment on PageRecord {
    slug
  }
`);

export function buildUrlForPage(page: FragmentOf<typeof PageUrlFragment>, locale: SiteLocale) {
  const data = readFragment(PageUrlFragment, page);

  /*
   * `slug` is localized, so it already comes back in the queried locale: only
   * the prefix is left to add, and the default locale carries none.
   */
  return localizePathname(data.slug === HOME_SLUG ? '/' : `/${data.slug}`, locale);
}
