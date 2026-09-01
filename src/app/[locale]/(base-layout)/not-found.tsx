import SectionContainer from '@/components/layout/SectionContainer';
import { isSupportedLocale, localizePathname } from '@/lib/i18n/locales';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

/*
 * Rendered inside the site shell, so a visitor who lands on a dead URL still
 * gets the header, the navigation and the footer instead of a bare page.
 *
 * Next does not pass params to a not-found file, so the locale comes from
 * next-intl's request config, which reads it from the URL segment. It is
 * validated here rather than run through `toSiteLocale`: that helper answers an
 * unknown locale with `notFound()`, which from inside the not-found page would
 * be a loop.
 */
export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations();

  const home = isSupportedLocale(locale) ? localizePathname('/', locale) : '/';

  return (
    <SectionContainer className="padding-vertical-large">
      <h1>{t('t_404_title')}</h1>
      <p>{t('t_404_text')}</p>
      <Link className="cms-link" href={home}>
        {t('t_404_link')}
      </Link>
    </SectionContainer>
  );
}
