import { localizeInternalHref } from '@/lib/i18n/locales';
import { toSiteLocale } from '@/lib/i18n/params';
import type { Metadata } from 'next';
import Link from 'next/link';
import './styleguide.css';

/*
 * Internal reference pages for the design system: /typography, /spacing, /ui.
 * They live inside the locale segment so the layout above resolves normally,
 * but they hold no CMS content and read the same way in every language.
 *
 * Static segments win over the `[[...slug]]` catch-all, so a page record can
 * never take one of these URLs.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const PAGES = [
  { href: '/typography', label: 'Typography' },
  { href: '/spacing', label: 'Spacing' },
  { href: '/ui', label: 'UI' },
];

export default async function StyleguideLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="styleguide padding-horizontal-padding-global padding-vertical-main">
      <nav className="styleguide__nav">
        {PAGES.map((page) => (
          <Link key={page.href} href={localizeInternalHref(page.href, toSiteLocale(locale))}>
            {page.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
