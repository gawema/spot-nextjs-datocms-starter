import '@/components/layout/SiteHeader/index.css';
import Link from '@/components/blocks/Link';
import DraftModeToggler from '@/components/dev/DraftModeToggler';
import { SiteHeaderFragment } from '@/components/layout/SiteHeader/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { SUPPORTED_LOCALES, type SiteLocale, localizePathname } from '@/lib/i18n/locales';
import NextLink from 'next/link';

/*
 * The site header: brand, navigation, language switcher and the draft-mode
 * toggle.
 *
 * Logo and menu come from the Layout singleton, the name from the project's SEO
 * preferences, so nothing here is hardcoded. Each language links to its own home
 * rather than to the translation of the current page: the translated slug is
 * known by the page route, not by a layout.
 *
 * The second menu level opens on hover and on keyboard focus, with no
 * JavaScript. On touch there is nothing to hover, so tapping a parent entry
 * follows its link: a real mobile menu is a client component, and a project that
 * needs one builds it here.
 */

type Props = {
  data: FragmentOf<typeof SiteHeaderFragment> | null;
  siteName: string | null;
  locale: SiteLocale;
  isDraftModeEnabled: boolean;
};

export default function SiteHeader({ data, siteName, locale, isDraftModeEnabled }: Props) {
  const layout = data ? readFragment(SiteHeaderFragment, data) : null;
  const logo = layout?.logo;

  return (
    <header className="site-header padding-horizontal-padding-global">
      <div className="site-header__inner">
        <NextLink className="site-header__brand" href={localizePathname('/', locale)}>
          {logo?.url ? (
            /* eslint-disable-next-line @next/next/no-img-element --
             * A CMS logo is served by an image CDN at its intrinsic size and is
             * often an SVG, so there is nothing for next/image to optimise. */
            <img
              src={logo.url}
              alt={logo.alt ?? siteName ?? ''}
              width={logo.width ?? undefined}
              height={logo.height ?? undefined}
            />
          ) : (
            siteName
          )}
        </NextLink>

        {layout && layout.navigation.length > 0 ? (
          <nav className="site-nav" aria-label="Main">
            <ul className="site-nav__list">
              {layout.navigation.map((item) => (
                <li className="site-nav__item" key={item.id}>
                  <Link data={item.link} locale={locale} className="site-nav__link" />

                  {item.dropdown.length > 0 ? (
                    <ul className="site-nav__dropdown">
                      {item.dropdown.map((child) => (
                        <li key={child.id}>
                          <Link data={child} locale={locale} className="site-nav__link" />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="site-header__end">
          <nav className="site-header__locales" aria-label="Language">
            {SUPPORTED_LOCALES.map((supported) => (
              <NextLink
                key={supported}
                href={localizePathname('/', supported)}
                hrefLang={supported}
                aria-current={supported === locale ? 'true' : undefined}
              >
                {supported.toUpperCase()}
              </NextLink>
            ))}
          </nav>

          <DraftModeToggler draftModeEnabled={isDraftModeEnabled} />
        </div>
      </div>
    </header>
  );
}
