import { graphql } from '@/lib/datocms/graphql';

/**
 * The interface wording, edited in the CMS. Feeds next-intl through
 * `src/lib/i18n/request.ts`, so components keep using `t('key')` and never know
 * where the strings came from.
 */
export const SiteSettingQuery = graphql(/* GraphQL */ `
  query SiteSettingQuery {
    siteSetting {
      translations
    }
  }
`);
