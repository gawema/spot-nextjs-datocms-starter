import { LinkFragment } from '@/components/blocks/Link';
import { graphql } from '@/lib/datocms/graphql';

export const SiteFooterFragment = graphql(
  /* GraphQL */ `
    fragment SiteFooterFragment on LayoutRecord {
      footerText
      footerLinks {
        id
        ...LinkFragment
      }
      socialLinks {
        id
        ...LinkFragment
      }
    }
  `,
  [LinkFragment],
);
