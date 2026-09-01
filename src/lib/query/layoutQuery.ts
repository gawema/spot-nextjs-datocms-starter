import { PrivacyFragment } from '@/components/layout/Privacy/fragment';
import { SiteStructuredDataFragment } from '@/components/seo/SiteStructuredData/fragment';
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
        ...SiteStructuredDataFragment
      }
      siteSetting {
        ...PrivacyFragment
      }
      # Every page's slug in every language, so the locale switcher can send a
      # visitor to the translation of the page they are on.
      allPages(first: 100) {
        isHome
        _allSlugLocales {
          locale
          value
        }
      }
    }
  `,
  [
    TagFragment,
    SiteHeaderFragment,
    SiteFooterFragment,
    SiteStructuredDataFragment,
    PrivacyFragment,
  ],
);
