/**
 * Where the site lives, and whether it is meant to be indexed yet.
 *
 * `NEXT_PUBLIC_SITE_URL` wins when set, which is what a project does once it has
 * a real domain. Otherwise Vercel's production alias is used, so a fresh deploy
 * produces correct absolute URLs with nothing to configure, and locally it falls
 * back to the dev server.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;

  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();

/**
 * Set `SITE_LIVE=false` while the domain still points at the old website: robots
 * then disallows everything. Anything other than the literal `false` counts as
 * live, so forgetting the variable does not accidentally hide the site.
 */
export const IS_SITE_LIVE = process.env.SITE_LIVE !== 'false';

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}
