import { graphql } from '@/lib/datocms/graphql';

/*
 * The raw values the site graph needs. The footer selects the same social links
 * through `LinkFragment`, which keeps them masked: GraphQL merges the two
 * selections, so asking for the bare URL here costs nothing extra.
 */
export const SiteStructuredDataFragment = graphql(/* GraphQL */ `
  fragment SiteStructuredDataFragment on LayoutRecord {
    logo {
      url
    }
    socialLinks {
      externalUrl
    }
  }
`);
