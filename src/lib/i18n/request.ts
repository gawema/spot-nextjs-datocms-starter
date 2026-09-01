import { executeQuery } from '@/lib/datocms/executeQuery';
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/i18n/locales';
import { SiteSettingQuery } from '@/lib/query/siteSettingQuery';
import { getRequestConfig } from 'next-intl/server';

/**
 * Loads the interface strings for next-intl from DatoCMS instead of from files
 * in the repository, so a client can reword a button without a deploy.
 *
 * It costs no extra request per visitor: the query goes through `executeQuery`,
 * which caches under the 'datocms' tag and is invalidated by the CMS webhook.
 */

/**
 * The field is a JSON blob, so it arrives as `unknown` and is validated here
 * rather than asserted. Anything that is not a string for the requested locale
 * is dropped, and a missing key surfaces in the page as the key itself.
 */
function messagesFor(locale: string, translations: unknown): Record<string, string> {
  if (typeof translations !== 'object' || translations === null) {
    return {};
  }

  const forLocale = Object.entries(translations).find(([key]) => key === locale)?.[1];

  if (typeof forLocale !== 'object' || forLocale === null) {
    return {};
  }

  const messages: Record<string, string> = {};

  for (const [key, value] of Object.entries(forLocale)) {
    if (typeof value === 'string') {
      messages[key] = value;
    }
  }

  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isSupportedLocale(requested) ? requested : DEFAULT_LOCALE;

  const { siteSetting } = await executeQuery(SiteSettingQuery);

  return {
    locale,
    messages: messagesFor(locale, siteSetting?.translations),
    // A key with no value renders as the key: visibly wrong beats invisibly empty.
    getMessageFallback: ({ key }) => key,
  };
});
