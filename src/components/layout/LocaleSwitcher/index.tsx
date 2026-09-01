'use client';

import '@/components/layout/LocaleSwitcher/index.css';
import {
  SUPPORTED_LOCALES,
  type SiteLocale,
  localizePathname,
  stripLocalePrefix,
} from '@/lib/i18n/locales';
import { pagePathname } from '@/lib/routing/pagePath';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/*
 * Sends you to the same page in the other language, not to its home.
 *
 * Doing that needs two things a layout does not have: the path you are on, and
 * the slug that path has in every language. The first comes from `usePathname`,
 * which is why this is a client component; the second is handed down as a small
 * table built from the same query the shell already runs.
 *
 * A path that is not a page record, the styleguide or a 404, matches nothing and
 * falls back to the home of the chosen language.
 */

export type SlugsByLocale = Partial<Record<SiteLocale, string>>;

type Props = {
  label: string;
  locale: SiteLocale;
  pages: SlugsByLocale[];
};

export default function LocaleSwitcher({ label, locale, pages }: Props) {
  const pathname = usePathname();
  const current = stripLocalePrefix(pathname).replace(/^\//, '');

  const page = pages.find((slugs) => slugs[locale] === (current === '' ? 'home' : current));

  return (
    <nav className="locale-switcher" aria-label={label}>
      {SUPPORTED_LOCALES.map((supported) => {
        const slug = page?.[supported];

        return (
          <Link
            key={supported}
            href={slug ? pagePathname(slug, supported) : localizePathname('/', supported)}
            hrefLang={supported}
            aria-current={supported === locale ? 'true' : undefined}
          >
            {supported.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
