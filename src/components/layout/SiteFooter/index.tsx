import '@/components/layout/SiteFooter/index.css';
import Link from '@/components/blocks/Link';
import { SiteFooterFragment } from '@/components/layout/SiteFooter/fragment';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { SiteLocale } from '@/lib/i18n/locales';
import { getTranslations } from 'next-intl/server';

type Props = {
  data: FragmentOf<typeof SiteFooterFragment> | null;
  locale: SiteLocale;
};

export default async function SiteFooter({ data, locale }: Props) {
  if (!data) {
    return null;
  }

  const t = await getTranslations();

  const { footerText, footerLinks, socialLinks } = readFragment(SiteFooterFragment, data);

  return (
    <footer className="site-footer padding-horizontal-padding-global padding-vertical-main">
      <div className="site-footer__inner">
        {footerText ? <p className="site-footer__text">{footerText}</p> : null}

        {footerLinks.length > 0 ? (
          <nav className="site-footer__links" aria-label={t('t_nav_footer')}>
            {footerLinks.map((link) => (
              <Link key={link.id} data={link} locale={locale} className="site-footer__link" />
            ))}
          </nav>
        ) : null}

        {socialLinks.length > 0 ? (
          <nav className="site-footer__links" aria-label={t('t_nav_social')}>
            {socialLinks.map((link) => (
              <Link key={link.id} data={link} locale={locale} className="site-footer__link" />
            ))}
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
