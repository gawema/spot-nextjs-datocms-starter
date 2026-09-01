import ContentLink from '@/components/cms/ContentLink';
import PageTransition from '@/components/layout/PageTransition';
import Privacy from '@/components/layout/Privacy';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { toSiteLocale } from '@/lib/i18n/params';
import { LayoutQuery } from '@/lib/query/layoutQuery';
import { SITE_URL } from '@/lib/seo/site';
import { draftMode } from 'next/headers';
import { toNextMetadata } from 'react-datocms/seo';

import '../../global.css';
import { Metadata } from 'next';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  const data = await executeQuery(LayoutQuery, {
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

  const { _site, layout, siteSetting, allPages } = await executeQuery(LayoutQuery, {
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
      {/*
        The reveal hides a section until an observer sees it, which without
        JavaScript would mean hiding it forever. This is the one place that can
        say "no JavaScript" to the stylesheet.
      */}
      <noscript>
        <style>{'.section-container { opacity: 1 !important; transform: none !important; }'}</style>
      </noscript>
      <SiteHeader
        data={layout}
        pages={allPages.map((page) =>
          Object.fromEntries(
            (page._allSlugLocales ?? []).map(({ locale: l, value }) => [l, value]),
          ),
        )}
        siteName={_site.globalSeo?.siteName ?? null}
        locale={toSiteLocale(locale)}
        isDraftModeEnabled={isDraftModeEnabled}
      />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter data={layout} locale={toSiteLocale(locale)} />
      <Privacy data={siteSetting} />
    </>
  );
}
