import PageStructuredData from '@/components/seo/PageStructuredData';
import { generatePageComponentAndMetadataFn } from '@/lib/datocms/realtime/generatePageComponentAndMetadataFn';
import { toSiteLocale } from '@/lib/i18n/params';
import { PageQuery, pageFilter } from '@/lib/query/pageQuery';
import { toPageAlternates } from '@/lib/routing/pageAlternates';
import { canonicalPageUrl, languageUrls } from '@/lib/seo/pageUrls';
import dynamic from 'next/dynamic';
import Content, { type PageProps } from './Content';

/**
 * Every page record is served from here, the home page included: an optional
 * catch-all means one route file instead of one per depth.
 *
 * With draft mode off, the published content is rendered on the server and the
 * GraphQL result is cached under the 'datocms' tag until the CMS webhook
 * invalidates it, so regular visitors never hit DatoCMS. With draft mode on,
 * the route renders the realtime client component instead, and edits appear
 * without a reload.
 *
 * @see src/lib/datocms/executeQuery.ts for the caching details
 * @see src/app/api/invalidate-cache/route.tsx for the webhook
 */

const { generateMetadataFn, Page } = generatePageComponentAndMetadataFn({
  query: PageQuery,
  buildQueryVariables: async ({ params }: PageProps) => {
    const { locale, slug } = await params;
    return { filter: pageFilter(slug), locale: toSiteLocale(locale) };
  },
  pickSeoMetaTags: (data) => data.page?._seoMetaTags,
  /*
   * DatoCMS emits no canonical link, so the route says where it lives, and the
   * page's slug in every language becomes the hreflang alternates.
   */
  pickUrls: async (data, { params }: PageProps) => {
    const { locale, slug } = await params;
    const siteLocale = toSiteLocale(locale);
    const canonical = canonicalPageUrl(slug, siteLocale);

    if (!data.page) {
      return { canonical };
    }

    const alternates = toPageAlternates(data.page.isHome, data.page._allSlugLocales ?? []);

    return { canonical, languages: languageUrls(alternates) };
  },
  contentComponent: Content,
  realtimeComponent: dynamic(() => import('./RealTime')),
});

export const generateMetadata = generateMetadataFn;

export default async function PageRoute(props: PageProps) {
  const { locale, slug } = await props.params;

  return (
    <>
      <Page {...props} />
      <PageStructuredData locale={toSiteLocale(locale)} segments={slug} />
    </>
  );
}
