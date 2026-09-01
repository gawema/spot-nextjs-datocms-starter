import { HOME_SLUG } from '@/lib/routing/pagePath';
import { generatePageComponentAndMetadataFn } from '@/lib/datocms/realtime/generatePageComponentAndMetadataFn';
import { toSiteLocale } from '@/lib/i18n/params';
import { PageQuery } from '@/lib/query/pageQuery';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
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
 * `/` serves the record whose slug is `home`. Asking for `/home` explicitly is a
 * 404 rather than a second URL for the same page.
 */
function toSlug(segments: string[] | undefined): string {
  if (!segments) {
    return HOME_SLUG;
  }

  const slug = segments.join('/');

  if (slug === HOME_SLUG) {
    notFound();
  }

  return slug;
}

const { generateMetadataFn, Page } = generatePageComponentAndMetadataFn({
  query: PageQuery,
  buildQueryVariables: async ({ params }: PageProps) => {
    const { locale, slug } = await params;
    return { slug: toSlug(slug), locale: toSiteLocale(locale) };
  },
  pickSeoMetaTags: (data) => data.page?._seoMetaTags,
  contentComponent: Content,
  realtimeComponent: dynamic(() => import('./RealTime')),
});

export const generateMetadata = generateMetadataFn;
export default Page;
