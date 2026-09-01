import JsonLd from '@/components/seo/JsonLd';
import { SiteStructuredDataFragment } from '@/components/seo/SiteStructuredData/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SiteLocale } from '@/lib/i18n/locales';
import { buildSiteGraph } from '@/lib/seo/structuredData';

type Props = {
  data: FragmentOf<typeof SiteStructuredDataFragment> | null;
  locale: SiteLocale;
  siteName: string | null;
};

/**
 * Organization and WebSite, from the layout so every page carries them.
 *
 * Without a site name there is nothing worth claiming about the organization,
 * so the graph is skipped rather than emitted half empty.
 */
export default function SiteStructuredData({ data, locale, siteName }: Props) {
  if (!siteName) {
    return null;
  }

  const layout = data ? readFragment(SiteStructuredDataFragment, data) : null;
  const sameAs = (layout?.socialLinks ?? [])
    .map(({ externalUrl }) => externalUrl)
    .filter((url): url is string => Boolean(url));

  return <JsonLd data={buildSiteGraph({ locale, siteName, logoUrl: layout?.logo?.url, sameAs })} />;
}
