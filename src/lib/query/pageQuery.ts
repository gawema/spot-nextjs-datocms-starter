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
 */
export const PageQuery = graphql(
  /* GraphQL */ `
    query PageQuery($slug: String!, $locale: SiteLocale!) {
      page(filter: { slug: { eq: $slug } }, locale: $locale) {
        _seoMetaTags {
          ...TagFragment
        }
        title
        sections {
          ...SectionsFragment
        }
      }
    }
  `,
  [TagFragment, SectionsFragment],
);
