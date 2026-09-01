import { SectionsFragment } from '@/components/cms/Sections';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { graphql } from '@/lib/datocms/graphql';

/*
 * Queries live in their own module rather than inside the route file, because a
 * query always ends up with more than one consumer: the route, its metadata, and
 * later the client component that re-runs it for live draft updates.
 *
 * `locale` is passed at the record level and applies to the whole subtree, so
 * every localized field below comes back in one language.
 *
 * The filter is a variable rather than a fixed shape because the site root is
 * found by `isHome` and every other URL by its slug: one query, two ways in.
 */
export const PageQuery = graphql(
  /* GraphQL */ `
    query PageQuery($filter: PageModelFilter!, $locale: SiteLocale!) {
      _site {
        globalSeo(locale: $locale, fallbackLocales: [de]) {
          siteName
        }
      }
      page(filter: $filter, locale: $locale) {
        _seoMetaTags {
          ...TagFragment
        }
        title
        isHome
        # The canonical URL and the hreflang alternates are built from these.
        _allSlugLocales {
          locale
          value
        }
        sections {
          ...SectionsFragment
        }
      }
    }
  `,
  [TagFragment, SectionsFragment],
);

/**
 * The site root is the page flagged as the home, and every other URL is a slug.
 * The home is excluded from the slug lookup, so its own slug is a 404 rather
 * than a second URL for the same page.
 *
 * Identifying the home by a flag and not by a magic slug is deliberate: a slug
 * is translatable, and an automatic translation of it once took the root down.
 */
export function pageFilter(segments: string[] | undefined) {
  if (!segments) {
    return { isHome: { eq: true } };
  }

  return { slug: { eq: segments.join('/') }, isHome: { eq: false } };
}
