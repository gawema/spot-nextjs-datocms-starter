import Sections from '@/components/cms/Sections';
import SectionContainer from '@/components/layout/SectionContainer';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { generateMetadataFn } from '@/lib/datocms/generateMetadataFn';
import { HOME_SLUG } from '@/lib/datocms/gqlUrlBuilder/page';
import type { ResultOf, VariablesOf } from '@/lib/datocms/graphql';
import { toSiteLocale } from '@/lib/i18n/params';
import { PageQuery } from '@/lib/query/pageQuery';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

/**
 * Every page record is served from here, the home page included: an optional
 * catch-all means one route file instead of one per depth.
 *
 * Caching behaviour is inherited from `executeQuery()`: the route is rendered
 * per request because of `draftMode()`, but the GraphQL result is cached under
 * the 'datocms' tag and invalidated by the CMS webhook.
 */

type PageProps = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

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

export const generateMetadata = generateMetadataFn<
  PageProps,
  ResultOf<typeof PageQuery>,
  VariablesOf<typeof PageQuery>
>({
  query: PageQuery,
  pickSeoMetaTags: (data) => data.page?._seoMetaTags,
  buildQueryVariables: async ({ params }) => {
    const { locale, slug } = await params;
    return { slug: toSlug(slug), locale: toSiteLocale(locale) };
  },
});

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  const { page } = await executeQuery(PageQuery, {
    variables: { slug: toSlug(slug), locale: toSiteLocale(locale) },
    includeDrafts: isDraftModeEnabled,
  });

  if (!page) {
    notFound();
  }

  return (
    <>
      <SectionContainer className="padding-vertical-large">
        <h1>{page.title}</h1>
      </SectionContainer>
      <Sections data={page.sections} locale={toSiteLocale(locale)} />
    </>
  );
}
