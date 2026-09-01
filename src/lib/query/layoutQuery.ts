import { PrivacyFragment } from '@/components/layout/Privacy/fragment';
import { SiteFooterFragment } from '@/components/layout/SiteFooter/fragment';
import { SiteHeaderFragment } from '@/components/layout/SiteHeader/fragment';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { graphql } from '@/lib/datocms/graphql';

/**
 * Everything the shell around a page needs: the favicon and site name from the
 * project's SEO preferences, and the header and footer content from the Layout
 * singleton.
 *
 * `layout` and `siteSetting` come back null on a project where nobody has filled
 * those records yet, so every component treats its data as optional.
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
      siteSetting {
        ...PrivacyFragment
      }
    }
  `,
  [TagFragment, SiteHeaderFragment, SiteFooterFragment, PrivacyFragment],
);
