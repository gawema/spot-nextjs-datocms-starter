import '@/components/layout/SiteHeader/index.css';
import Link from '@/components/blocks/Link';
import DraftModeToggler from '@/components/dev/DraftModeToggler';
import LocaleSwitcher, { type PageAlternates } from '@/components/layout/LocaleSwitcher';
import MenuPanel from '@/components/layout/SiteHeader/MenuPanel';
import { SiteHeaderFragment } from '@/components/layout/SiteHeader/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { type SiteLocale, localizePathname } from '@/lib/i18n/locales';
import { getTranslations } from 'next-intl/server';
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
 * One markup, two shapes. The Layout record decides whether the navigation is a
 * row with dropdowns that turns into a panel below the `sm` breakpoint, or a
 * Menu button at every width, and which edge the panel comes from. Only the
 * panel's open state is a client component: the menu is rendered on the server
 * either way.
 */

type Props = {
  data: FragmentOf<typeof SiteHeaderFragment> | null;
  siteName: string | null;
  locale: SiteLocale;
  pages: PageAlternates[];
  isDraftModeEnabled: boolean;
};

export default async function SiteHeader({
  data,
  siteName,
  locale,
  pages,
  isDraftModeEnabled,
}: Props) {
  const t = await getTranslations();
  const layout = data ? readFragment(SiteHeaderFragment, data) : null;
  const logo = layout?.logo;

  const menu =
    layout && layout.navigation.length > 0 ? (
      <nav className="site-nav" aria-label={t('t_nav_main')}>
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
    ) : null;

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

        {layout && menu ? (
          <>
            {/*
             * The menu markup appears twice on purpose. A closed `<dialog>` is
             * `display: none`, so the row that desktop shows cannot live inside
             * the panel. Only one of the two is ever displayed, so only one is
             * in the accessibility tree, and the cost is a few lines of HTML.
             */}
            <div className="site-header__row">{menu}</div>

            <MenuPanel
              label={t('t_menu')}
              closeLabel={t('t_close')}
              style={layout.navigationStyle}
              position={layout.panelPosition}
              orientation={layout.panelOrientation}
            >
              {menu}
            </MenuPanel>
          </>
        ) : null}

        <div className="site-header__end">
          <LocaleSwitcher label={t('t_nav_language')} locale={locale} pages={pages} />

          <DraftModeToggler
            draftModeEnabled={isDraftModeEnabled}
            enableLabel={t('t_draft_mode_enable')}
            disableLabel={t('t_draft_mode_disable')}
          />
        </div>
      </div>
    </header>
  );
}
