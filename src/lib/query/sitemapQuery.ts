import { graphql } from '@/lib/datocms/graphql';

/**
 * Feeds `app/sitemap.ts`. `_locales` says which translations actually exist, so
 * a page that was never translated does not get an `/en` URL that would 404,
 * and `_allSlugLocales` gives the slug of each one.
 */
export const SitemapQuery = graphql(/* GraphQL */ `
  query SitemapQuery {
    allPages(first: 100) {
      _locales
      _updatedAt
      _allSlugLocales {
        locale
        value
      }
    }
  }
`);
