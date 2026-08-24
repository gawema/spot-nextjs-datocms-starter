import '@/components/layout/SiteHeader/index.css';
import DraftModeToggler from '@/components/dev/DraftModeToggler';
import { SUPPORTED_LOCALES, type SiteLocale, localizePathname } from '@/lib/i18n/locales';
import Link from 'next/link';

/*
 * The site header: the brand, the language switcher and the draft-mode toggle.
 *
 * The name comes from the project's SEO preferences in DatoCMS, so a client
 * project never edits it here. Each language links to its own home rather than
 * to the translation of the current page: the translated slug is known by the
 * page route, not by a layout, and a real switcher belongs there.
 */

type Props = {
  siteName: string | null;
  locale: SiteLocale;
  isDraftModeEnabled: boolean;
};

export default function SiteHeader({ siteName, locale, isDraftModeEnabled }: Props) {
  return (
    <header className="site-header padding-horizontal-padding-global">
      <div className="site-header__inner">
        <Link className="site-header__brand" href={localizePathname('/', locale)}>
          {siteName}
        </Link>

        <div className="site-header__end">
          <nav className="site-header__locales" aria-label="Language">
            {SUPPORTED_LOCALES.map((supported) => (
              <Link
                key={supported}
                href={localizePathname('/', supported)}
                hrefLang={supported}
                aria-current={supported === locale ? 'true' : undefined}
              >
                {supported.toUpperCase()}
              </Link>
            ))}
          </nav>

          <DraftModeToggler draftModeEnabled={isDraftModeEnabled} />
        </div>
      </div>
    </header>
  );
}
