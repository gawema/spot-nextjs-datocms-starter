import JsonLd from '@/components/seo/JsonLd';
import { executeQuery } from '@/lib/datocms/executeQuery';
import type { SiteLocale } from '@/lib/i18n/locales';
import { PageQuery, pageFilter } from '@/lib/query/pageQuery';
import { canonicalPageUrl } from '@/lib/seo/pageUrls';
import { buildPageGraph } from '@/lib/seo/structuredData';

type Props = {
  locale: SiteLocale;
  segments?: string[];
};

/**
 * WebPage and breadcrumb, rendered from the route rather than from `Content`:
 * in draft mode `Content` runs inside a client component, where the site origin
 * is not in the environment and an absolute URL cannot be built.
 *
 * Always published content, never drafts, since nothing here is for a human
 * reading a preview. The query is the page's own, so this costs no request: the
 * fetch cache serves the result the route already asked for.
 */
export default async function PageStructuredData({ locale, segments }: Props) {
  const { page, _site } = await executeQuery(PageQuery, {
    variables: { filter: pageFilter(segments), locale },
  });

  const siteName = _site.globalSeo?.siteName;

  if (!page || !siteName) {
    return null;
  }

  return (
    <JsonLd
      data={buildPageGraph({
        locale,
        url: canonicalPageUrl(segments, locale),
        title: page.title,
        siteName,
        isHome: page.isHome,
      })}
    />
  );
}
