import { graphql } from '@/lib/datocms/graphql';

export const PrivacyFragment = graphql(/* GraphQL */ `
  fragment PrivacyFragment on SiteSettingRecord {
    cid
    gtm
  }
`);
