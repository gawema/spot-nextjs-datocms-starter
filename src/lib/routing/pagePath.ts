import { type SiteLocale, localizePathname } from '@/lib/i18n/locales';

/**
 * The page whose slug is this is served at the site root. Both the URL builder
 * and the routes read the constant, so `/` stays the only URL for that record.
 */
export const HOME_SLUG = 'home';

/**
 * The path of a page, given its slug in that language.
 *
 * A leaf module on purpose: the locale switcher is a client component and needs
 * this rule, and importing it from the GraphQL URL builder would drag gql.tada
 * into the browser bundle.
 */
export function pagePathname(slug: string, locale: SiteLocale): string {
  return localizePathname(slug === HOME_SLUG ? '/' : `/${slug}`, locale);
}
