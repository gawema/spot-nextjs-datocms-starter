import { SiteFooterFragment } from '@/components/layout/SiteFooter/fragment';
import { SiteHeaderFragment } from '@/components/layout/SiteHeader/fragment';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { graphql } from '@/lib/datocms/graphql';

/**
 * Everything the shell around a page needs: the favicon and site name from the
 * project's SEO preferences, and the header and footer content from the Layout
 * singleton.
 *
 * `layout` comes back null on a project where nobody has filled the record yet,
 * so both components treat their data as optional.
 */
export const LayoutQuery = graphql(
  /* GraphQL */ `
    query LayoutQuery($locale: SiteLocale!) {
      _site {
        faviconMetaTags {
          ...TagFragment
        }
        globalSeo(locale: $locale, fallbackLocales: [de]) {
          siteName
        }
      }
      layout(locale: $locale, fallbackLocales: [de]) {
        ...SiteHeaderFragment
        ...SiteFooterFragment
      }
    }
  `,
  [TagFragment, SiteHeaderFragment, SiteFooterFragment],
);
