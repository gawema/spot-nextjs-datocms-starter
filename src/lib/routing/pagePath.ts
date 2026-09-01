import { type SiteLocale, localizePathname } from '@/lib/i18n/locales';

/**
 * What the URL of a page depends on: its slug, and whether it is the one page
 * served at the site root.
 */
export type PageRoute = {
  slug: string;
  isHome: boolean;
};

/**
 * The path of a page in a given language.
 *
 * A leaf module on purpose: the locale switcher is a client component and needs
 * this rule, and importing it from the GraphQL URL builder would drag gql.tada
 * into the browser bundle.
 */
export function pagePathname({ slug, isHome }: PageRoute, locale: SiteLocale): string {
  return localizePathname(isHome ? '/' : `/${slug}`, locale);
}
