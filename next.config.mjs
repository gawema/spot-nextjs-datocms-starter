import createNextIntlPlugin from 'next-intl/plugin';

/*
 * The plugin points next-intl at the request config, which is what makes
 * `getTranslations()` and `getLocale()` work on the server. Our config lives
 * under src/lib/i18n with the rest of the locale wiring, not at the default
 * path.
 */
const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
   * `next build` and `next dev` both write to `.next` and overwrite each other's
   * manifests, which leaves a running dev server answering 500. Set
   * NEXT_DIST_DIR to build while one is up.
   */
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
};

export default withNextIntl(nextConfig);
