import createNextIntlPlugin from 'next-intl/plugin';

/*
 * The plugin points next-intl at the request config, which is what makes
 * `getTranslations()` and `getLocale()` work on the server. Our config lives
 * under src/lib/i18n with the rest of the locale wiring, not at the default
 * path.
 */
const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
