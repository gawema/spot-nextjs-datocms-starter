import { IS_SITE_LIVE, SITE_URL } from '@/lib/seo/site';
import type { MetadataRoute } from 'next';

/** Vercel sets VERCEL_ENV on every deployment; previews must stay unindexed. */
const isProduction = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production';

export default function robots(): MetadataRoute.Robots {
  if (!isProduction || !IS_SITE_LIVE) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Route handlers and the internal styleguide pages.
        disallow: ['/api/', '/typography', '/spacing', '/ui'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
