import { executeQuery } from '@/lib/datocms/executeQuery';
import { pagePathname } from '@/lib/datocms/gqlUrlBuilder/page';
import { isSupportedLocale } from '@/lib/i18n/locales';
import { SitemapQuery } from '@/lib/query/sitemapQuery';
import { absoluteUrl } from '@/lib/seo/site';
import type { MetadataRoute } from 'next';

/*
 * One entry per existing translation, cross-linked with hreflang alternates, so
 * search engines learn that `/seite-zwei` and `/en/page-two` are the same page.
 *
 * The styleguide routes are absent by construction: only CMS pages are listed,
 * and robots.ts disallows them anyway.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { allPages } = await executeQuery(SitemapQuery);

  return allPages.flatMap((page) => {
    const slugs = new Map(page._allSlugLocales?.map(({ locale, value }) => [locale, value]) ?? []);
    const locales = page._locales.filter(isSupportedLocale);

    const languages = Object.fromEntries(
      locales.flatMap((locale) => {
        const slug = slugs.get(locale);
        return slug ? [[locale, absoluteUrl(pagePathname(slug, locale))]] : [];
      }),
    );

    return locales.flatMap((locale) => {
      const slug = slugs.get(locale);

      if (!slug) {
        return [];
      }

      return [
        {
          url: absoluteUrl(pagePathname(slug, locale)),
          lastModified: page._updatedAt,
          alternates: { languages },
        },
      ];
    });
  });
}
