import { type SiteLocale, localizePathname } from '@/lib/i18n/locales';
import { SITE_URL, absoluteUrl } from '@/lib/seo/site';

/*
 * The schema.org graph, in two halves: what is true of the whole site, emitted
 * once from the layout, and what is true of one page, emitted from the route.
 * The two are joined by `@id`, so a crawler reads them as one description of
 * one organization rather than as unrelated fragments.
 *
 * Deliberately small. A project that needs `LocalBusiness`, `Product` or
 * `Event` nodes adds them here with their own `@id` and points at them from the
 * page node, which is what `about` is for.
 */

type Node = Record<string, unknown>;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * schema.org wants a BCP 47 tag; DatoCMS locales are bare language codes. The
 * exhaustive record means adding a locale without a tag fails to compile.
 */
const LANGUAGE_TAG: Record<SiteLocale, string> = {
  de: 'de-CH',
  en: 'en',
};

/** Organization and WebSite: the same on every page, so the layout emits it. */
export function buildSiteGraph({
  locale,
  siteName,
  logoUrl,
  sameAs,
}: {
  locale: SiteLocale;
  siteName: string;
  logoUrl?: string | null;
  /** Profile URLs, from the social links in the footer. */
  sameAs?: string[];
}): Node {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: siteName,
        url: SITE_URL,
        ...(logoUrl ? { logo: logoUrl, image: logoUrl } : {}),
        ...(sameAs?.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: siteName,
        url: SITE_URL,
        inLanguage: LANGUAGE_TAG[locale],
        publisher: { '@id': ORGANIZATION_ID },
      },
    ],
  };
}

/** WebPage, plus a two-step breadcrumb on everything that is not the home. */
export function buildPageGraph({
  locale,
  url,
  title,
  siteName,
  isHome,
}: {
  locale: SiteLocale;
  /** Absolute canonical URL of the page. */
  url: string;
  title: string;
  siteName: string;
  isHome: boolean;
}): Node {
  const breadcrumb: Node | null = isHome
    ? null
    : {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: siteName,
            item: absoluteUrl(localizePathname('/', locale)),
          },
          { '@type': 'ListItem', position: 2, name: title, item: url },
        ],
      };

  const webPage: Node = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    inLanguage: LANGUAGE_TAG[locale],
    isPartOf: { '@id': WEBSITE_ID },
    ...(breadcrumb ? { breadcrumb: { '@id': breadcrumb['@id'] } } : {}),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': breadcrumb ? [webPage, breadcrumb] : [webPage],
  };
}
