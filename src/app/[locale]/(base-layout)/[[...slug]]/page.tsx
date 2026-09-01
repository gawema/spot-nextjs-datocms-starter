import { generatePageComponentAndMetadataFn } from '@/lib/datocms/realtime/generatePageComponentAndMetadataFn';
import { toSiteLocale } from '@/lib/i18n/params';
import { PageQuery } from '@/lib/query/pageQuery';
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

/**
 * The site root is the page flagged as the home, and every other URL is a slug.
 * The home is excluded from the slug lookup, so its own slug is a 404 rather
 * than a second URL for the same page.
 *
 * Identifying the home by a flag and not by a magic slug is deliberate: a slug
 * is translatable, and an automatic translation of it once took the root down.
 */
function toFilter(segments: string[] | undefined) {
  if (!segments) {
    return { isHome: { eq: true } };
  }

  return { slug: { eq: segments.join('/') }, isHome: { eq: false } };
}

const { generateMetadataFn, Page } = generatePageComponentAndMetadataFn({
  query: PageQuery,
  buildQueryVariables: async ({ params }: PageProps) => {
    const { locale, slug } = await params;
    return { filter: toFilter(slug), locale: toSiteLocale(locale) };
  },
  pickSeoMetaTags: (data) => data.page?._seoMetaTags,
  contentComponent: Content,
  realtimeComponent: dynamic(() => import('./RealTime')),
});

export const generateMetadata = generateMetadataFn;
export default Page;
