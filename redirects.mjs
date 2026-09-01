/**
 * The legacy URL map for the go-live switch, consumed by next.config.mjs.
 *
 * Empty in the starter, and one of the first things a project fills: the site
 * replaces an existing one, and every URL Google has indexed either lands
 * somewhere or becomes a 404 the day the DNS changes. Build the list from the
 * old site's sitemaps, not from memory.
 *
 * Sources are written WITHOUT a trailing slash: `trailingSlash` is false, so
 * Next normalises `/service/` to `/service` before matching.
 */

/**
 * Old paths on this project's own domain, mapped to new ones.
 *
 * Resist a blanket `/:path*` rule here. A CMS-driven site serves plenty of URLs
 * that were never indexed, and sending all of them to the home page turns 404s
 * into soft 404s, which is worse: a 404 is a clear signal, a soft 404 is a
 * page Google keeps checking.
 *
 * @type {Record<string, string>}
 */
export const legacyPaths = {
  // '/de/ueber-uns': '/ueber-uns',
};

/**
 * Domains the project retires but keeps pointing at this deployment, usually
 * because they still have inbound links. Add each one to the Vercel project,
 * then map what is worth mapping: the catch-all below sends everything else to
 * the home page, so a retired domain never serves the whole site as duplicate
 * content.
 *
 * @type {{ host: string; paths: Record<string, string> }[]}
 */
export const legacyDomains = [
  // { host: 'old-domain.ch', paths: { '/kontakt': '/kontakt' } },
];
