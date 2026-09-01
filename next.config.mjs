import createNextIntlPlugin from 'next-intl/plugin';
import { legacyDomains, legacyPaths } from './redirects.mjs';

/*
 * The plugin points next-intl at the request config, which is what makes
 * `getTranslations()` and `getLocale()` work on the server. Our config lives
 * under src/lib/i18n with the rest of the locale wiring, not at the default
 * path.
 */
const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

/*
 * Redirects run before the proxy (src/proxy.ts), so they win over next-intl's
 * locale handling and a legacy URL never reaches the locale routing.
 */
function buildRedirects() {
  const own = Object.entries(legacyPaths).map(([source, destination]) => ({
    source,
    destination,
    permanent: true,
  }));

  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '');

  if (legacyDomains.length > 0 && !origin) {
    console.warn(
      'redirects.mjs lists retired domains, but NEXT_PUBLIC_SITE_URL is not set: ' +
        'a cross-domain redirect needs an absolute destination, so they are skipped.',
    );
  }

  const siblings =
    origin === undefined
      ? []
      : legacyDomains.flatMap(({ host, paths }) => {
          // `has` values are anchored regexes, so this matches the apex and www only.
          const has = [{ type: 'host', value: `(www\\.)?${host.replace(/\./g, '\\.')}` }];

          return [
            ...Object.entries(paths).map(([source, destination]) => ({
              source,
              has,
              destination: `${origin}${destination}`,
              permanent: true,
            })),
            /*
             * One catch-all per retired domain, last so the mapped paths above
             * win. Without it the domain would serve the whole site twice.
             */
            { source: '/:path*', has, destination: `${origin}/`, permanent: true },
          ];
        });

  /*
   * Sibling rules first: `own` has no host constraint, so it would otherwise
   * hijack shared paths on the retired domains and redirect them relatively.
   */
  return [...siblings, ...own];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: buildRedirects,
  /*
   * `next build` and `next dev` both write to `.next` and overwrite each other's
   * manifests, which leaves a running dev server answering 500. Set
   * NEXT_DIST_DIR to build while one is up.
   */
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
};

export default withNextIntl(nextConfig);
