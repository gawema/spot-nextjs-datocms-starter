import ContentLink from '@/components/cms/ContentLink';
import SiteHeader from '@/components/layout/SiteHeader';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { toSiteLocale } from '@/lib/i18n/params';
import { SITE_URL } from '@/lib/seo/site';
import { draftMode } from 'next/headers';
import { toNextMetadata } from 'react-datocms/seo';

import '../../global.css';
import { Metadata } from 'next';

/*
 * The site name lives in the project's SEO preferences on DatoCMS, so the
 * header reads it from there instead of from a constant no client project would
 * think to change.
 */
const query = graphql(
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
    }
  `,
  [TagFragment],
);

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  const data = await executeQuery(query, {
    variables: { locale: toSiteLocale(locale) },
    includeDrafts: isDraftModeEnabled,
  });

  return {
    // Resolves the relative URLs DatoCMS emits in SEO and social meta tags.
    metadataBase: new URL(SITE_URL),
    ...toNextMetadata(data._site.faviconMetaTags),
  };
}

export default async function BaseLayout({ children, params }: Readonly<LayoutProps>) {
  const { locale } = await params;
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  const { _site } = await executeQuery(query, {
    variables: { locale: toSiteLocale(locale) },
    includeDrafts: isDraftModeEnabled,
  });

  return (
    <>
      {/*
        Enable click-to-edit overlays in draft mode only.

        The ContentLink component provides two editing experiences:
        1. On the standalone website: Click any content to open DatoCMS editor in a new tab
        2. Inside Web Previews plugin Visual mode: Click content to instantly edit in the side panel

        Only rendered in draft mode since the required stega-encoded metadata
        is only included in draft content responses (see executeQuery.ts).
      */}
      {isDraftModeEnabled && <ContentLink />}
      <SiteHeader
        siteName={_site.globalSeo?.siteName ?? null}
        locale={toSiteLocale(locale)}
        isDraftModeEnabled={isDraftModeEnabled}
      />
      <main>{children}</main>
    </>
  );
}
