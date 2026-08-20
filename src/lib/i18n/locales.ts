/** IANA zone for Switzerland; required by next-intl for stable server/client formatting. */
export const SITE_TIME_ZONE = 'Europe/Zurich' as const;

export const DEFAULT_LOCALE = 'de' as const;
export const SECONDARY_LOCALES = ['en'] as const;
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, ...SECONDARY_LOCALES] as const;

export type SiteLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(value: string): value is SiteLocale {
  return SUPPORTED_LOCALES.includes(value as SiteLocale);
}

export function localeFromPathname(pathname: string): SiteLocale {
  const [, firstSegment = ''] = pathname.split('/');
  return isSupportedLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}

export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const [, firstSegment = '', ...rest] = normalized.split('/');

  if (!isSupportedLocale(firstSegment) || firstSegment === DEFAULT_LOCALE) {
    return normalized;
  }

  const rebuilt = `/${rest.join('/')}`;
  return rebuilt === '/' ? '/' : rebuilt.replace(/\/+$/, '') || '/';
}

/** Adds the locale prefix, except for the default locale which is served unprefixed. */
export function localizePathname(pathname: string, locale: SiteLocale): string {
  const basePath = stripLocalePrefix(pathname);
  if (locale === DEFAULT_LOCALE) {
    return basePath;
  }
  if (basePath === '/') {
    return `/${locale}`;
  }
  return `/${locale}${basePath}`;
}

export function localizeInternalHref(href: string, locale: SiteLocale): string {
  if (!href.startsWith('/')) {
    return href;
  }
  return localizePathname(href, locale);
}
